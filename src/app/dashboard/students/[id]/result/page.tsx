'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Award, Save, CheckCircle, AlertTriangle, FileText, Mic, Database, Volume2 } from 'lucide-react';

export default function ResultPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [student, setStudent] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState('');

    // Fetch student data
    useEffect(() => {
        if (!id) return;
        (async () => {
            const token = localStorage.getItem("token") || "";
            try {
                const res = await fetch(`/api/students/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setStudent(await res.json());
                else setError("Failed to fetch student data.");
            } catch {
                setError("Network error while fetching student data.");
            }
        })();
    }, [id]);

    // Save final result
    async function handleSaveResult() {
        if (saveSuccess) return;
        setIsSaving(true);
        setError('');
        const token = localStorage.getItem("token") || "";
        try {
            const res = await fetch(`/api/students/${id}/save-result`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => router.push("/dashboard"), 1500);
            } else {
                const j = await res.json();
                setError(j.message || "Failed to save record.");
            }
        } catch {
            setError("Network error while saving.");
        } finally {
            setIsSaving(false);
        }
    }

// ScoreCard Props interface
interface ScoreCardProps {
    title: string;
    score: number | null | undefined;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Helper for color coding score
const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'text-gray-500 bg-gray-100';
    if (score >= 8.5) return 'text-green-600 bg-green-50';
    if (score >= 7.0) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-600 bg-red-50';
};

// ScoreCard Component
const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, icon: Icon }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
        <Icon className="w-6 h-6 mb-1 text-indigo-500" />
        <h4 className="font-medium text-xs text-gray-500 uppercase">{title}</h4>
        <p className={`text-2xl font-extrabold ${getScoreColor(score)} rounded-lg px-3 py-1 mt-1`}>
            {score !== null && score !== undefined ? score.toFixed(2) : "N/A"}
        </p>
    </div>
);


    if (!student) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-500" />
                <p className="text-lg text-gray-700">Loading Final Analysis...</p>
            </div>
        </div>
    );

    const cgpa = student.cgpaPrediction;
    const notes = student.notesAnalysis || {};
    const voice = student.voiceAnalysis || {};

    return (
        <div className="min-h-screen bg-[#f5f7ff]">
            {/* Header */}
            <div className="w-full h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden flex items-center justify-center">
                <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">Student Performance Result</h1>
            </div>

            {/* <div className="max-w-6xl mx-auto px-6 -mt-24 pb-20"> */}
             <div className="max-w-5xl mx-auto px-6 -mt-24 pb-20 relative z-10"> 
                <button onClick={() => router.push('/dashboard')} className="flex items-center text-white hover:text-yellow-300 font-medium mb-8 p-1 rounded transition bg-black bg-opacity-30" > <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard </button>

                {/* CGPA Card */}
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-indigo-200 text-center">
                    <Award className="w-16 h-16 text-yellow-500 mx-auto drop-shadow-lg" />
                    <p className="mt-4 text-gray-600">Student: <span className="font-semibold">{student.name}</span> (Roll No: {student.rollNo})</p>
                    <div className="mt-6 bg-indigo-600 text-white px-12 py-8 rounded-2xl shadow-2xl inline-block transform hover:scale-105 transition duration-300">
                        <p className="text-sm tracking-widest opacity-80">PREDICTED CGPA</p>
                        <p className="text-7xl font-black mt-2">{cgpa !== null ? cgpa.toFixed(2) : 'N/A'}</p>
                        <p className="text-md mt-2 font-medium bg-white text-indigo-600 px-4 py-1 rounded-full inline-block">
                            {student.academicStatus || 'Awaiting Prediction'}
                        </p>
                    </div>
                </div>

                {/* Analysis Panels */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Notes Panel */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                        <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center"><FileText className="w-5 h-5 mr-2" /> Notes Analysis</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <ScoreCard title="Clarity Score" score={notes.focusClarityScore} icon={Database} />
                            <ScoreCard title="Keywords" score={notes.keywords?.length} icon={Database} />
                            <ScoreCard title="OCR Score" score={notes.score} icon={Database} />
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-700">OCR Excerpt:</p>
                        <p className="text-xs italic text-gray-500 bg-gray-50 p-2 rounded max-h-28 overflow-y-auto">{notes.text || "No text available."}</p>
                        {notes.analysis?.clarity_explanation && (
                            <p className="mt-2 text-xs text-gray-600 italic">{notes.analysis.clarity_explanation}</p>
                        )}
                    </div>

                    {/* Voice Panel */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500">
                        <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center"><Volume2 className="w-5 h-5 mr-2" /> Voice Analysis</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <ScoreCard title="Clarity" score={voice.clarity} icon={Mic} />
                            <ScoreCard title="Confidence" score={voice.confidence} icon={Mic} />
                            <ScoreCard title="Engagement" score={voice.energyEngagement} icon={Mic} />
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-700">Transcription:</p>
                        <p className="text-xs italic text-gray-500 bg-gray-50 p-2 rounded max-h-28 overflow-y-auto">{voice.summary || "No transcription available."}</p>
                    </div>

                </div>

                {/* Final Save */}
                <div className="mt-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5" /> <span>Error: {error}</span>
                        </div>
                    )}
                    {saveSuccess ? (
                        <div className="text-center py-6 bg-green-50 rounded-lg border border-green-300">
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3 animate-bounce" />
                            <p className="text-xl font-semibold text-green-700">Record Saved Successfully!</p>
                            <p className="text-sm text-gray-600">Redirecting...</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">Review and finalize this result.</p>
                            <button
                                onClick={handleSaveResult}
                                disabled={isSaving || cgpa === null || cgpa === undefined}
                                className={`px-10 py-4 text-white font-bold rounded-full shadow-lg transition flex items-center mx-auto space-x-2
                                    ${isSaving || cgpa === null ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'}`}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> <span>Save & Complete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
