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
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        }
    };
    const handleSave = async () => {
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
            console.log(response.data); // Handle the response as needed
            // If necessary, add code to handle successful save (like redirect or notification)
        } catch (error) {
            //  console.error('There was an error saving the data:', error);
            // Handle error case, possibly with user notification
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
            console.error(error.config);
        }
    };
    const fetchusers = async () => {
        try {
            const response = await axios.get(`${config.server.baseUrl}/get-users`); // Adjust the URL to your backend endpoint
            // Assuming the first row is headers, skip it
            // Target the 'data' property within the response data
            console.log(response.data.data);
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
                
                const [id,divisionName, supervisor, imageUrl] = response.data.data;

                setDivision(divisionName || ''); // Provide fallback value
                setSupervisor(supervisor || ''); // Provide fallback value
                setImageUrl(imageUrl || defaultImage);  // Use fetched imageUrl or defaultImage if null
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
                            alt="division"
                        />

                        <input
                            type="file"
                            id="divisionImage"
                            name="divisionImage"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-fields">
                        <h2>{id ? 'Edit Division' : 'Add Division'}</h2>
                        <label htmlFor="division">Division</label>
                        <input
                            type="text"
                            name="division"
                            placeholder="Enter Division Name"
                            value={division}
                            onChange={(e) => setDivision(e.target.value)}
                        />
                        <label htmlFor="supervisor">Supervisor</label>
                        <select id="supervisor" name="supervisor" value={supervisor} onChange={handleChange}>
                            <option value="" disabled>Select a user</option>
                            {users.map(user => (
                                <option key={user.user_id} value={user.user_id}>{user.Name}</option>
                            ))}
                        </select>
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
