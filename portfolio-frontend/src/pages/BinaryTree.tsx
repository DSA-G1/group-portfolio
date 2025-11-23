import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const CARD_BG = "#69054a";
const BTN_BG = "#ef81bb";
const INPUT_BG = "#1f1131";

const BinaryTree = () => {
  const [newStudentName, setNewStudentName] = useState("");
  const [searchName, setSearchName] = useState("");
  const toast = useToast();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleAddStudent = () => {
    // placeholder action - integrate with API later
    toast?.toast?.({ title: "Add Student", description: `Added ${newStudentName || "(empty)"}` });
    setNewStudentName("");
  };

  const handleSearch = () => {
    toast?.toast?.({ title: "Search", description: `Searching for ${searchName || "(empty)"}` });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: "url('/background/home-page.png')" }}>

      <Header />

      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <h1 className="font-header text-4xl md:text-5xl text-center mb-6">
            <span className="text-foreground">BINARY </span>
            <span className="text-primary">TREE PROJECT</span>
          </h1>
          <p className="font-body text-base text-center text-foreground mb-8 max-w-4xl mx-auto">
            This page shows a visual layout of student management cards and score tree visualization. The cards follow the requested design.
          </p>

          {/* Top area: left column controls + right column student records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: stacked cards */}
            <div className="space-y-6">
              {/* Level 1: Student Management */}
              <div
                className="rounded-2xl p-6"
                style={{ background: CARD_BG, border: "2px solid rgba(255,255,255,0.9)" }}>
                <h2 className="text-white text-xl font-semibold mb-4">Level 1: Student Management</h2>
                <p className="text-sm text-gray-200 mb-4">BST organized by student name</p>

                <label className="block text-sm text-gray-100 mb-2">Add New Student</label>
                <input
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Enter Full Name"
                  className="w-full rounded-lg py-2 px-3 text-white placeholder:text-white"
                  style={{ background: INPUT_BG, border: "2px solid white" }}
                />

                <div className="mt-4">
                  <button
                    onClick={handleAddStudent}
                    className="py-2 px-4 rounded-md font-semibold"
                    style={{ background: BTN_BG, border: "2px solid white" }}>
                    + Add Student
                  </button>
                </div>
              </div>

              {/* Operations Card */}
              <div
                className="rounded-2xl p-6"
                style={{ background: CARD_BG, border: "2px solid rgba(255,255,255,0.9)" }}>
                <h3 className="text-white text-lg font-semibold mb-3">Operations</h3>
                <label className="block text-sm text-gray-100 mb-2">Search / Delete by Name</label>
                <input
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter Student Name"
                  className="w-full rounded-lg py-2 px-3 text-white placeholder:text-white"
                  style={{ background: INPUT_BG, border: "2px solid white" }}
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSearch}
                    className="py-2 px-4 rounded-md font-semibold"
                    style={{ background: BTN_BG, border: "2px solid white" }}>
                    Search Student
                  </button>

                  <button
                    onClick={() => { setSearchName(""); toast?.toast?.({ title: "Delete", description: "Delete (placeholder)" }); }}
                    className="py-2 px-4 rounded-md font-semibold"
                    style={{ background: BTN_BG, border: "2px solid white" }}>
                    Delete Student
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => { toast?.toast?.({ title: "Post-Order", description: "Student Post-Order (placeholder)" }); }}
                    className="py-2 px-4 rounded-md font-semibold w-full text-left"
                    style={{ background: BTN_BG, border: "2px solid white" }}>
                    Student Post-Order
                  </button>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => { setNewStudentName(""); setSearchName(""); }}
                    className="py-2 px-4 rounded-md font-semibold w-full"
                    style={{ background: "transparent", border: "2px solid white", color: "white" }}>
                    Clear
                  </button>
                </div>
              </div>

              {/* Small Score Card */}
              <div
                className="rounded-2xl p-6"
                style={{ background: CARD_BG, border: "2px solid rgba(255,255,255,0.9)" }}>
                <h3 className="text-white text-lg font-semibold mb-2">Level 2: Score Management</h3>
                <p className="text-sm text-gray-200">Select a student on the right to view and add scores.</p>
              </div>
            </div>

            {/* Right column: Student Records */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl p-6"
                style={{ background: CARD_BG, border: "2px solid rgba(255,255,255,0.9)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-white text-2xl font-semibold">Student Records</h2>
                    <p className="text-sm text-gray-200">4 students | Click to view scores</p>
                  </div>
                  <div className="text-sm text-gray-100">GPA ••</div>
                </div>

                <div className="space-y-4">
                  {[
                    "Chariz Kyle Santos",
                    "Iza Marie Tomacruz",
                    "Eunice Reyes",
                    "Heidilyn Caling",
                  ].map((name) => (
                    <div key={name} className="flex items-center justify-between bg-opacity-10 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div>
                        <div className="text-white font-medium">{name}</div>
                        <div className="text-xs text-gray-200">BSCPE 2-2 • Data Structures and Algorithms</div>
                      </div>
                      <div>
                        <div className="px-4 py-2 rounded-full text-white font-semibold" style={{ background: BTN_BG, border: "2px solid white" }}>GPA ••</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lower area: Score controls + Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            <div className="space-y-6">
              <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: "2px solid rgba(255,255,255,0.9)" }}>
                <h4 className="text-white font-semibold mb-2">Add Assessment Score</h4>
                <label className="block text-sm text-gray-100">Select Type</label>
                <select className="w-full py-2 px-3 rounded-md mt-2 text-white" style={{ background: INPUT_BG, border: "2px solid white" }}>
                  <option className="bg-[#1f1131]">Quiz 1</option>
                  <option className="bg-[#1f1131]">Quiz 2</option>
                  <option className="bg-[#1f1131]">Midterm Exam</option>
                  <option className="bg-[#1f1131]">Final Exam</option>
                </select>

                <label className="block text-sm text-gray-100 mt-3">Score (0 - 100)</label>
                <input placeholder="Enter score" className="w-full rounded-lg py-2 px-3 text-white mt-2" style={{ background: INPUT_BG, border: "2px solid white" }} />

                <div className="mt-4">
                  <button className="py-2 px-4 rounded-md font-semibold" style={{ background: BTN_BG, border: "2px solid white" }}>+ Add Score</button>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: "2px solid rgba(255,255,255,0.9)" }}>
                <h4 className="text-white font-semibold mb-2">Search & View Score</h4>
                <label className="block text-sm text-gray-100">Select Assessment</label>
                <select className="w-full py-2 px-3 rounded-md mt-2 text-white" style={{ background: INPUT_BG, border: "2px solid white" }}>
                  <option className="bg-[#1f1131]">Quiz 1</option>
                  <option className="bg-[#1f1131]">Quiz 2</option>
                  <option className="bg-[#1f1131]">Midterm Exam</option>
                  <option className="bg-[#1f1131]">Final Exam</option>
                </select>
                <div className="mt-4">
                  <button className="py-2 px-4 rounded-md font-semibold" style={{ background: BTN_BG, border: "2px solid white" }}>Run Post-Order Traversal</button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: "2px solid rgba(255,255,255,0.9)" }}>
                <h4 className="text-white font-semibold mb-4">Score Tree Visualization</h4>
                <div className="w-full h-60 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {/* placeholder visualization */}
                  <svg width="280" height="140" viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="60" y1="30" x2="140" y2="30" stroke="#fff" strokeWidth="2" opacity="0.6" />
                    <circle cx="60" cy="30" r="18" fill="#f4f9a8" />
                    <circle cx="140" cy="30" r="18" fill="#f4f9a8" />
                    <line x1="60" y1="48" x2="40" y2="88" stroke="#fff" strokeWidth="2" opacity="0.6" />
                    <line x1="60" y1="48" x2="80" y2="88" stroke="#fff" strokeWidth="2" opacity="0.6" />
                    <circle cx="40" cy="106" r="14" fill="#f4f9a8" />
                    <circle cx="80" cy="106" r="14" fill="#f4f9a8" />
                    <line x1="140" y1="48" x2="120" y2="88" stroke="#fff" strokeWidth="2" opacity="0.6" />
                    <line x1="140" y1="48" x2="160" y2="88" stroke="#fff" strokeWidth="2" opacity="0.6" />
                    <circle cx="120" cy="106" r="14" fill="#f4f9a8" />
                    <circle cx="160" cy="106" r="14" fill="#f4f9a8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BinaryTree;