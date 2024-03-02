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

    useEffect(() => {
        fetchDivisions();
        if (divisionId) {
            setSelectedDivision(divisionId);
        }
        if (id) {
            fetchSubDivisionDetails(id); // Fetch division details if id is present
        }
    }, [divisionId,id]); // Add an empty dependency array here
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'divisions') {
            setSelectedDivision(value); // Update the selected division
        }
    };
    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('imageUrl', file);
            formData.append('dirPath', './images/subdivision/');

            // Send the file to your server
            debugger
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
        debugger
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
            debugger
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
                debugger
                const [id,subdivisionName, division, imageUrl] = response.data.data;

                setSubDivision(subdivisionName || ''); // Provide fallback value
                setSelectedDivision(division || ''); // Provide fallback value
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
                            alt="subdivision"
                        />

                        <input
                            type="file"
                            id="subdivisionImage"
                            name="subdivisionImage"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-fields">
                        <h2>{id ? 'Edit SubDivision' : 'Add SubDivision'}</h2>
                        <label htmlFor="subdivision">Sub Division</label>
                        <input
                            type="text"
                            name="subdivision"
                            placeholder="Enter Division Name"
                            value={subdivision}
                            onChange={(e) => setSubDivision(e.target.value)}
                        />
                        <label htmlFor="divisions">Division</label>
                        <select id="divisions" name="divisions" value={selectedDivision} onChange={handleChange}>
                            <option value="" disabled>Select a Division</option>
                            {divisions.map((division) => (
                                <option key={division.id} value={division.id}>{division.name}</option>
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
