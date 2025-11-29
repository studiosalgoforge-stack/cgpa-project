"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  _id: string;
  name: string;
  email: string;
  cgpaStatus: "pending" | "in-progress" | "completed";
}

function getAuthToken() {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split(";")
    .map((row) => row.trim()) 
    .find((row) => row.startsWith("auth_token="));

  return match ? match.split("=")[1] : null;
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);

  // Load students from API
  async function load() {
    const token = getAuthToken();
    if (!token) return; 
    
    const res = await fetch("/api/students/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Handle specific API unauthorized response as a fallback to client redirect
    if (res.status === 401) {
        router.push("/auth/teacher/login");
        return;
    }  
    const json = await res.json();
    setStudents(json || []);
  }
  // Delete student
  async function handleDelete(id: string) {
    const token = getAuthToken();
    if (!token) return; // Should not happen on a protected route
    
    const res = await fetch(`/api/students/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Fallback: If delete fails due to auth issue
    if (res.status === 401) {
        router.push("/auth/teacher/login");
        return;
    }
    
    load();
  }

  useEffect(() => {
    load();
  }, []);
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Students</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {students.map((s) => (
                <motion.tr
                  key={s._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        s.cgpaStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : s.cgpaStatus === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {s.cgpaStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/student/${s._id}`)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Next Step
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
