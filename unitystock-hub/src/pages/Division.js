import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Division.css'; // Ensure you have the CSS file for styling
import axios from 'axios';
export default function Division() {
    // Define any state variables or functions here if needed

    return (
        <div className="division-container">
            <h2>Division</h2>
            <div className="divAddDivision">
                     <Link to="/AddDivision" className="btn">Add Division</Link>
            </div>
            <div className="division-cards">
                <div className="division-card">
                    <div className="division-icon-container">
                        <div className="division-icon kitchen-icon"></div>
                    </div>
                    <div className="division-info">
                        <h3>Kitchen</h3>
                        <div className="division-actions">
                            <button className='btn'>Edit</button>
                            <button className='btn'>Delete</button>
                        </div>
                    </div>
                </div>
                <div className="division-card">
                    <div className="division-icon housekeeping-icon"></div>
                    <div className="division-info">
                        <h3>House Keeping</h3>
                        <div className="division-actions">
                            <button className='btn'>Edit</button>
                            <button className='btn'>Delete</button>
                        </div>
                    </div>
                </div>
                <div className="division-card">
                    <div className="division-icon recreation-icon"></div>
                    <div className="division-info">
                        <h3>Recreation</h3>
                        <div className="division-actions">
                            <button className='btn'>Edit</button>
                            <button className='btn'>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}