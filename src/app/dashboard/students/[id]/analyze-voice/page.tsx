"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AnalyzeVoicePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  async function submitVoice(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Add audio");
    const fd = new FormData();
    fd.append("file", file);


    const token = localStorage.getItem("token") || "";
    const res = await fetch(`/api/analyze/voice?studentId=${id}`, {
         method: "POST",
          body: fd,
           headers: { Authorization: `Bearer ${token}` }});
    if (res.ok) {
      router.push(`/dashboard/students/${id}/result`);
    } else {
      const j = await res.json();
      alert(j.message || "Voice analysis failed");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Analyze Voice</h2>
      <form onSubmit={submitVoice} className="space-y-4">
        <input type="file" accept="audio/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Upload & Analyze</button>
        </div>
      </form>
    </div>
  );
}
