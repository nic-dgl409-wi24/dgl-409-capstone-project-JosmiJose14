import React, { useState, useEffect } from 'react';
import '../css/Registration.css'; // Ensure you have the CSS file for styling
import defaultImage from "../images/default.jpg";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/auth/AuthContext'; // Adjust the path as necessary
import config from '../common/config';
import axios from 'axios';
const RegistrationForm = () => {
  const { user } = useAuth(); // Access global user data
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    roleId: '',
    divisionId: '',
    imageUrl: '', // Assuming this will be a base64 encoded string or a URL
  });
  const [roles, setRoles] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const navigate = useNavigate();


  // Function to fetch division data
  const fetchDivisions = async () => {
    try {
      const response = await axios.get(`${config.server.baseUrl}/get-divisions`); // Adjust the URL to your backend endpoint
      // Target the 'data' property within the response data
      const divisionData = response.data.data.slice(1).map(row => ({
        id: row[0],
        name: row[1],
      }));
      setDivisions(divisionData);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchJobTitles = async () => {
    try {
      const response = await axios.get(`${config.server.baseUrl}/get-jobtitles`); // Adjust the URL to your backend endpoint
      // Assuming the first row is headers, skip it
      // Target the 'data' property within the response data
      const jobData = response.data.data;
      setJobTitles(jobData);
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${config.server.baseUrl}/get-roles`); // Adjust the URL to your backend endpoint
      const roleData = response.data.data;
      setRoles(roleData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    console.log(e);
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('imageUrl', file);
      formData.append('dirPath', './images/profile/');
      // Send the file to your server
      axios.post(`${config.server.baseUrl}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          // Handle the response, e.g., setting the image URL received from the server
          setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));

        })
        .catch(error => {
          console.error('Error uploading image:', error);
        });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${config.server.baseUrl}/register`, formData)
      .then(response => {
        console.log(response.data);
        navigate('/Division');
      })
      .catch(error => {
        console.error('There was an error!', error);
        // Handle error
      });
  };
  // Populate form data with user data
  useEffect(() => {
    if (user) {
      setFormData(currentFormData => ({
        ...currentFormData,
        name: user.Name || currentFormData.name,
        contactNumber: user.ContactNumber || currentFormData.contactNumber,
        email: user.Email || currentFormData.email,
        jobTitle: user.JobTitle || currentFormData.jobTitle,
        roleId: user.RoleId || currentFormData.roleId,
        divisionId: user.DivisionId || currentFormData.divisionId,
        imageUrl: user.ImageUrl || currentFormData.imageUrl, // Assuming this will be a base64 encoded string or a URL
      }));
    }
  }, [user]); // Only 'user' is a dependency now


  useEffect(() => {
    fetchRoles();
    fetchJobTitles();
    fetchDivisions();
  }, []); // Add an empty dependency array here
  return (
    <div className="registration-container">
      <h2>User Registration</h2> {/* Heading for the form */}
      <div className="registration-form">
        <div className="form-column left-column">
          <div className="profile-container">
            <img
              className="profile-image"
              src={formData.profileImage || defaultImage} // Placeholder image path
              alt="Profile"
            />
            <input
              type="file"
              id="profileImage" // Associated label will use this id
              name="profileImage"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <label htmlFor="jobTitle">Job Title</label>
          <select id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange}>
            <option value="" disabled>Select a job</option>
            {jobTitles.map(jobTitle => (
              <option key={jobTitle.id} value={jobTitle.id}>{jobTitle.name}</option>
            ))}</select>
          <label htmlFor="divisionId">Division</label>
          <select id="division" name="divisionId" value={formData.divisionId} onChange={handleChange}>
            <option value="" disabled>Select a division</option>
            {divisions.map(division => (
              <option key={division.id} value={division.id}>{division.name}</option>
            ))}
          </select>

        </div>
        <div className="form-column right-column">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="contactNumber">Contact No</label>
          <input
            id="contactNumber"
            type="text"
            name="contactNumber"
            placeholder="Contact No"
            value={formData.contactNumber}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <label htmlFor="roleId">Role</label>
          <select id="role" name="roleId" value={formData.roleId} onChange={handleChange}>
            <option value="" disabled>Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <div className="divButton">
            <button className="btn btnRegister" onClick={handleSubmit}>Register</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegistrationForm;
