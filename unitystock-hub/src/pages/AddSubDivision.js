import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import defaultImage from "../images/default.jpg";
import config from '../common/config';
import '../css/AddDivision.css';

export default function SubDivisionAddEdit() {
    const [subdivision, setSubDivision] = useState('');
    const [divisions, setDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState(''); // Assuming this tracks the selected division ID
    const [imageUrl, setImageUrl] = useState(""); // State to store image URL
    // const [users, setUsers] = useState([]);
    const { divisionId } = useParams(); // Use useParams to get the id from URL
    const { id } = useParams();
    const navigate = useNavigate(); // Use useHistory for navigation
    const [validationErrors, setValidationErrors] = useState({});
    const [uploadMessage, setUploadMessage] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    useEffect(() => {
        fetchDivisions();
        if (divisionId) {
            setSelectedDivision(divisionId);
        }
        if (id) {
            fetchSubDivisionDetails(id); // Fetch division details if id is present
        }
    }, [divisionId, id]); // Add an empty dependency array here
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'divisions') {
            setSelectedDivision(value.toUpperCase()); // Update the selected division
        }
    };
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;      
        if (!subdivision.trim()) {
            errors.subdivision = 'Sub-Department name is required.';
            formIsValid = false;
        }
        if (!selectedDivision) {
            errors.selectedDivision = 'Department is required.';
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
            formData.append('dirPath', './images/subdivision/');
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
            subdivision,
            selectedDivision,
            imageUrl
        };
        // The URL of your backend endpoint
        const endpoint = `${config.server.baseUrl}/save-subdivision`;
        try {
            // Send a POST request to your backend service
            const response = await axios.post(endpoint, data);
            setSubmitMessage(response.data.message);
        } catch (error) {
            setSubmitMessage(error.response.data.error);
        }
    };
    const fetchDivisions = async () => {
        try {
            const response = await axios.get(`${config.server.baseUrl}/get-divisions`); // Adjust the URL to your backend endpoint
            // Assuming the first row is headers, skip it
            // Target the 'data' property within the response data
            const divisionData = response.data.data.slice(1).map(row => ({
                id: row[0],
                name: row[1],
                supervisorId: row[2] || '',
                imageUrl: row[3] || ''
            }));
            setDivisions(divisionData);
        } catch (error) {
            console.error('Error fetching divisions:', error);
        }
    };
    const fetchSubDivisionDetails = async (id) => {
        try {
            // Replace URL with your endpoint to fetch division details by id
            const response = await axios.get(`${config.server.baseUrl}/get-subdivision/${id}`);
            if (response.data && response.data.data) {
                // eslint-disable-next-line no-unused-vars
                const [id, subdivisionName, division, imageUrl] = response.data.data;
                setSubDivision(subdivisionName || ''); // Provide fallback value
                setSelectedDivision(division || ''); // Provide fallback value
                setImageUrl(imageUrl || '');  // Use fetched imageUrl or defaultImage if null
            }
        } catch (error) {
            console.error('Error fetching division details:', error);
        }
    };
    return (
        <div className="division-container">
            <div className="form-container">
                <div className="image-column">
                    <div className="image-container">
                        <img
                            className="division-image"
                            src={imageUrl ? `${config.server.baseUrl}/${imageUrl}` : defaultImage}
                            alt="subdivision"
                        />
                        <input
                            type="file"
                            id="subdivisionImage"
                            name="subdivisionImage"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        {validationErrors.imageUrl && <div className="error-message">{validationErrors.imageUrl}</div>}
                        {uploadMessage && <div className={uploadMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{uploadMessage}</div>}
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-fields">
                        <h2 className='section-heading'>{id ? 'Edit Sub-Department' : 'Add Sub-Department'}</h2>
                        {submitMessage && <div className={submitMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{submitMessage}</div>}
                        <label htmlFor="subdivision">Sub Department</label>
                        <input
                            type="text"
                            name="subdivision"
                            placeholder="Enter Sub Department Name"
                            value={subdivision}
                            onChange={(e) => setSubDivision(e.target.value)}
                        />
                        {validationErrors.subdivision && <div className="error-message">{validationErrors.subdivision}</div>}
                        <label htmlFor="divisions">Select Division</label>
                        <select
                            id="divisions"
                            name="divisions"
                            value={selectedDivision}
                            onChange={handleChange}
                            disabled={selectedDivision ? true : false}>
                            <option value="" disabled>Select a Division</option>
                            {divisions.map((division) => (
                                <option key={division.id} value={division.id}>{division.name}</option>
                            ))}
                        </select>
                        {selectedDivision && (
                            <input type="hidden" name="selectedDivision" value={selectedDivision} />
                        )}
                        {validationErrors.division && <div className="error-message">{validationErrors.division}</div>}
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
