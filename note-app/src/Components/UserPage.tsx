import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // icon for delete
import spiralImage from "/tp.png"; // your spiral image
import { Link } from "react-router-dom";

interface Note {
  _id: string;
  title: string;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
}

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem("token");  // clear JWT
    window.location.href = "/signInPage"; // redirect
  };

  const fetchUserAndNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch user info
      const userRes = await fetch("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      if (userRes.ok) setUser(userData);

      // Fetch notes
      const notesRes = await fetch("http://localhost:5000/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesData = await notesRes.json();
      if (notesRes.ok) setNotes(notesData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndNotes();
  }, []);

  const handleCreateNote = async () => {
    const title = prompt("Enter note title:");
    if (!title) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const newNote = await res.json();
      if (res.ok) setNotes((prev) => [...prev, newNote]);
      else console.error(newNote.message);
    } catch (err) {
      console.error("Error creating note:", err);
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

      const data = await res.json();
      if (res.ok) setNotes((prev) => prev.filter((note) => note._id !== noteId));
      else console.error(data.message);
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6">
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
        onClick={handleCreateNote}
        className="bg-blue-600 text-white font-medium py-3 rounded-xl shadow mb-6"
      >
        Create Note
      </button>

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
    </div>
  );
};

export default UserPage;
