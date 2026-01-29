import { useState } from "react";

function MessageList({ messages, currentUsername, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  return (
    <div className="chat-body">
      {messages.map((msg) => {
        const isOwner = msg.username === currentUsername;

        return (
          <div
            key={msg.id}
            className={`message-row ${isOwner ? "own" : "other"}`}
          >
            <div className="message-bubble">
              <div className="message-username">{msg.username}</div>

              {editingId === msg.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="message-actions">
                    <button
                      onClick={() => {
                        onEdit(msg.id, editText);
                        setEditingId(null);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>{msg.text}</div>

                  {isOwner && (
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
