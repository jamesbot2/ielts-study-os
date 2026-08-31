import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile, type StudyProfile } from "@/lib/db/store";

export async function GET() {
  return NextResponse.json(getProfile());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<StudyProfile>;
  const profile = saveProfile({ ...getProfile(), ...body });
  return NextResponse.json(profile);
}
