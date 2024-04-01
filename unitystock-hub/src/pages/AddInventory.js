import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import defaultImage from "../images/default.jpg";
import config from '../common/config';
import '../css/AddDivision.css'; // Update to the correct CSS file
import { useAuth } from '../pages/auth/AuthContext'; // Adjust the path as necessary
export default function SubInventoryAddEdit() {
    // State to store the form data
    const { user } = useAuth(); // Access global user data
    const currentDate = new Date().toISOString().split('T')[0];
    const [subdivisions, setSubDivisions] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { subId } = useParams();
    const [validationErrors, setValidationErrors] = useState({});
    const [uploadMessage, setUploadMessage] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        quantity: '',
        manufacture: '',
        supplier: '',
        expiryDate: '',
        selectedSubDivision: subId || '',
        imageUrl: '', // Use default image as initial value
        LastUpdatedBy: user.Name,
        LastUpdateTimestamp: currentDate
    });


    useEffect(() => {
        fetchSubDivisions();
        if (id) {
            fetchInventory(id); // Fetch division details if id is present
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));
    };

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        // Validate name
        if (!formData.name) {
            errors.name = "Product name is required.";
            formIsValid = false;
        }

        // Validate quantity
        if (!formData.quantity) {
            errors.quantity = "Quantity is required.";
            formIsValid = false;
        } else if (isNaN(formData.quantity) || parseInt(formData.quantity, 10) <= 0) {
            errors.quantity = "Quantity must be a positive number.";
            formIsValid = false;
        }

        // Validate manufacture
        if (!formData.manufacture) {
            errors.manufacture = "Manufacture is required.";
            formIsValid = false;
        }

        // Validate supplier
        if (!formData.supplier) {
            errors.supplier = "Supplier is required.";
            formIsValid = false;
        }

        // Validate expiryDate
        if (!formData.expiryDate) {
            errors.expiryDate = "Expiry date is required.";
            formIsValid = false;
        } else {
            const currentDate = new Date();
            const expiryDate = new Date(formData.expiryDate);

            if (expiryDate < currentDate) {
                errors.expiryDate = "Expiry date should not be a previous date.";
                formIsValid = false;
            }
        }

        // Validate selectedSubDivision
        if (!formData.selectedSubDivision) {
            errors.selectedSubDivision = "Sub-division selection is required.";
            formIsValid = false;
        }

        // Validate imageUrl
        if (!formData.imageUrl) {
            errors.imageUrl = "Please upload an image.";
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
            formData.append('dirPath', './images/inventory/');
            // Send the file to your server
            axios.post(`${config.server.baseUrl}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    // Handle the response, e.g., setting the image URL received from the server
                    setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
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
        // The URL of your backend endpoint
        const endpoint = `${config.server.baseUrl}/save-inventory`;
        try {

            // Send a POST request to your backend service
            const response = await axios.post(endpoint, formData);
            setSubmitMessage(response.data.message);
        } catch (error) {
            setSubmitMessage(error.response.data.error);
        }
    };
    const fetchSubDivisions = async () => {
        try {
            const response = await axios.get(`${config.server.baseUrl}/get-subdivisions`); // Adjust the URL to your backend endpoint
            // Assuming the first row is headers, skip it
            // Target the 'data' property within the response data
            const divisionData = response.data.data.slice(1).map(row => ({
                id: row[0],
                name: row[1],
                supervisorId: row[2] || '',
                imageUrl: row[3] || ''
            }));
            setSubDivisions(divisionData);
        } catch (error) {
            console.error('Error fetching divisions:', error);
        }
    };
    const fetchInventory = async (id) => {
        try {
            // Replace URL with your endpoint to fetch division details by id
            const response = await axios.get(`${config.server.baseUrl}/get-inventory/${id}`);
            const inventoryData = response.data.data;
            // Update the formData state with the fetched data
            setFormData({
                id: inventoryData[0],
                name: inventoryData[1],
                quantity: inventoryData[2],
                manufacture: inventoryData[6],
                supplier: inventoryData[7],
                expiryDate: inventoryData[4],
                selectedSubDivision: inventoryData[3], // Make sure this is the correct index for the sub-division
                imageUrl: inventoryData[5], // Make sure this is the correct index for the image URL
                LastUpdatedBy: user.Name,
                LastUpdateTimestamp: currentDate // currentDate should be in the state or fetched from somewhere
            });
        } catch (error) {
            console.error('Error fetching division details:', error);
        }
    };
    const handleBack = () => {
        if (subId) {
            navigate(`/unitystockhub/Inventories/${subId}`);
        }
        else
            navigate(`/unitystockhub/Inventories`)
    };

    return (
        <div className="division-container">
            <div className="form-container">
                <div className="image-column">
                    <div className="image-container">
                        <img
                            className="inventory-image"
                            src={formData.imageUrl ? `${config.server.baseUrl}/${formData.imageUrl}` : defaultImage}
                            alt={formData.Name}
                        />
                         {
                            user.RoleId !== 2 ? (
                        <input
                            type="file"
                            id="inventoryImage"
                            name="inventoryImage"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        ) : (
                           <span></span>
                        )
                    }
                        {validationErrors.imageUrl && <div className="error-message">{validationErrors.imageUrl}</div>}
                        {uploadMessage && <div className={uploadMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{uploadMessage}</div>}
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-fields">
                        <h2 className='section-heading'>{id ? 'Edit Inventory' : 'Add Inventory'}</h2>
                        {submitMessage && <div className={submitMessage.startsWith('Failed') ? 'error-message' : 'success-message'}>{submitMessage}</div>}
                        <label htmlFor="name">Product Name</label>
                        {
                            user.RoleId !== 2 ? (
                                <input
                                    type="text"
                                    id="name"
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Plate"
                                />
                            ) : (
                                <input
                                type="text"
                                id="name"
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Plate"
                                disabled={true} 
                            />
                            )
                        }
                        {validationErrors.name && <div className="error-message">{validationErrors.name}</div>}
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="e.g., 200"
                        />
                        {validationErrors.quantity && <div className="error-message">{validationErrors.quantity}</div>}
                        <label htmlFor="manufacture">Manufacture</label>
                        {
                            user.RoleId !== 2 ? (
                                <input
                                    type="text"
                                    id="manufacture"
                                    name="manufacture"
                                    value={formData.manufacture}
                                    onChange={handleChange}
                                    placeholder="e.g., NA"
                                />
                            ) : (
                                <input
                                type="text"
                                id="manufacture"
                                name="manufacture"
                                value={formData.manufacture}
                                onChange={handleChange}
                                placeholder="e.g., NA"
                                disabled={true}
                            />
                            )
                        }
                        {validationErrors.manufacture && <div className="error-message">{validationErrors.manufacture}</div>}
                        <label htmlFor="supplier">Supplier</label>
                        {
                            user.RoleId !== 2 ? (
                                <input
                                    type="text"
                                    id="supplier"
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleChange}
                                    placeholder="e.g., NA"
                                />
                            ) : (
                                <input
                                type="text"
                                id="supplier"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                placeholder="e.g., NA"
                                disabled={true}
                            />
                            )
                        }
                        {validationErrors.supplier && <div className="error-message">{validationErrors.supplier}</div>}
                        <label htmlFor="expiryDate">ExpiryDate</label>
                        {
                            user.RoleId !== 2 ? (
                                <input
                                    type="date"
                                    id="expiryDate"
                                    name='expiryDate'
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                />
                            ) : (
                                <input
                                type="date"
                                id="expiryDate"
                                name='expiryDate'
                                value={formData.expiryDate}
                                onChange={handleChange}
                                disabled={true}
                            />
                            )
                        }
                        {validationErrors.expiryDate && <div className="error-message">{validationErrors.expiryDate}</div>}
                        <label htmlFor="subdivisions">Select sub- department</label>
                        <select
                            id="selectedSubDivision"
                            name="selectedSubDivision"
                            value={formData.selectedSubDivision}
                            onChange={handleChange}
                            disabled={user.RoleId === 2 || formData.selectedSubDivision ? true : false}>
                            <option value="" disabled>Select a Division</option>
                            {subdivisions.map((division) => (
                                <option key={division.id} value={division.id}>{division.name}</option>
                            ))}
                        </select>

                        {formData.selectedSubDivision && (
                            <input type="hidden" name="selectedSubDivision" value={formData.selectedSubDivision} />
                        )}
                        {validationErrors.selectedSubDivision && <div className="error-message">{validationErrors.selectedSubDivision}</div>}

                    </div>
                    {/* Include other input fields as needed */}
                    <div className="form-actions">
                        <button className="btn save" onClick={handleSave}>Save</button>
                        <button className="btn back" onClick={handleBack}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
