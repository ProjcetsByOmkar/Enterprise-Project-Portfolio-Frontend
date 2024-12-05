import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./projectList.css";
import backarrow from "../img/back arrow.svg";
import Logo from "../img/Logo.svg";
import bg from "../img/Header-bg.svg";
import sorticon from "../img/sort.svg";

const ProjectListing = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("priority");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(6);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  useEffect(() => {
    const updateRecordsPerPage = () => {
      const isMobile = window.innerWidth <= 768;
      setRecordsPerPage(isMobile ? 100 : 6);
    };

    updateRecordsPerPage();

    window.addEventListener("resize", updateRecordsPerPage);

    return () => window.removeEventListener("resize", updateRecordsPerPage);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getprojects"
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Error fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleStatusChange = async (projectId, newStatus) => {
    setLoading(true);
    const updatedProjects = projects.map((project) =>
      project._id === projectId ? { ...project, status: newStatus } : project
    );
    setProjects(updatedProjects);

    try {
      await axios.put(`http://localhost:5000/api/putprojects/${projectId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating project status:", error);
      setError(error.response?.data?.message || "Failed to update status");
      setProjects(projects); 
    } finally {
      setLoading(false);
    }
  };

  const filteredSortedProjects = useMemo(() => {
    const filteredProjects = projects.filter((project) =>
      [
        project.name,
        project.type,
        project.projectLocation,
        project.category,
      ].some(
        (value) =>
          value && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const priorityOrder = ["High", "Medium", "Low"];

    return [...filteredProjects].sort((a, b) => {
      if (sortColumn) {
        let comparison = 0;

        if (sortColumn === "priority") {
          comparison =
            priorityOrder.indexOf(a[sortColumn]) -
            priorityOrder.indexOf(b[sortColumn]);
        } else if (sortColumn === "startDate" || sortColumn === "endDate") {
          comparison = new Date(a[sortColumn]) - new Date(b[sortColumn]);
        } else {
          const aValue = a[sortColumn] || "";
          const bValue = b[sortColumn] || "";
          comparison = aValue.localeCompare(bValue);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }, [projects, searchTerm, sortColumn, sortDirection]);

  const paginatedProjects = filteredSortedProjects.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleSortChange = (column) => {
    if (!column) return;

    setSortDirection((prevDirection) =>
      sortColumn === column && prevDirection === "asc" ? "desc" : "asc"
    );

    setSortColumn(column);
    setCurrentPage(1);
    setShowMobileSort(false);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(date)
      .toLocaleDateString("en-US", options)
      .replace(/ /g, " ");
  };

  const totalPages = Math.ceil(filteredSortedProjects.length / recordsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const getPageNumbers = () => {
    const totalNumbers = 3;
    const pageNumbers = [];

    pageNumbers.push(1);
    if (currentPage > totalNumbers + 1) {
      pageNumbers.push("...");
    }

    for (
      let i = Math.max(2, currentPage - totalNumbers);
      i <= Math.min(totalPages - 1, currentPage + totalNumbers);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - totalNumbers) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div>
      <div>
        <img src={bg} alt="Background" className="backgimage" />
        <div className="header-container">
          <h2>
            <NavLink to="/dashboard">
              <img src={backarrow} alt="Back arrow" className="arrow" />
            </NavLink>
            Project Listing
          </h2>
        </div>
        <img src={Logo} alt="Company Logo" className="company-logo" />
      </div>
      <div>
        <div className="project-listing-container">
          {error && <p className="error">{error}</p>}
          {loading && <p>Loading...</p>}
          <div className="search-sort">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="sort-by">
              <label style={{ color: "#025AAB" }} className="label-sort">
                Sort By:
              </label>
              <div className="sort-icon">
                <img
                  src={sorticon}
                  alt="sorticon"
                  onClick={() => setShowMobileSort(!showMobileSort)}
                />
              </div>
            </div>
          </div>

          <div className="sort-by-desk">
            <label style={{ color: "#025AAB" }} className="label-sort">
              Sort By:
            </label>
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              style={{ border: "none" }}
              className="ham-sort"
              id="sortDropdown"
            >
              <option value="priority">Priority</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
              <option value="projectLocation">Location</option>
            </select>
          </div>

          {showMobileSort && (
            <div className="mobile-sort-menu">
              <button
                onClick={() => setShowMobileSort(!showMobileSort)}
                className="mobile-sort-menu-close"
              >
                X
              </button>
              <li>
                <li>Sort Projects By</li>
                <li onClick={() => handleSortChange("priority")}>Priority</li>
                <li onClick={() => handleSortChange("startDate")}>
                  Start Date
                </li>
                <li onClick={() => handleSortChange("endDate")}>End Date</li>
                <li onClick={() => handleSortChange("projectLocation")}>
                  Location
                </li>
              </li>
            </div>
          )}

          <table className="project-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Reason</th>
                <th>Type</th>
                <th>Division</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map((project) => (
                <tr key={project._id}>
                  <td className="Pname">
                    {project.name} <br />
                    <sub className="Pdate">
                      {`${formatDate(project.startDate)}-to-${formatDate(
                        project.endDate
                      )}`}
                    </sub>
                    <strong className="Pstatus">{project.status}</strong>
                  </td>

                  <td data-label="Reason :">{project.reason}</td>
                  <td data-label="Type :">{project.type}</td>
                  <td data-label="Div :">{project.div}</td>
                  <td data-label="Category :">{project.category}</td>
                  <td data-label="Priority :">{project.priority}</td>
                  <td data-label="Department :">{project.helpDeskLocation}</td>
                  <td data-label="Location :">{project.projectLocation}</td>
                  <td>
                    <strong style={{ color: "#025AAB" }} className="Juststatus">
                      {project.status}
                    </strong>
                  </td>
                  <td>
                    <button
                      onClick={() => handleStatusChange(project._id, "Running")}
                      disabled={loading}
                      className="btn-1"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleStatusChange(project._id, "Closed")}
                      disabled={loading}
                      className="btn"
                    >
                      Close
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(project._id, "Cancelled")
                      }
                      disabled={loading}
                      className="btn"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="btn-nav"
            >
              &laquo;
            </button>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="btn-nav"
            >
              &lsaquo;
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={index} className="ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`btn-nav ${currentPage === page ? "active" : ""}`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="btn-nav"
            >
              &rsaquo;
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="btn-nav"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListing;
