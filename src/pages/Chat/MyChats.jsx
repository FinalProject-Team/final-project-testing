import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/api/api";

const API_BASE_URL = BASE_URL;

export default function MyChats() {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API_BASE_URL}/chats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setChats(Array.isArray(data) ? data : []);
        };

        fetchChats();
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>💬 My Chats</h2>

            {chats.length === 0 ? (
                <p>No chats yet</p>
            ) : (
                chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() =>
                            navigate(`/dashboard/chat/${chat.id}`)
                        }
                        style={{
                            padding: "12px",
                            marginBottom: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background: "#f9f9f9",
                        }}
                    >
                        <p><b>Chat ID:</b> {chat.id}</p>
                        <p style={{ fontSize: "12px", color: "#666" }}>
                            Click to open chat
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}