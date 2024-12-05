import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginForm from "./login/LoginForm";
import CreateProjectForm from "./CreateProject/createProject";
import ProjectListing from "./ProjectListing/projectList";
import Dashboard from "./Dashboard/dashboard";
import Menu from "./Menu/menu";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated && <Menu setIsAuthenticated={setIsAuthenticated} />}
      <div className="main-content">
        <Routes>
          <Route
            path="/login"
            element={<LoginForm setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-project"
            element={
              isAuthenticated ? <CreateProjectForm /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/project-listing"
            element={
              isAuthenticated ? <ProjectListing /> : <Navigate to="/login" />
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
