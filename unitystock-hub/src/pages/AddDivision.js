import React, { useState } from 'react';
import axios from 'axios';
import defaultImage from "../images/default.jpg";
import '../css/AddDivision.css';

export default function Division() {
    const [division, setDivision] = useState('');
    const [supervisor, setSupervisor] = useState('');

    const handleSave = async () => {
        // Construct the data object you want to send
        const data = {
            division,
            supervisor
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

    return (
        <div className="division-container">
            <div className="form-container">
                <div className="image-column">
                    <div className="image-container">
                        <img src={defaultImage} alt="Cleaning Supplies" />
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
                        <select 
                            name='supervisor'
                            value={supervisor}
                            onChange={(e) => setSupervisor(e.target.value)}
                        >
                            <option value="">Select an option</option>
                            {/* Other options go here */}
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
