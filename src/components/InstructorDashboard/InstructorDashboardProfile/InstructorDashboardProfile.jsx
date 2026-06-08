import { useState } from "react";
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

import styles from "./InstructorDashboardProfile.module.css";

function InstructorDashboardProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "John Smith",
    email: "john.smith@example.com",
    jobTitle: "Senior Web Development Instructor",
    location: "San Francisco, CA",
    bio: "Passionate educator with 10+ years of experience teaching web development and programming. I love helping students achieve their goals and build amazing projects.",
    website: "https://johnsmith.dev",
    github: "https://github.com/johnsmith",
    linkedin: "https://linkedin.com/in/johnsmith",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const stats = [
    { label: "Courses", value: 12, icon: BookOpen },
    { label: "Students", value: "1,543", icon: Users },
    { label: "Lessons", value: 87, icon: FileText },
    { label: "Rating", value: 4.8, icon: Star },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={styles.profile}>
      <div className={styles.header}>
        <div>
          <h1>Profile</h1>
          <p>Manage your personal information and public profile</p>
        </div>

        <button
          className={isEditing ? styles.cancelBtn : styles.editBtn}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X size={18} /> : <Edit size={18} />}
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className={styles.card}>
        <h2>Personal Information</h2>

        <div className={styles.personalContent}>
          <div className={styles.avatarBox}>
            <img src={profile.image} alt="Instructor" className={styles.avatar} />

            {isEditing && (
              <button className={styles.cameraBtn}>
                <Camera size={16} />
              </button>
            )}
          </div>

          <div className={styles.infoGrid}>
            <div>
              <label>Full Name</label>
              {isEditing ? (
                <input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.fullName}</p>
              )}
            </div>

            <div>
              <label>Email</label>
              {isEditing ? (
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              ) : (
                <p>
                  <Mail size={16} />
                  {profile.email}
                </p>
              )}
            </div>

            <div>
              <label>Job Title</label>
              {isEditing ? (
                <input
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleChange}
                />
              ) : (
                <p>
                  <Briefcase size={16} />
                  {profile.jobTitle}
                </p>
              )}
            </div>

            <div>
              <label>Location</label>
              {isEditing ? (
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />
              ) : (
                <p>
                  <MapPin size={16} />
                  {profile.location}
                </p>
              )}
            </div>

            <div className={styles.bio}>
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2>Social Links</h2>

        <div className={styles.socialGrid}>
          <div>
            <label>Website</label>
            {isEditing ? (
              <input
                name="website"
                value={profile.website}
                onChange={handleChange}
              />
            ) : (
              <a href={profile.website} target="_blank" rel="noreferrer">
                <Link2 size={16} />
                {profile.website}
              </a>
            )}
          </div>

          <div>
            <label>GitHub</label>
            {isEditing ? (
              <input
                name="github"
                value={profile.github}
                onChange={handleChange}
              />
            ) : (
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Link2 size={16} />
                {profile.github}
              </a>
            )}
          </div>

          <div>
            <label>LinkedIn</label>
            {isEditing ? (
              <input
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
              />
            ) : (
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <Link2 size={16} />
                {profile.linkedin}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2>Statistics</h2>

        <div className={styles.statsGrid}>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div className={styles.statBox} key={stat.label}>
                <Icon size={24} />
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {isEditing && (
        <div className={styles.saveWrapper}>
          <button className={styles.saveBtn} onClick={() => setIsEditing(false)}>
            <Save size={18} />
            Save Changes
          </button>
        </div>
      )}
    </section>
  );
}

export default InstructorDashboardProfile;