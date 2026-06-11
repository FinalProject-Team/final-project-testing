import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import MyChats from "./pages/Chats/MyChats";

/* Pages */
import Home from "./pages/Home";
import SoftSkills from "./pages/SoftSkills/SoftSkills";
import Payment from "./pages/Payment";
import Ranking from "./pages/Ranking/Ranking";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/layout/Dashboard/Dashboard";
import Career from "./components/layout/Career Twin/Career";
import Register from "./components/layout/Register/Register";
import RegisterJob from "./components/layout/Register/JobRegister";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import LiveSession from "./components/LiveSessions/LiveSession";
import CommunityPage from "./pages/Community";
import Login from "./pages/Login/Login";
import RoadmapPage from "./pages/Roadmap/RoadmapPage";
import Chatbot from "./pages/Chatbot/Chatbot";

/* Admin */
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminCourses from "./components/Admin/AdminCourses";
import AdminLessons from "./components/Admin/AdminLessons";

/* Instructor */
import InstructorDashboardLayout from "./components/InstructorDashboard/InstructorDashboardLayout/InstructorDashboardLayout";
import InstructorDashboardDashboard from "./components/InstructorDashboard/InstructorDashboardDashboard/InstructorDashboardDashboard";
import InstructorDashboardCourses from "./components/InstructorDashboard/InstructorDashboardCourses/InstructorDashboardCourses";
import InstructorDashboardInteractiveSessions from "./components/InstructorDashboard/InstructorDashboardInteractiveSessions/InstructorDashboardInteractiveSessions";
import InstructorDashboardLessons from "./components/InstructorDashboard/InstructorDashboardLessons/InstructorDashboardLessons";
import InstructorDashboardProfile from "./components/InstructorDashboard/InstructorDashboardProfile/InstructorDashboardProfile";

/* Auth */
import ProtectedRoute from "./components/common/ProtectedRoute";

/* Services */
import { supabase } from "./components/layout/services/supabaseClient";
import api from "./components/layout/services/Api";

/* Profile Components */
import ProfileHeader from "./components/Profileheader/Profileheader.jsx";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation.jsx";
import SocialLinks from "./components/SocialLinks/SocialLinks.jsx";
import Documents from "./components/Documents/Documents.jsx";
import Skills from "./components/Skills/Skills.jsx";

/* Progress */
import ProfileMetrics from "./components/Progress/ProfileMetrics.jsx";
import XPGrowth from "./components/Progress/XPGrowth.jsx";
import CourseCompletion from "./components/Progress/CourseCompletion.jsx";
import ProgressperCourse from "./components/Progress/ProgressperCourse";
import DailyLearningHours from "./components/Progress/DailyLearningHours";
import JobsPage from "./pages/Jobs/JobsPage.jsx";
import Projects from "./pages/Projects/Projects.jsx";

/* NEW */
import MyJobsPage from "./pages/Jobs/MyJobsPage.jsx";
import Applications from "./pages/Jobs/Applications.jsx"; // ✅ added
import ChatPage from "./pages/Chat/ChatPage";
import MyChats from "./pages/Chat/MyChats.jsx";

/* ---------------- PROFILE ---------------- */

const Profile = () => (
  <div style={{ background: "#0B0F19", minHeight: "100vh", width: "100%", padding: "40px 0", color: "white" }}>
    <div className="container d-flex flex-column justify-content-between" style={{ minHeight: "calc(100vh - 80px)" }}>
      <div className="d-flex flex-column gap-4 mb-4">
        <ProfileHeader />
        <div className="row g-4 m-0">
          <div className="col-12 col-lg-7 p-0 pe-lg-3">
            <PersonalInformation />
          </div>
          <div className="col-12 col-lg-5 p-0 d-flex flex-column gap-4">
            <SocialLinks />
            <Documents />
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Skills />
      </div>
    </div>
  </div>
);

/* ---------------- PROGRESS ---------------- */

const ProgressPage = () => (
  <div style={{ backgroundColor: "#060814", minHeight: "100vh", padding: "40px 20px", color: "white" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <ProfileMetrics />
      <div className="charts-layout-grid">
        <XPGrowth />
        <CourseCompletion />
      </div>
      <ProgressperCourse />
      <DailyLearningHours />
    </div>
  </div>
);

/* ---------------- APP ---------------- */

export default function App() {
  useEffect(() => {
    const initialTheme = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    const getSessionAndSendToBackend = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (!user) return;

      const currentPath = window.location.pathname;

      if (
        currentPath.startsWith("/dashboard") ||
        currentPath.startsWith("/admin") ||
        currentPath.startsWith("/instructor")
      ) {
        return;
      }

      try {
        await api.post("/api/auth/google-login", { user });
      } catch (error) {
        console.error("Error sending token to backend:", error);
      }
    };

    getSessionAndSendToBackend();
  }, []);

  const Router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/register-job", element: <RegisterJob /> },
    { path: "/course/:id", element: <CourseDetails /> },

    {
      path: "/payment",
      element: (
        <ProtectedRoute allowedRoles={["student"]}>
          <Payment />
        </ProtectedRoute>
      ),
    },

    {
      path: "/instructor",
      element: (
        <ProtectedRoute allowedRoles={["instructor"]}>
          <InstructorDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <InstructorDashboardDashboard /> },
        { path: "dashboard", element: <InstructorDashboardDashboard /> },
        { path: "courses", element: <InstructorDashboardCourses /> },
        { path: "lessons", element: <InstructorDashboardLessons /> },
        { path: "interactive-sessions", element: <InstructorDashboardInteractiveSessions /> },
        { path: "profile", element: <InstructorDashboardProfile /> },
      ],
    },

    {
      path: "/dashboard",
      element: (
        <ProtectedRoute requirePayment={true}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "profile", element: <Profile /> },
        { path: "roadmap", element: <RoadmapPage /> },
        { path: "projects", element: <Projects /> },
        { path: "chatbot", element: <Chatbot /> },
        { path: "jobs", element: <JobsPage /> },

        { path: "my-jobs", element: <MyJobsPage /> },

        // ✅ ADDED HERE
        { path: "applications", element: <Applications /> },

        { path: "progress", element: <ProgressPage /> },
        { path: "softSkills", element: <SoftSkills /> },
        { path: "ranking", element: <Ranking /> },
        { path: "careertwin", element: <Career /> },
        { path: "community", element: <CommunityPage /> },
        { path: "live-session", element: <LiveSession /> },
        { path: "chat/:chatId", element: <ChatPage /> },
        { path: "my-chats", element: <MyChats /> },
      ],
    },

    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "admindashboard", element: <AdminDashboard /> },
        { path: "users", element: <AdminUsers /> },
        { path: "courses", element: <AdminCourses /> },
        { path: "lessons", element: <AdminLessons /> }
      ]
    },
  ]);

  return <RouterProvider router={Router} />;
}