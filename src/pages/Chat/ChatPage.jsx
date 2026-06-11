import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function ChatPage() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // 👇 current user id
    const myId = JSON.parse(localStorage.getItem("user"))?.id;

    // 👇 scroll ref
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    console.log("chatId from URL:", chatId);

    // 📩 GET messages (REAL TIME)
    useEffect(() => {
        if (!chatId) return;

        const fetchMessages = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://final-project-backend-production-214a.up.railway.app/chats/${chatId}/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            const msgs = Array.isArray(data) ? data : data.messages || [];
            setMessages(msgs);
        };

        fetchMessages();

        const interval = setInterval(fetchMessages, 3000);

        return () => clearInterval(interval);
    }, [chatId]);

    // 📤 SEND message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const token = localStorage.getItem("token");

        const res = await fetch(
            `https://final-project-backend-production-214a.up.railway.app/chats/${chatId}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: newMessage,
                }),
            }
        );

        const data = await res.json();

        setMessages((prev) => [...prev, data]);

        setNewMessage("");

        scrollToBottom();
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Chat 💬</h2>

            {/* messages */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Array.isArray(messages) &&
                    messages.map((msg) => {
                        const isMe = msg.sender_id === myId;

                        return (
                            <div
                                key={msg.id}
                                style={{
                                    display: "flex",
                                    justifyContent: isMe ? "flex-end" : "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        background: isMe ? "#DCF8C6" : "#F1F0F0",
                                        padding: "10px 14px",
                                        borderRadius: "15px",
                                        maxWidth: "70%",
                                        wordBreak: "break-word",
                                        fontSize: "14px",
                                    }}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* 👇 scroll anchor */}
            <div ref={messagesEndRef} />

            {/* input */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <input
                    type="text"
                    value={newMessage}
                    placeholder="Type a message..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                        padding: "10px",
                        flex: 1,
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                    }}
                />

                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: "10px 15px",
                        borderRadius: "8px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}