import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './formDataDisplay.css';
import './App.css'
export const App = () => {
  const [formData, setFormData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-1s67.onrender.com/api/form/all');
        setFormData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const search = async () => {
      if (searchQuery) {
        try {
          const response = await axios.get('https://backend-1s67.onrender.com/api/form/search', {
            params: { q: searchQuery }
          });
          setFilteredData(response.data);
        } catch (error) {
          setError(error);
        }
      } else {
        setFilteredData(formData);
      }
    };

    search();
  }, [searchQuery]);

  const inputRef = useRef(null);

  const handleButtonClick = () => {
    if (inputRef.current.value === "admin") {
      setVisible(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (id) => {
    if(confirm("Do You Sure Want to Delete")){
    try {
      await axios.delete(`https://backend-1s67.onrender.com/api/form/delete/${id}`);
      setFormData(formData.filter(item => item._id !== id));
      setFilteredData(filteredData.filter(item => item._id !== id));
    } catch (error) {
      setError(error);
    }
  }
  };

  const handleEdit = (data) => {
    if(confirm("Do You Sure Want to Edit")){
    setEditData(data);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`https://backend-1s67.onrender.com/api/form/edit/${editData._id}`, editData);
      setFormData(formData.map(item => (item._id === editData._id ? response.data : item)));
      setFilteredData(filteredData.map(item => (item._id === editData._id ? response.data : item)));
      setEditData(null);
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="business-container">
      {isVisible ? (
        <div className="authentication-section">
          <h2>Authentication</h2>
          <label htmlFor="password">Password</label>
          <input type="password" ref={inputRef} name="password" id="password" />
          <button style={{backgroundColor:"black"}} onClick={handleButtonClick}>Submit</button>
        </div>
      ) : (
        <>
        
          <h2>Database</h2>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <ul className="data-list">
            {filteredData.map((item) => (
              <li key={item._id} className="data-item">
                <div className="data-row">
                  {editData && editData._id === item._id ? (
                    <>
                      <input
                        type="text"
                        name="Company"
                        value={editData.Company}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        name="Fullname"
                        value={editData.Fullname}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        name="Workemail"
                        value={editData.Workemail}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                      />
                      <button style={{backgroundColor:"black"}} onClick={handleEditSave}>Save</button>
                    </>
                  ) : (
                    <>
                      <p><span className="data-label">Company:</span> {item.Company}</p>
                      <p><span className="data-label">Name:</span> {item.Fullname}</p>
                      <p><span className="data-label">Work Email:</span> {item.Workemail}</p>
                      <p><span className="data-label">Description:</span> {item.description}</p>
                      <p><span className="data-label">Phone:</span> {item.phone}</p>
                      <button style={{backgroundColor:"black"}} onClick={() => handleEdit(item)}>Edit</button>
                      <button style={{backgroundColor:"black"}}onClick={() => handleDelete(item._id)}>Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
