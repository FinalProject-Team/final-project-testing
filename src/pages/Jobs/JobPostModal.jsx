import styles from "./JobPostModal.module.css";
import { useState } from "react";
import { apiCreateJob } from "../../services/api/api"; // 👈 عدلي المسار حسب مكان الملف

const skillsData = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Python",
    "Django",
    "SQL",
    "Git",
    "Docker",
    "Bootstrap",
    "TypeScript",
    "Next.js",
    "Other"
];

export default function JobPostModal({ show, onClose }) {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [otherSkill, setOtherSkill] = useState("");
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        company: "",
        salary: "",
        type: "Full Time",
        location: ""
    });

    if (!show) return null;

    const toggleSkill = (skill) => {
        if (skill === "Other") {
            setShowOtherInput(true);
            return;
        }

        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePublish = async () => {
        try {
            setLoading(true);

            const jobData = {
                title: form.title,
                company: form.company,
                description: form.description,
                salary: form.salary,
                job_type: form.type, // مهم جدًا يطابق backend
                location: form.location,
                skills: [...selectedSkills, otherSkill].filter(Boolean),
            };

            const res = await apiCreateJob(jobData);

            console.log("CREATED JOB:", res);

            alert("Job Published Successfully 🚀");

            onClose();

            // reset form
            setForm({
                title: "",
                description: "",
                salary: "",
                type: "Full Time",
                location: ""
            });
            setSelectedSkills([]);
            setOtherSkill("");
            setShowOtherInput(false);

        } catch (err) {
            console.log("FULL ERROR:", err.response?.data || err.message);
            alert("Failed to publish job ❌");
        } finally {
            setLoading(false);
        }
    };

    const hasSkills =
        selectedSkills.length > 0 || otherSkill.trim();

    const isValid =
        form.title.trim() &&
        form.description.trim() &&
        form.location.trim() &&
        form.salary &&
        hasSkills;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <h2>Create Job Offer</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.form}>

                    <label>Job Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Frontend React Developer"
                    />

                    <label>Company</label>
                    <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Google / Netflix..."
                    />

                    <label>Location</label>
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Cairo / Remote / Giza..."
                    />

                    <label>Required Skills</label>
                    <div className={styles.skills}>
                        {skillsData.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={
                                    selectedSkills.includes(skill)
                                        ? styles.activeSkill
                                        : styles.skill
                                }
                            >
                                {skill}
                            </button>
                        ))}
                    </div>

                    {showOtherInput && (
                        <input
                            type="text"
                            placeholder="Enter other skills..."
                            value={otherSkill}
                            onChange={(e) => setOtherSkill(e.target.value)}
                        />
                    )}

                    <label>Write Your Offer</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Describe responsibilities..."
                    />

                    <label>Salary</label>
                    <input
                        name="salary"
                        type="number"
                        value={form.salary}
                        onChange={handleChange}
                        placeholder="5000"
                    />

                    <label>Employment Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                    </select>

                    <div className={styles.actions}>
                        <button className={styles.cancel} onClick={onClose}>
                            Cancel
                        </button>

                        <button
                            className={styles.publish}
                            onClick={handlePublish}
                            disabled={!isValid || loading}
                        >
                            {loading ? "Publishing..." : "Publish Job"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}