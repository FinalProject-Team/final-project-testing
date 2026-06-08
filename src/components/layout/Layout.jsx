import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        background: "#020817",
        height: "100vh",        /* fill full viewport */
        overflow: "hidden",     /* prevent double scrollbars */
        color: "white",
      }}
    >
      {/* Sidebar — sticky, full height */}
      <Sidebar />

      {/* Right column: Topbar + page content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,          /* prevent flex child from overflowing */
          overflow: "hidden",
        }}
      >
        <Topbar />

        {/* Content area — scrollable, fills all remaining height */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,       /* critical: allow flex child to shrink below content size */
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
