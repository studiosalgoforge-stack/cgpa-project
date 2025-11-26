import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Student from "@/lib/models/Student";

// The named export for the GET HTTP method is required by Next.js App Router
export async function GET(req) {
  try {
    await connect();

    // 1. Fetch all student records from the MongoDB collection
    // .lean() is used for performance when reading data
    const students = await Student.find({}).lean();

    // 2. Return the list of students
    return NextResponse.json(students);

  } catch (error) {
    console.error("Error fetching student list:", error);
    // Return a 500 status with an error message
    return NextResponse.json(
      { message: "Failed to load student records", error: error.message },
      { status: 500 }
    );
  }
}