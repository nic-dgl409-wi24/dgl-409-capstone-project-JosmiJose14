import React, { useState } from 'react';
import '../css/Registration.css'; // Ensure you have the CSS file for styling
import defaultImage from "../images/default.jpg";
import axios from 'axios';
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: 'Kitchen Manager',
    role: 'Administrator',
    division: 'Kitchen',
    profileImage: '', // Assuming this will be a base64 encoded string or a URL
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setFormData(prev => ({ ...prev, profileImage: upload.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Submit logic here
  //   console.log(formData);
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/register', formData)
      .then(response => {
        console.log(response.data);
        // Handle success
      })
      .catch(error => {
        console.error('There was an error!', error);
        // Handle error
      });
  };
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
            <option value="Kitchen Manager">Kitchen Manager</option>
            {/* Other options */}
          </select>
          <label htmlFor="division">Division</label>
          <select id="division" name="division" value={formData.division} onChange={handleChange}>
            <option value="Kitchen">Kitchen</option>
            {/* Other options */}
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
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="Administrator">Administrator</option>
            {/* Other options */}
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
