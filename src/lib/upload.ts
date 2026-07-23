import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveUploadedFile(file: File, folder: string = "assessments"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);
  return `/uploads/${folder}/${fileName}`;
}
