const TARGET_VIDEO_BYTES = 28 * 1024 * 1024;
const AUDIO_BITRATE = 96_000;
const MAX_VIDEO_BITRATE = 4_000_000;
const MIN_VIDEO_BITRATE = 500_000;

type OutputProfile = {
  extension: "mp4" | "webm";
  mimeType: "video/mp4" | "video/webm";
  videoCodec: "avc" | "vp9";
  audioCodec: "aac" | "opus";
};

const OUTPUT_PROFILES: OutputProfile[] = [
  { extension: "mp4", mimeType: "video/mp4", videoCodec: "avc", audioCodec: "aac" },
  { extension: "webm", mimeType: "video/webm", videoCodec: "vp9", audioCodec: "opus" },
];

function getOutputDimensions(width: number, height: number) {
  const scale = Math.min(1, 1280 / width, 720 / height);
  return {
    width: Math.max(2, Math.floor((width * scale) / 2) * 2),
    height: Math.max(2, Math.floor((height * scale) / 2) * 2),
  };
}

function getVideoBitrate(duration: number) {
  const availableBitrate = (TARGET_VIDEO_BYTES * 8 * 0.96) / duration - AUDIO_BITRATE;
  return Math.round(Math.min(MAX_VIDEO_BITRATE, Math.max(MIN_VIDEO_BITRATE, availableBitrate)));
}

function outputName(sourceName: string, extension: OutputProfile["extension"]) {
  const baseName = sourceName.replace(/\.[^.]+$/, "") || "project-demo";
  return `${baseName}-optimized.${extension}`;
}

export async function compressProjectVideo(file: File, duration: number, onProgress: (progress: number) => void) {
  const {
    ALL_FORMATS,
    BlobSource,
    BufferTarget,
    Conversion,
    Input,
    Mp4OutputFormat,
    Output,
    WebMOutputFormat,
  } = await import("mediabunny");

  if (!("VideoEncoder" in window && "VideoDecoder" in window)) {
    throw new Error("Video optimization is not supported in this browser. Please use the latest Chrome or Edge.");
  }

  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const [videoTrack, audioTrack] = await Promise.all([
      input.getPrimaryVideoTrack(),
      input.getPrimaryAudioTrack(),
    ]);
    if (!videoTrack) throw new Error("This file does not contain a readable video track.");

    const [sourceWidth, sourceHeight] = await Promise.all([
      videoTrack.getDisplayWidth(),
      videoTrack.getDisplayHeight(),
    ]);
    const dimensions = getOutputDimensions(sourceWidth, sourceHeight);
    const bitrate = getVideoBitrate(duration);

    for (const profile of OUTPUT_PROFILES) {
      const target = new BufferTarget();
      const output = new Output({
        format: profile.extension === "mp4" ? new Mp4OutputFormat({ fastStart: "in-memory" }) : new WebMOutputFormat(),
        target,
      });
      const conversion = await Conversion.init({
        input,
        output,
        tracks: "primary",
        video: {
          ...dimensions,
          codec: profile.videoCodec,
          bitrate,
          frameRate: 30,
          forceTranscode: true,
          hardwareAcceleration: "prefer-hardware",
          keyFrameInterval: 4,
        },
        audio: {
          codec: profile.audioCodec,
          bitrate: AUDIO_BITRATE,
          forceTranscode: true,
        },
        tags: {},
      });

      if (!conversion.isValid || (audioTrack && !conversion.utilizedTracks.includes(audioTrack))) continue;

      conversion.onProgress = (progress) => onProgress(Math.min(99, Math.round(progress * 100)));
      try {
        await conversion.execute();
      } catch {
        onProgress(0);
        continue;
      }
      if (!target.buffer) throw new Error("The optimized video could not be created.");

      onProgress(100);
      return new File([target.buffer], outputName(file.name, profile.extension), { type: profile.mimeType });
    }

    throw new Error("This browser cannot encode the selected video. Please use the latest Chrome or Edge.");
  } finally {
    input.dispose();
  }
}
