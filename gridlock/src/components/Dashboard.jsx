import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlowOrbs from "./GlowOrb";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || { name: "Explorer" };

  // Advanced State Management
  const [activeTab, setActiveTab] = useState("Notes");
  const [notes, setNotes] = useState([]); // Holds the array of objects from the DB
  const [currentNoteId, setCurrentNoteId] = useState(null); // Tracks which note is currently in the editor
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const typingTimeoutRef = useRef(null);

  // Initial Load: Fetch all notes
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("gridlock_token");
      try {
        const response = await fetch("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(data);
        }
      } catch (err) {
        console.error("Failed to load notes");
      }
    };
    fetchNotes();
  }, []);

  // Auto-Save Logic with Debouncing
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    setSaveStatus("Saving...");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      const token = localStorage.getItem("gridlock_token");

      try {
        if (currentNoteId) {
          // UPDATE EXISTING NOTE
          const response = await fetch(
            `http://localhost:5000/api/notes/${currentNoteId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ content: newText }),
            },
          );
          const updatedNote = await response.json();
          if (response.ok) {
            setSaveStatus("All changes saved");
            // Update the specific note inside its local array so the card updates instantly
            setNotes((prev) =>
              prev.map((n) => (n._id === currentNoteId ? updatedNote : n)),
            );
          } else {
            setSaveStatus("Failed to save");
          }
        } else {
          // CREATE NEW NOTE
          if (newText.trim() === "") return; // Dont save blank notes

          const response = await fetch("http://localhost:5000/api/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: newText }),
          });
          const newNote = await response.json();
          if (response.ok) {
            setCurrentNoteId(newNote._id); // Set the editor to this new document
            setSaveStatus("All changes saved");
            setNotes((prev) => [newNote, ...prev]); // Shove it at the top of the cards list
          } else {
            setSaveStatus("Failed to save");
          }
        }
      } catch (err) {
        setSaveStatus("Offline - Changes not saved");
      }
    }, 1000);
  };

  // Document Switching
  const handleSelectNote = (note) => {
    setCurrentNoteId(note._id);
    setContent(note.content);
    setSaveStatus("");
  };

  const handleCreateNew = () => {
    setCurrentNoteId(null);
    setContent("");
    setSaveStatus("");
  };

  const handleLogout = () => {
    localStorage.removeItem("gridlock_token");
    navigate("/");
  };

  // Determine the color of the status line based on current state
  const statusLineColor =
    saveStatus === "All changes saved"
      ? "#4ade80"
      : saveStatus === "Saving..."
        ? "#fbbf24"
        : saveStatus.includes("Failed") || saveStatus.includes("Offline")
          ? "#ff4d4d"
          : "transparent";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* CSS for hover states */}
      <style>
        {`
          .nav-link {
            cursor: pointer;
            color: #888;
            text-decoration: none;
            text-underline-offset: 8px;
            transition: all 0.2s ease;
          }
          .nav-link:hover {
            color: #fff;
          }
          .nav-link.active {
            color: #fff;
            text-decoration: underline;
          }
          .note-card {
            background-color: #111;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: transform 0.2s ease, border-color 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .note-card:hover {
            transform: translateY(-2px);
            border-color: #555;
          }
          .note-card.active-card {
            border-color: #fff;
          }
        `}
      </style>

      <GlowOrbs />

      <div style={{ position: "relative", zIndex: 10, paddingBottom: "4rem" }}>
        {/* THE NAVBAR */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 5%",
            borderBottom: "1px solid #222",
          }}
        >
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            GRIDLOCK // NOTEBOOK
          </div>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <span
              className={`nav-link ${activeTab === "Notes" ? "active" : ""}`}
              onClick={() => setActiveTab("Notes")}
            >
              Notes
            </span>
            <span
              className={`nav-link ${activeTab === "Account" ? "active" : ""}`}
              onClick={() => setActiveTab("Account")}
            >
              Account
            </span>
            <span
              className={`nav-link ${activeTab === "About" ? "active" : ""}`}
              onClick={() => setActiveTab("About")}
            >
              About this project
            </span>

            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #333",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.borderColor = "#666")}
              onMouseOut={(e) => (e.target.style.borderColor = "#333")}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT ZONEEE */}
        {activeTab === "Notes" && (
          <main
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "6vh",
              maxWidth: "800px",
              margin: "0 auto",
              width: "90%",
            }}
          >
            {/* The Editor Header */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ fontSize: "2rem", fontWeight: "400", margin: 0 }}>
                What would you like to type, {user.name}?
              </h2>
              <button
                onClick={handleCreateNew}
                style={{
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "transform 0.1s ease",
                }}
                onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
              >
                + New Note
              </button>
            </div>

            {/* The Shortened Editor */}
            <textarea
              placeholder="Start typing..."
              value={content}
              onChange={handleTextChange}
              style={{
                width: "auto",
                minHeight: "200px",
                backgroundColor: "#111111b2",
                color: "#eee",
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "24px",
                fontSize: "1.1rem",
                lineHeight: "1.6",

                resize: "none", 

                outline: "none",
                transition: "border-color 0.5s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ffffff", e.target.style.backgroundColor = "#111111e0", e.target.style.borderWidth = "1px")}
              onBlur={(e) => (e.target.style.borderColor = "#333", e.target.style.backgroundColor = "#111111b2", e.target.style.borderWidth = "1px")}
            />

            {/* Status Indicator Line */}
            <div style={{ width: '100%' }}>
              <div style={{
                height: '2px', 
                width: '97%', 
                margin: '0 auto', 
                backgroundColor: statusLineColor || '#333',
                transition: 'background-color 0.3s ease'
              }} />
              <div style={{ 
                height: '20px', 
                marginTop: '6px', 
                fontSize: '0.85rem', 
                width: '97%', // Note: Matches the text boundary to the line boundary
                margin: '0 auto', // Center the text container
                color: statusLineColor, 
                display: 'flex', 
                justifyContent: 'flex-end' // Keeps the actual text pinned to the right
              }}>
                {saveStatus}
              </div>
            </div>

            {/* THE SAVED NOTES GRID */}
            <div style={{ marginTop: "3rem", width: "100%" }}>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#888",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #222",
                  paddingBottom: "0.5rem",
                }}
              >
                Saved Notes
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "16px",
                }}
              >
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className={`note-card ${currentNoteId === note._id ? "active-card" : ""}`}
                    style={{backgroundColor: currentNoteId === note._id ? "#141414" : "#000000b2",
                        borderWidth: currentNoteId === note._id ? "1px" : "1px"
                    }}
                    onClick={() => handleSelectNote(note)}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {note.title}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                      {new Date(note.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
