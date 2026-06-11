import { useEffect, useState } from "react";
import { apiGetMyJobs } from "../../services/api/api";
import JobApplicants from "../../components/Jobs/JobApplicants/JobApplicants";
import styles from "./MyJobs.module.css";

export default function MyJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await apiGetMyJobs();
                setJobs(Array.isArray(res) ? res : []);
            } catch (err) {
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Jobs</h2>

            {jobs.length === 0 && <p>No jobs yet</p>}

            {jobs.map((job) => (
                <div
                    key={job.id}
                    style={{
                        marginBottom: "20px",
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>

                    {/* 👇 أهم جزء: المتقدمين */}
                    <JobApplicants jobId={job.id} />
                </div>
            ))}
        </div>
    );
}