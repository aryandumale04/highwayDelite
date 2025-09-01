import React, { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react"; 
import spiralImage from "/tp.png"; 
import { Link } from "react-router-dom";

// Define the Note type returned by backend
interface Note {
  _id: string;
  title: string;
  createdAt?: string;
}

// Define the User type returned by backend
interface User {
  name: string;
  email: string;
}

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSignOut = () => {
    localStorage.removeItem("token");  
    window.location.href = "/signInPage"; 
  };

  const fetchUserAndNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const userRes = await fetch("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData: User = await userRes.json();
      if (userRes.ok) setUser(userData);

      const notesRes = await fetch("http://localhost:5000/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesData: Note[] = await notesRes.json();
      if (notesRes.ok) setNotes(notesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setErrorMessage("Failed to fetch user data or notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndNotes();
  }, []);

  const handleCreateNote = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!newNoteTitle.trim()) {
      setErrorMessage("Please enter a note title.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newNoteTitle }),
      });

      const newNote: Note & { message?: string } = await res.json();
      if (res.ok) {
        setNotes((prev) => [...prev, newNote]);
        setNewNoteTitle("");
        setSuccessMessage("Note created successfully!");
        setShowNoteModal(false);
      } else {
        setErrorMessage(newNote.message || "Failed to create note.");
      }
    } catch (err) {
      console.error("Error creating note:", err);
      setErrorMessage("Failed to create note.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: { message?: string } = await res.json();
      if (res.ok) setNotes((prev) => prev.filter((note) => note._id !== noteId));
      else setErrorMessage(data.message || "Failed to delete note.");
    } catch (err) {
      console.error("Error deleting note:", err);
      setErrorMessage("Failed to delete note.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6 relative">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <img src={spiralImage} alt="Logo" className="w-10 h-7" />
          <span className="font-semibold text-lg">Dashboard</span>
        </div>
        <button onClick={handleSignOut} className="text-blue-600 font-medium underline">
          Sign Out
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 border">
        <h2 className="text-lg font-semibold">
          Welcome, {user?.name} !
        </h2>
        <p className="text-gray-600 text-sm">Email: {user?.email}</p>
      </div>

      {/* Create Note Button */}
      <button
        onClick={() => { setShowNoteModal(true); setErrorMessage(""); setSuccessMessage(""); }}
        className="bg-blue-600 text-white font-medium py-3 rounded-xl shadow mb-6"
      >
        Create Note
      </button>

      {/* Error / Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md text-center">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-2 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md text-center">
          {successMessage}
        </div>
      )}

      {/* Notes Section */}
      {notes.length > 0 && (
        <div>
          <h3 className="text-base font-semibold mb-3">Notes</h3>
          {notes.map((note) => (
            <div
              key={note._id}
              className="flex justify-between items-center bg-white border shadow rounded-xl px-4 py-3 mb-3"
            >
              <span>{note.title}</span>
              <Trash2
                className="w-5 h-5 text-gray-500 cursor-pointer"
                onClick={() => handleDeleteNote(note._id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal for note input */}
      {showNoteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 max-w-[90%]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">New Note</h3>
              <X className="w-5 h-5 cursor-pointer" onClick={() => setShowNoteModal(false)} />
            </div>
            <input
              type="text"
              placeholder="Enter note title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
