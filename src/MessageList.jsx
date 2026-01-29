import { useState } from "react";

function MessageList({ messages, currentUsername, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  return (
    <div className="chat-body">
      {messages.map((msg) => {
        const isOwn = msg.username === currentUsername;

        return (
          <div
            key={msg.id}
            className={`message-row ${isOwn ? "own" : "other"}`}
          >
            <div className="message-bubble">
              {!isOwn && (
                <div className="message-username">{msg.username}</div>
              )}

              {editingId === msg.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      onEdit(msg.id, editText);
                      setEditingId(null);
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {new Date(msg.updated_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {isOwn && (
                    <div className="message-actions">
                      <button
                        onClick={() => {
                          setEditingId(msg.id);
                          setEditText(msg.text);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() => onDelete(msg.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
