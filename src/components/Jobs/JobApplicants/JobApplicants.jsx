import { useEffect, useState } from "react";
import {
    apiGetJobApplicants,
    apiUpdateApplicationStatus
} from "../../../services/api/api";

export default function JobApplicants({ jobId }) {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await apiGetJobApplicants(jobId);
                setApplicants(Array.isArray(res) ? res : []);
            } catch (err) {
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchData();
    }, [jobId]);

    const updateStatus = async (id, status) => {
        try {
            await apiUpdateApplicationStatus(id, status);

            setApplicants((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status } : app
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) return <p>Loading applicants...</p>;

    return (
        <div>
            <h3>Applicants</h3>

            {applicants.length === 0 && <p>No applicants yet</p>}

            {applicants.map((app) => (
                <div
                    key={app.id}
                    style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        marginBottom: "8px",
                        borderRadius: "8px"
                    }}
                >
                    <p><b>{app.user?.full_name}</b></p>
                    <p>{app.user?.email}</p>
                    <p>Status: {app.status}</p>

                    {/* 🔥 ACTION BUTTONS */}
                    <div style={{ marginTop: "10px" }}>
                        <button
                            onClick={() => updateStatus(app.id, "accepted")}
                            style={{ marginRight: "8px" }}
                        >
                            Accept
                        </button>

                        <button
                            onClick={() => updateStatus(app.id, "rejected")}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}