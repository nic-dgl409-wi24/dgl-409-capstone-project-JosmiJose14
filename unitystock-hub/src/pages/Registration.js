import React, { useState, useEffect } from 'react';
import '../css/Registration.css'; // Ensure you have the CSS file for styling
import defaultImage from "../images/default.jpg";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/auth/AuthContext'; // Adjust the path as necessary
import config from '../common/config';
import axios from 'axios';
const RegistrationForm = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const { user } = useAuth(); // Access global user data
  const [roles, setRoles] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
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

  const navigate = useNavigate();
  useEffect(() => {
    fetchRoles();
    fetchJobTitles();
    fetchDivisions();
  }, []); // Add an empty dependency array here
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (!formData.imageUrl) {
      errors.imageUrl = "Please upload an image.";
      formIsValid = false;
    }
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
      formIsValid = false;
    }

    // Contact Number validation (simple format, can be adjusted)
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "Contact Number is required";
      formIsValid = false;
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Invalid Contact Number";
      formIsValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      formIsValid = false;
    }

    // Password validation
    if(!user){
    if (!formData.password) {
      errors.password = "Password is required";
      formIsValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      formIsValid = false;
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      formIsValid = false;
    }
  }
    if (!formData.roleId) {
      errors.roleId = "Role is required";
      formIsValid = false;
    }

    // Job Title validation
    if (!formData.jobTitle) {
      errors.jobTitle = "Job Title is required";
      formIsValid = false;
    }

    // Division validation
    if (!formData.divisionId) {
      errors.divisionId = "Division is required";
      formIsValid = false;
    }

    setValidationErrors(errors);
    return formIsValid;
  };
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
          setUploadMessage('Image uploaded successfully.');
          setValidationErrors(prevErrors => ({ ...prevErrors, imageUrl: '' }));

        })
        .catch(error => {
          setUploadMessage('Failed to upload image.');
        });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    debugger
    if (!validateForm()) {
      setSubmitMessage(validationErrors);
      return;
    }
    axios.post(`${config.server.baseUrl}/register`, formData)
      .then(response => {
        debugger
        setSubmitMessage(response.data.message);
        if(!user){
        navigate('/Division');
        }
      })
      .catch(error => {
        setSubmitMessage(error.response.data.message);
      });
  };
  // Populate form data with user data
  useEffect(() => {
    if (user) {
      setFormData(currentFormData => ({
        ...currentFormData,
        userId: user.user_id || currentFormData.user_id,
        name: user.Name || currentFormData.name,
        contactNumber: user.ContactNumber || currentFormData.contactNumber,
        email: user.Email || currentFormData.email,
        jobTitle: user.Jobtitle || currentFormData.jobTitle,
        roleId: user.RoleId || currentFormData.roleId,
        divisionId: user.DivisionID || currentFormData.divisionId,
        imageUrl: user.ImageUrl || currentFormData.imageUrl, // Assuming this will be a base64 encoded string or a URL
      }));
    }
  }, [user]); // Only 'user' is a dependency now

  return (
    <div className="registration-container">
      <h2 className='section-heading'>{user ? "Profile" : "User Registration"}</h2>     
      <div className="registration-form">
        <div className="form-column left-column">
          <div className="profile-container">
            <img
              className="imageClass"
              src={formData.imageUrl ? `${config.server.baseUrl}/${formData.imageUrl}` : defaultImage}
              alt={formData.name} />
            <input
              type="file"
              id="profileImage" // Associated label will use this id
              name="profileImage"
              onChange={handleImageChange}
              accept="image/*"
            />
            {uploadMessage && <div className={uploadMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{uploadMessage}</div>}
            {validationErrors.imageUrl && <div className="error-message">{validationErrors.imageUrl}</div>}
          </div>
        </div>
        <div className="form-column right-column">
        {typeof submitMessage === 'string' && submitMessage && <div className={submitMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{submitMessage}</div>}
          <label htmlFor="name">Name<span className="required">*</span></label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            aria-required="true"
            value={formData.name}
            onChange={handleChange}
          />
          {validationErrors.name && <div className="error-message">{validationErrors.name}</div>}
          <label htmlFor="contactNumber">Contact No<span className="required">*</span></label>
          <input
            id="contactNumber"
            type="text"
            name="contactNumber"
            placeholder="Contact No"
            value={formData.contactNumber}
            onChange={handleChange}
          />
          {validationErrors.contactNumber && <div className="error-message">{validationErrors.contactNumber}</div>}
          <label htmlFor="email">Email<span className="required">*</span></label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors.email && <div className="error-message">{validationErrors.email}</div>}
          {!user && (
            <>
              <label htmlFor="password">Password<span className="required">*</span></label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {validationErrors.password && <div className="error-message">{validationErrors.password}</div>}
              <label htmlFor="confirmPassword">Confirm Password<span className="required">*</span></label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {validationErrors.confirmPassword && <div className="error-message">{validationErrors.confirmPassword}</div>}
            </>
          )}

          <label htmlFor="roleId">Role<span className="required">*</span></label>
          <select id="role" name="roleId" value={formData.roleId} onChange={handleChange}>
            <option value="" disabled>Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          {validationErrors.roleId && <div className="error-message">{validationErrors.roleId}</div>}
          <label htmlFor="jobTitle">Job Title<span className="required">*</span></label>
          <select id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange}>
            <option value="" disabled>Select a job</option>
            {jobTitles.map(jobTitle => (
              <option key={jobTitle.id} value={jobTitle.id}>{jobTitle.name}</option>
            ))}</select>
          {validationErrors.jobTitle && <div className="error-message">{validationErrors.jobTitle}</div>}
          <label htmlFor="divisionId">Division<span className="required">*</span></label>
          <select id="division" name="divisionId" value={formData.divisionId} onChange={handleChange}>
            <option value="" disabled>Select a division</option>
            {divisions.map(division => (
              <option key={division.id} value={division.id}>{division.name}</option>
            ))}
          </select>
          {validationErrors.divisionId && <div className="error-message">{validationErrors.divisionId}</div>}
          <div className="divButton">
            <button className="btn btnRegister" onClick={handleSubmit}>
              {user ? "Save" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
