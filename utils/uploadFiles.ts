import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const apiKey = process.env.SUPABASE_API_KEY;
  if (!projectUrl || !apiKey) {
    throw new Error("File storage is not configured");
  }
  return createClient(projectUrl, apiKey);
}

// function for uploading images like in profile picture.
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  userId: String
) {
  const supabase = getSupabase();
  const filePath = `user-image/${userId}-${Date.now()}-${fileName}`;
  const { data, error } = await supabase.storage
    .from("profile-picture")
    .upload(filePath, fileBuffer);
  if (error) {
    throw error;
  }

  return supabase.storage.from("profile-picture").getPublicUrl(filePath).data
    .publicUrl;
}


// function for uploading pdf files like in certification section
export async function uploadPdfFile(
  fileBuffer: Buffer,
  fileName: string,
  userId: String
) {
  const supabase = getSupabase();
  const filePath = `certifications/${userId}-${Date.now()}-${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("certificates")
      .upload(filePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  
    const publicUrl = supabase.storage
      .from("certificates")
      .getPublicUrl(filePath).data.publicUrl;

    return publicUrl;
  } catch (uploadError) {
    console.error("Error in uploadPdfFile:", uploadError);
    throw uploadError;
  }
}
