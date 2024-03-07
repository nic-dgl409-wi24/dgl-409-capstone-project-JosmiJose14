import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import defaultImage from "../images/default.jpg";
import config from '../common/config';
import '../css/AddDivision.css';

export default function Division() {
    const [division, setDivision] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [imageUrl, setImageUrl] = useState(""); // State to store image URL
    const [users, setUsers] = useState([]);
    const { id } = useParams(); // Use useParams to get the id from URL
    const navigate = useNavigate(); // Use useHistory for navigation
    const [validationErrors, setValidationErrors] = useState({});
    const [uploadMessage, setUploadMessage] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    useEffect(() => {
        fetchusers();
        if (id) {
            fetchDivisionDetails(id); // Fetch division details if id is present
        }
    }, [id]); // Add an empty dependency array here
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'supervisor') {
            setSupervisor(value);
        }
    };
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
        if (!imageUrl) {
            errors.imageUrl = "Please upload an image.";
            formIsValid = false;
        }

        if (!division.trim()) {
            errors.division = 'Division name is required.';
            formIsValid = false;
        }

        if (!supervisor) {
            errors.supervisor = 'Supervisor selection is required.';
            formIsValid = false;
        }
        setValidationErrors(errors);
        return formIsValid;
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('imageUrl', file);
            formData.append('dirPath', './images/division/');

            // Send the file to your server

            axios.post(`${config.server.baseUrl}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setImageUrl(response.data.imageUrl);
                    setUploadMessage('Image uploaded successfully.');
                    setValidationErrors(prevErrors => ({ ...prevErrors, imageUrl: '' }));
                })
                .catch(error => {
                    setUploadMessage('Failed to upload image.');
                });
        }
    };
    const handleSave = async () => {
        if (!validateForm()) {
            return; // Stop the save operation if validation fails
        }
        // Construct the data object you want to send
        const data = {
            id,
            division,
            supervisor,
            imageUrl
        };
        // The URL of your backend endpoint
        const endpoint = `${config.server.baseUrl}/save-division`;
        try {
            // Send a POST request to your backend service
            const response = await axios.post(endpoint, data);
            setSubmitMessage(response.data.message);
        } catch (error) {
            setSubmitMessage(error.response.data.error);
        }
    };
    const fetchusers = async () => {
        try {
            const response = await axios.get(`${config.server.baseUrl}/get-users`); // Adjust the URL to your backend endpoint
             const users = response.data.data;
            setUsers(users);
        } catch (error) {
            console.error('Error fetching job:', error);
        }
    };
    const fetchDivisionDetails = async (divisionId) => {
        try {
            // Replace URL with your endpoint to fetch division details by id
            const response = await axios.get(`${config.server.baseUrl}/get-division/${divisionId}`);
            if (response.data && response.data.data) {

                const [id, divisionName, supervisor, imageUrl] = response.data.data;
                setDivision(divisionName || ''); // Provide fallback value
                setSupervisor(supervisor || ''); // Provide fallback value
                setImageUrl(imageUrl || defaultImage);  // Use fetched imageUrl or defaultImage if null
            }
        } catch (error) {
            console.error('Error fetching division details:', error);
        }
    };
    return (
        <div className="department-container">
            <div className="form-container">
                <div className="image-column">
                    <div className="image-container">
                        <img
                            className="division-image"
                            src={imageUrl ? `${config.server.baseUrl}/${imageUrl}` : defaultImage}
                            alt="division"
                        />
                        <input
                            type="file"
                            id="divisionImage"
                            name="divisionImage"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        {validationErrors.imageUrl && <div className="error-message">{validationErrors.imageUrl}</div>}
                        {uploadMessage && <div className={uploadMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{uploadMessage}</div>}
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-fields">
                        <h2 className='section-heading'>{id ? 'Edit Department' : 'Add Department'}</h2>
                        {submitMessage && <div className={submitMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{submitMessage}</div>}
                        <label htmlFor="division">Division</label>
                        <input
                            type="text"
                            name="division"
                            placeholder="Enter Division Name"
                            value={division}
                            onChange={(e) => setDivision(e.target.value)}
                        />
                        {validationErrors.division && <div className="error-message">{validationErrors.division}</div>}
                        <label htmlFor="supervisor">Supervisor</label>
                        <select id="supervisor" name="supervisor" value={supervisor} onChange={handleChange}>
                            <option value="" disabled>Select a user</option>
                            {users.map(user => (
                                <option key={user.user_id} value={user.user_id}>{user.Name}</option>
                            ))}
                        </select>
                        {validationErrors.supervisor && <div className="error-message">{validationErrors.supervisor}</div>}
                    </div>
                    <div className="form-actions">
                        <button className="btn save" onClick={handleSave}>{id ? 'Update' : 'Save'}</button>
                        <button className="btn back" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
