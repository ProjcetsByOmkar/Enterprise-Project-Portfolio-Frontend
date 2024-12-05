import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Logo from "../img/Logo.svg";
import "./createProject.css";
import backarrow from "../img/back arrow.svg";
import bg from "../img/Header-bg.svg";

const CreateProjectForm = () => {
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [division, setDivision] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [div, setDiv] = useState("");

  const status = "Registered";
  const navigate = useNavigate();

  const handleSaveProject = async (e) => {
    e.preventDefault();

    if (
      !projectName ||
      !startDate ||
      !endDate ||
      !type ||
      !division ||
      !category ||
      !priority ||
      !department ||
      !location
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    const newProject = {
      name: projectName,
      reason: division,
      type,
      div,
      category,
      priority,
      helpDeskLocation: department,
      projectLocation: location,
      status,
      startDate,
      endDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/postprojects",
        newProject
      );
      console.log(response.data);

      setError("");
      setProjectName("");
      setDiv("");
      setStartDate("");
      setEndDate("");
      setType("");
      setDivision("");
      setCategory("");
      setPriority("");
      setDepartment("");
      setLocation("");

      alert("Project saved successfully!");
      navigate("/project-listing");
    } catch (error) {
      console.error("Error saving project", error);
      setError(
        error.response?.data?.error || "Error saving project. Please try again."
      );
    }
  };

  return (<React.Fragment><img src={bg} alt="Background" className="bgroundimage" />
    <div className="project-container">
      <div>
        
        <div className="header-container">
          <h2>
          <NavLink to="/dashboard">
            <img src={backarrow} alt="Back arrow" className="arrow"/>
          </NavLink>
          Create Project</h2>
        </div>
        <img src={Logo} alt="Company Logo" className="company-logo" />
      </div>
      <form onSubmit={handleSaveProject} className="form-main">
        <table className="form-table">
          <tbody>
            <tr rowSpan={2}>
              <td colSpan={2} >
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  placeholder="Enter Project Theme"
                  className="textbox"
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </td>
              <td style={{textAlign:"right"}}>
                <button type="submit" className="btn-saveproject">Save Project</button>
              </td>
            </tr><td></td>
            <tr>
              <td>
                <label htmlFor="division">Reason</label>
                <select
                  id="division"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                >
                  <option value="">Select Division</option>
                  <option value="Business">Business</option>
                  <option value="Dealership">Dealership</option>
                  <option value="Transport">Transport</option>
                </select>
              </td>
              <td>
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </td>
              <td>
                <label htmlFor="div">Division</label>
                <select
                  id="div"
                  value={div}
                  onChange={(e) => setDiv(e.target.value)}
                  required
                >
                  <option value="">Select Division</option>
                  <option value="Compressor">Compressor</option>
                  <option value="Glass">Glass</option>
                  <option value="Pumps">Pumps</option>
                  <option value="Water Heater">Water Heater</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Quality A">Quality A</option>
                  <option value="Quality B">Quality B</option>
                </select>
              </td>
              <td>
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </td>
              <td>
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">HR</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </td>
              <td>
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </td>
              <td>
                <label htmlFor="location">Location</label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan={2} />
              <td >
                <p style={{color:"black"}} className="status-container">Status: <strong >{status}</strong></p>
              </td>
            </tr>
            {error && (
              <tr>
                <td colSpan={3}>
                  <p className="error">{error}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form>
    </div>
    </React.Fragment>
  );
};

export default CreateProjectForm;
