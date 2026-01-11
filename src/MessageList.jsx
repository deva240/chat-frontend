import { useEffect, useRef } from "react";
import Message from "./Message";

function MessageList({ messages, currentUserId, onDelete, onEdit }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: "10px", overflowY: "auto" }}>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          id={msg.id}
          text={msg.text}
          time={msg.time}
          user_id={msg.user_id}
          username={msg.username}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
