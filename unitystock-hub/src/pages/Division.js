import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Division.css'; // Ensure you have the CSS file for styling
import config from '../common/config';
import defaultImage from "../images/default.jpg";
import axios from 'axios';
import { useAuth } from '../pages/auth/AuthContext'; // Adjust the path as necessary

export default function Division() {
    const [divisions, setDivisions] = useState([]); // State to store divisions
    let navigate = useNavigate();
    const { user } = useAuth(); // Access global user data
    // Function to fetch division data
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

    // useEffect to call fetchDivisions when the component mounts
    useEffect(() => {
        fetchDivisions();
    }, []);
    function handleEdit(divisionId) {
        // Logic to handle edit action for the division with the given id
        navigate(`/AddDivision/edit/${divisionId}`);
    }
    function handleRedirect(divisionId) {
        // Logic to handle edit action for the division with the given id
        navigate(`/SubDivision/${divisionId}`);
    }
    function handleDelete(divisionId) {
        // Logic to handle delete action for the division with the given id
        console.log(`Delete division with ID: ${divisionId}`);
    }

    return (
        <div className="division-container">
            <div className="division-header">
                <h2 className='section-heading'>Departments</h2>
                <span className='welcome-text'>Welcome, {user?.Name || 'User'}!</span> {/* Use optional chaining */}
                {user.RoleId !== 2 && (
                    <span className="add-division-button">
                        <Link to="/AddDivision/add" className="btn">Add Department</Link>
                    </span>
                )}
            </div>

            {/* Division Cards */}
            <div className="division-grid">
                {divisions.map((division, index) => (
                    <div className="division-card" key={division.id} >
                        <img src={division.imageUrl ? `${config.server.baseUrl}/${division.imageUrl}` : defaultImage} alt={division.name} className="division-image" onClick={() => handleRedirect(division.id)} />
                        <div className="card-body">
                            <h3>{division.name}</h3>
                            {user.RoleId !== 2 && (
                            <div className="division-actions">
                                <button className="btn" onClick={() => handleEdit(division.id)}>Edit</button>
                                <button className="btn" onClick={() => handleDelete(division.id)}>Delete</button>
                            </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}
