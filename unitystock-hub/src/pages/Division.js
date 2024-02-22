import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Division.css'; // Ensure you have the CSS file for styling
import axios from 'axios';

export default function Division() {
    const [divisions, setDivisions] = useState([]); // State to store divisions

    // Function to fetch division data
    const fetchDivisions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-divisions'); // Adjust the URL to your backend endpoint
            // Assuming the first row is headers, skip it
            console.log("API Response:", response.data); // Log the response data
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

    // useEffect to call fetchDivisions when the component mounts
    useEffect(() => {
        fetchDivisions();
    }, []);

    return (
        <div className="division-container">
            <h2>Division</h2>
            <div className="divAddDivision">
                <Link to="/AddDivision" className="btn">Add Division</Link>
            </div>
            <div className="division-cards">
                {divisions.map((division, index) => (
                    <div className="division-card" key={index}>
                        <div className="division-icon-container">
                            {/* <div className="division-icon" style={{ backgroundImage: `url(${division.imageUrl})` }}></div> */}
                            <div className="division-icon kitchen-icon"></div>
                        </div>
                        <div className="division-info">
                            <h3>{division.name}</h3>
                            <div className="division-actions">
                                <button className='btn'>Edit</button>
                                <button className='btn'>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
