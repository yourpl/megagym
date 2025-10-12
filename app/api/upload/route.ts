import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "proofs");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const filepath = join(uploadDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    const url = `/uploads/proofs/${filename}`;

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: error.message || "Error uploading file" },
      { status: 500 }
    );
  }
}
