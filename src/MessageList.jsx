import { useState } from "react";

function MessageList({ messages, currentUserId, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    onEdit(id, editText);
    setEditingId(null);
    setEditText("");
  };

  return (
    <div
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fafafa",
      }}
    >
      {messages.length === 0 && (
        <div style={{ color: "#888", textAlign: "center" }}>
          No messages yet
        </div>
      )}

      {messages.map((msg) => {
        const isOwner = msg.userId === currentUserId;

        return (
          <div
            key={msg.id}
            style={{
              marginBottom: "8px",
              padding: "8px",
              borderRadius: "6px",
              background: isOwner ? "#e8f5e9" : "#ffffff",
              border: "1px solid #ddd",
            }}
          >
            {editingId === msg.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    marginBottom: "6px",
                  }}
                />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => saveEdit(msg.id)}
                    style={{
                      padding: "4px 10px",
                      background: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: "4px 10px",
                      background: "#9e9e9e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "4px" }}>{msg.text}</div>

                {isOwner && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => startEdit(msg)}
                      style={{
                        padding: "4px 10px",
                        background: "#FFC107",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(msg.id)}
                      style={{
                        padding: "4px 10px",
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
