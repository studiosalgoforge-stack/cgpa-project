"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function PredictCGPA() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [inputs, setInputs] = useState<{ [key: string]: string }>({
    Previous_Semester_GPA: "",
    Midterm_Score_Average: "",
    Assignment_Score_Average: "",
    Twelfth_Grade_Percentage: "",
    Tenth_Grade_Percentage: "",
    Study_Hours_Per_Day: "",
    Attendance_Percentage: "",
    Number_of_Backlogs: "",
    Mental_Stress_Score: "",
    Distance_From_Campus_KM: "",
  });

  function handleChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  async function submitInputs() {
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`/api/students/${id}/predict-cgpa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inputs),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/dashboard/students/${id}/analyze-notes`);
    } else {
      alert("Failed to save academic inputs");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Academic Inputs</h2>

      {Object.keys(inputs).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key.replace(/_/g, " ")}
          value={inputs[key]}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />
      ))}

      <button
        onClick={submitInputs}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Save & Next
      </button>
    </div>
  );
}
