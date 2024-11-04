import Sidebar from "./components/shared/Sidebar/Sidebar";
import AppRoutes from "./routes/AppRoutes";

import "./custom.css";
import RightSidebar from "./components/shared/Sidebar/RightSidebar";

const AppContent = () => {
  return (
    <div className="container-fluid p-0 layout">
      <div className="row g-0">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 d-flex flex-column min-vh-100">
          <main className="flex-grow-1">
            <AppRoutes />
          </main>
        </div>
      </div>
      <RightSidebar />
      
    </div>
  );
};

export default AppContent;
