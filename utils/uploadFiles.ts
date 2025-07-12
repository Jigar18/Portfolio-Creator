import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

if (!PROJECT_URL || !SUPABASE_API_KEY) {
  throw new Error(
    "supabase url or api key is missing for uploading user profile picture."
  );
}
const supabase = createClient(PROJECT_URL, SUPABASE_API_KEY);

// function for uploading images like in profile picture.
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  userId: String
) {
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
