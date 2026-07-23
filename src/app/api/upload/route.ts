import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const fileUrls: string[] = [];
    for (const file of files) {
      const url = await saveUploadedFile(file, "assessments");
      fileUrls.push(url);
    }

    return NextResponse.json({ urls: fileUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
