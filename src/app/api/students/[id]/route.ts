import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connect();

    const student = await Student.findById(id).lean();

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);

  } catch (err) {
    console.error("Error fetching student:", err);
    return NextResponse.json(
      { message: "Server error fetching student" },
      { status: 500 }
    );
  }
}
