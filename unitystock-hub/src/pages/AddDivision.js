import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultImage from "../images/default.jpg";
import '../css/AddDivision.css';

export default function Division() {
    const [division, setDivision] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [imageUrl, setImageUrl] = useState(""); // State to store image URL
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchusers();
    }, []); // Add an empty dependency array here
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
           
            setImageUrl(URL.createObjectURL(file));
            // Send the file to your server
            debugger
            axios.post('http://localhost:3001/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        }
    };
    const handleSave = async () => {
        // Construct the data object you want to send
        const data = {
            division,
            supervisor,
            imageUrl
        };

        // The URL of your backend endpoint
        const endpoint = 'http://localhost:3001/save-division';

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
            const response = await axios.get('http://localhost:3001/get-users'); // Adjust the URL to your backend endpoint
            // Assuming the first row is headers, skip it
            // Target the 'data' property within the response data
            console.log(response.data.data);
            const users = response.data.data;
            setUsers(users);
        } catch (error) {
            console.error('Error fetching job:', error);
        }
    };
    return (
        <div className="division-container">
            <div className="form-container">
                <div className="image-column">
                    <div className="image-container">
                        <img
                            className="division-image"
                            src={imageUrl || defaultImage} // Use imageUrl state here
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
                        <h2>Add Division</h2>
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
                        <button className="btn save" onClick={handleSave}>Save</button>
                        <button className="btn back">Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
