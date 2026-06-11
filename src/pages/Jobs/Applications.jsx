import { useEffect, useState } from "react";
import {
    getApplications,
    acceptApplication,
    rejectApplication,
} from "../../services/api/applications.js";

export default function Applications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("token");

            const data = await getApplications(token);

            setApplications(data || []);
        };

        fetchApplications();
    }, []);

    const handleAccept = async (id) => {
        const token = localStorage.getItem("token");

        const res = await acceptApplication(id, token);

        setApplications((prev) =>
            prev.map((app) =>
                app.id === id
                    ? {
                        ...app,
                        status: "accepted",
                        chat_id: res.chat.id, // 🔥 لازم يتخزن هنا
                    }
                    : app
            )
        );
    };

    const handleReject = async (id) => {
        const token = localStorage.getItem("token");

        await rejectApplication(id, token);

        setApplications((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, status: "rejected" } : app
            )
        );
    };

    return (
        <div>
            <h2>Applications</h2>

            {applications.length === 0 ? (
                <p>No applications yet</p>
            ) : (
                applications.map((app) => (
                    <div
                        key={app.id}
                        style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
                    >
                        <p>
                            <b>Cover Letter:</b> {app.cover_letter}
                        </p>

                        <p>
                            <b>Status:</b> {app.status}</p>

                        {/* Pending */}
                        {app.status === "pending" && (
                            <>
                                <button onClick={() => handleAccept(app.id)}>
                                    Accept
                                </button>

                                <button onClick={() => handleReject(app.id)}>
                                    Reject
                                </button>
                            </>
                        )}

                        {/* Accepted */}
                        {app.status === "accepted" && app.chat_id && (
                            <button
                                onClick={() =>
                                    window.location.href = `/dashboard/chat/${app.chat_id}`
                                }
                            >
                                Message 💬
                            </button>
                        )}

                        {/* Rejected */}
                        {app.status === "rejected" && (
                            <span style={{ color: "red" }}>Rejected ❌</span>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}