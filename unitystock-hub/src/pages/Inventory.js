import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useParams } from 'react-router-dom';
import '../css/Inventory.css';
import config from '../common/config';
import axios from 'axios';
import { useAuth } from '../pages/auth/AuthContext'; // Adjust the path as necessary
const InventoryPage = () => {
    const [items, setItems] = useState([]);
    const [headers] = useState(['Name', 'Quantity', 'Expiry Date', 'Manufacture', 'Supplier', 'Updated By', 'Update Time']);
    const [filters, setFilters] = useState({ name: '', manufacture: '', supplier: '' });
    let navigate = useNavigate();
    const { subId } = useParams();
    const { user } = useAuth(); // Access global user data
    const DESIRED_HEADERS = {
        'Id': 'ID',
        'Name': 'Name',
        'Quantity': 'Quantity',
        'ExpiryDate': 'Expiry Date',
        'Manufacture': 'Manufacture',
        'Supplier': 'Supplier',
        'LastUpdatedBy': 'Updated By',
        'LastUpdateTimestamp': 'Update Time'
    };
    useEffect(() => {
        // Fetch items when the component is mounted
       
        if(subId){
        fetchInventoryBySub(subId);
        }
        else
        fetchItems();
    }, [subId]);

    const fetchItems = async () => {
        try {
            debugger
          // Include the DivisionId as a query parameter
          const response = await axios.get(`${config.server.baseUrl}/inventory?divisionId=${user.DivisionID}`);
          const { data, success } = response.data;
          if (success && Array.isArray(data) && data.length > 1) {
            const apiHeaders = data[0];
            const rows = data.slice(1);
      
            const itemsArray = rows.map(row => {
              let item = {};
              apiHeaders.forEach((header, index) => {
                const desiredKey = DESIRED_HEADERS[header];
                if (desiredKey) {
                  item[desiredKey] = row[index];
                }
              });
              return item;
            });
      
            setItems(itemsArray);
          } else {
            console.error('Invalid data format:', response.data);
            setItems([]);
          }
        } catch (error) {
          console.error('Error fetching inventory data:', error);
          setItems([]);
        }
      };
      
    const fetchInventoryBySub = async (subId) => {
        try {
            const response = await axios.get(`${config.server.baseUrl}/get-invertorybySub/${subId}`);
            const { headers, rows } = response.data.data;
            const itemsArray = rows.map(row => {
                let item = {};
                headers.forEach((header, index) => {
                  const key = DESIRED_HEADERS[header] || header; // Use the header as key if not found in DESIRED_HEADERS
                  item[key] = row[index];
                });
                return item;
              });
              
              setItems(itemsArray);
        } catch (error) {
            console.error('Error fetching divisions:', error);
        }
    };
    const handleEdit = (id) => {
        if(subId){
        navigate(`/unitystockhub/AddInventories/edit/${subId}/${id}`)
        }
        else{
            navigate(`/unitystockhub/AddInventories/edit/${id}`)
        }
    };
    const handleDelete = (id) => {
        // Logic to handle deleting an item with the specified ID
        console.log('Deleting item with ID:', id);
        // Perform deletion action, such as making an API call to delete the item
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${config.server.baseUrl}/inventory/search`, { params: filters });
            const { data, success } = response.data;
            if (success && Array.isArray(data) && data.length > 0) {
                const itemsArray = data.map(row => {
                    let item = {};
                    headers.forEach((header, index) => {
                        // Note: Adjust index based on actual data structure if needed
                        const apiHeader = Object.keys(DESIRED_HEADERS).find(key => DESIRED_HEADERS[key] === header);
                        item[header] = row[apiHeader];
                    });
                    return item;
                });

                setItems(itemsArray);
            }
        } catch (error) {
            console.error('Error searching inventory:', error);
        }
    };

    return (
        <div className="inventory-page">
            <h2 className='section-heading'>Inventories</h2>
           {user.RoleId !== 2 && (
            <span className="add-division-button">
            <Link to={subId ? `/unitystockhub/AddInventories/add/${subId}` : "/unitystockhub/AddInventories/add"} className="btn">Add Inventory</Link>
            </span>
           )}
            <div className="filter-section">
                <input type="text" name="name" value={filters.dining} onChange={handleFilterChange} placeholder="Name" />
                <input type="text" name="manufacture" value={filters.manufacture} onChange={handleFilterChange} placeholder="Manufacture" />
                <input type="text" name="supplier" value={filters.quantity} onChange={handleFilterChange} placeholder="Supplier" />
                <button className='btn' onClick={handleSearch}>Search</button>
            </div>
            <div className="inventory-list-container">
                <table className="inventory-list">
                    <thead>
                        <tr>
                            {headers.map(header => (
                                <th key={header}>{header}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header) => {
                                    if (header !== 'ID') {  // Assuming you do not include 'ID' in your headers array
                                        return <td key={header}>{item[header]}</td>;
                                    }
                                    return null;  // Do not render anything for 'ID'
                                })}
                                <td className="action-buttons">
                                    <button className="btn" onClick={() => handleEdit(item.ID)}>Edit</button>
                                    {user.RoleId !== 2 && (
                                    <button className="btn" onClick={() => handleDelete(item.ID)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryPage;
