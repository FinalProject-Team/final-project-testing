import { useEffect, useState, useRef } from "react";
import {
  Edit,
  Save,
  X,
  Mail,
  MapPin,
  Briefcase,
  Link2,
  Camera,
  BookOpen,
  Users,
  FileText,
  Star,
} from "lucide-react";

import {
  getCurrentUser,
  getInstructorProfile,
  updateAuthProfile,
  updateInstructorProfile,
} from "../../../services/api/instructorService";

import styles from "./InstructorDashboardProfile.module.css";

const fallback = "Not added yet";

function InstructorDashboardProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    job_title: "",
    bio: "",
    avatar_url: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    courses_count: 0,
    students_count: 0,
    lessons_count: 0,
    rating: 0,
  });

  const loadProfile = async () => {
    try {
      setLoading(true);

      const userResponse = await getCurrentUser();
      const instructorResponse = await getInstructorProfile();

      const user = userResponse?.user ?? userResponse ?? {};
      const instructor = instructorResponse?.data || instructorResponse || {};

      setFormData({
        full_name: user.full_name || user.fullName || user.name || "",
        email: user.email || "",
        job_title: user.job_title || user.jobTitle || "",
        bio: user.bio || "",
        avatar_url: user.avatar_url || user.avatarUrl || "",
        location: instructor.location || "",
        website: instructor.website || "",
        github: instructor.github || "",
        linkedin: instructor.linkedin || "",
        courses_count: instructor.courses_count || 0,
        students_count: instructor.students_count || 0,
        lessons_count: instructor.lessons_count || 0,
        rating: instructor.rating || 0,
      });
    } catch (error) {
      console.error("Failed to load instructor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile();
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateAuthProfile({
        bio: formData.bio,
      });

      await updateInstructorProfile({
        location: formData.location,
        website: formData.website,
        github: formData.github,
        linkedin: formData.linkedin,
      });

      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  // 🚀 رفع الصورة
  // const handleAvatarChange = async (e) => {
  //   console.log("SELECTED FILE:", file);
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   try {
  //     const formDataUpload = new FormData();
  //     formDataUpload.append("avatar", file);

  //     const token = localStorage.getItem("token");

  //     const res = await fetch(
  //       "http://localhost:5000/api/profile/upload-avatar",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formDataUpload,
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.error || "Upload failed");

  //     setFormData((prev) => ({
  //       ...prev,
  //       avatar_url: data.avatar_url,
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to upload image");
  //   }
  // };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("avatar", file);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/upload-avatar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        avatar_url: data.avatar_url,
      }));

    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    }
  };

  if (loading) {
    return <div className={styles.profile}>Loading profile...</div>;
  }

  return (
    <div className={styles.profile}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleAvatarChange}
      />

      <div className={styles.header}>
        <div>
          <h1>Profile</h1>
          <p>Manage your personal information and public profile</p>
        </div>

        {!isEditing ? (
          <button
            className={styles.editBtn}
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} />
            Edit Profile
          </button>
        ) : (
          <button className={styles.cancelBtn} onClick={handleCancel}>
            <X size={16} />
            Cancel
          </button>
        )}
      </div>

      <div className={styles.card}>
        <h2>Personal Information</h2>

        <div className={styles.personalContent}>
          <div className={styles.avatarBox}>
            {formData.avatar_url ? (
              <img
                src={formData.avatar_url}
                alt="Instructor"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>Instructor</div>
            )}

            {isEditing && (
              <button
                className={styles.cameraBtn}
                type="button"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera size={15} />
              </button>
            )}
          </div>

          <div className={styles.infoGrid}>
            <div>
              <label>Full Name</label>
              <p>{formData.full_name || fallback}</p>
            </div>

            <div>
              <label>Email</label>
              <p>
                <Mail size={14} />
                {formData.email || fallback}
              </p>
            </div>

            <div>
              <label>Job Title</label>
              <p>
                <Briefcase size={14} />
                {formData.job_title || fallback}
              </p>
            </div>

            <div>
              <label>Location</label>
              {isEditing ? (
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              ) : (
                <p>
                  <MapPin size={14} />
                  {formData.location || fallback}
                </p>
              )}
            </div>

            <div className={styles.bio}>
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              ) : (
                <p>{formData.bio || fallback}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2>Social Links</h2>

        <div className={styles.socialGrid}>
          {["website", "github", "linkedin"].map((field) => (
            <div key={field}>
              <label>
                {field === "github"
                  ? "GitHub"
                  : field === "linkedin"
                    ? "LinkedIn"
                    : "Website"}
              </label>

              {isEditing ? (
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              ) : formData[field] ? (
                <a href={formData[field]} target="_blank" rel="noreferrer">
                  <Link2 size={14} />
                  {formData[field]}
                </a>
              ) : (
                <p>{fallback}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2>Statistics</h2>

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <BookOpen size={24} />
            <h3>{formData.courses_count}</h3>
            <p>Courses</p>
          </div>

          <div className={styles.statBox}>
            <Users size={24} />
            <h3>{formData.students_count}</h3>
            <p>Students</p>
          </div>

          <div className={styles.statBox}>
            <FileText size={24} />
            <h3>{formData.lessons_count}</h3>
            <p>Lessons</p>
          </div>

          <div className={styles.statBox}>
            <Star size={24} />
            <h3>{formData.rating}</h3>
            <p>Rating</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={styles.saveWrapper}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboardProfile;