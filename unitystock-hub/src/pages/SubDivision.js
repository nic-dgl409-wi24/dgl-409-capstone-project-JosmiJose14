import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../css/Division.css'; // Ensure you have the CSS file for styling
import config from '../common/config';
import defaultImage from "../images/default.jpg";
import { useAuth } from '../pages/auth/AuthContext'; // Adjust the path as necessary
import axios from 'axios';

export default function SubDivision() {
    const [subdivisions, setSubDivisions] = useState([]); // State to store divisions
    let navigate = useNavigate();
    const { divisionId } = useParams(); // Use useParams to get the id from URL
    const { user } = useAuth(); // Access global user data
    // Function to fetch division data
    const fetchSubDivisions = async (divisionId) => {
        try {
            const response = await axios.get(`${config.server.baseUrl}/get-subdivisions/${divisionId}`);
            
            // Assuming the first row is headers, skip it
            // Target the 'data' property within the response data
            const subdivisionData = response.data.data.map(row => ({
                id: row[0],
                name: row[1],
                supervisorId: row[2] || '',
                imageUrl: row[3] || ''
            }));
            setSubDivisions(subdivisionData);
        } catch (error) {
            console.error('Error fetching divisions:', error);
        }
    };
    // useEffect to call fetchDivisions when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchSubDivisions(divisionId);
    }, [divisionId]);

    function handleEdit(Id) {
        // Logic to handle edit action for the division with the given id
        navigate(`/AddSubDivision/edit/${Id}`);
    }
    function handleRedirect(subId) {
        // Logic to handle edit action for the division with the given id
        navigate(`/Inventories/${subId}`);
    }
    function handleDelete(divisionId) {
        // Logic to handle delete action for the division with the given id
        console.log(`Delete division with ID: ${divisionId}`);
    }

    return (
        <div className="division-container">
            <div className="division-header">
                <h2 className='section-heading'>Sub-Department</h2>
                <span className='welcome-text'>Welcome, {user?.Name || 'User'}!</span> {/* Use optional chaining */}
                {user.RoleId !== 2 && (
                    <span className="add-division-button">
                        <Link to={`/AddSubDivision/add/${divisionId}`} className="btn">Add Sub-Department</Link>
                    </span>
                )}
            </div>
            <div className="division-grid">
                {subdivisions.map((division, index) => (
                    <div className="division-card" key={index}>
                        <img src={division.imageUrl ? `${config.server.baseUrl}/${division.imageUrl}` : defaultImage} alt={division.name} className="division-image" onClick={() => handleRedirect(division.id)} />
                        <div className="card-body">
                            <h3>{division.name}</h3>
                            {user.RoleId !== 2 && (
                                <div className="division-actions">
                                    {/* Bind division.id to the onClick event for the Edit button */}
                                    <button className='btn' onClick={() => handleEdit(division.id)}>Edit</button>
                                    {/* Bind division.id to the onClick event for the Delete button */}
                                    <button className='btn' onClick={() => handleDelete(division.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
