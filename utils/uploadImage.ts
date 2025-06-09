import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

if (!PROJECT_URL || !SUPABASE_API_KEY) {
    throw new Error("supabase url or api key is missing for uploading user profile picture.");
}
const supabase = createClient(PROJECT_URL, SUPABASE_API_KEY);

export async function uploadFile(fileBuffer: Buffer, fileName: string, userId: String) {
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
