import React, { useState } from 'react';

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropOffLocation: '',
    packageDetails: '',
    deliveryTime: '',
    status: 'Pending',
  });

  const [message, setMessage] = useState('');
  const userId = localStorage.getItem("userId");

  console.log("userId from localStorage:", userId);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("UserID is not available. Please log in.");
      console.error("Error: UserID is missing from localStorage.");
      return;
    }

    fetch("http://localhost:8001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "userId": userId,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error(`Error ${response.status}: ${text}`);
            if (response.status === 400) {
              setMessage("Bad Request - Please check your input.");
            } else if (response.status === 401) {
              setMessage("Unauthorized - Invalid user.");
            } else if (response.status === 500) {
              setMessage("Server error - Please try again later.");
            } else {
              setMessage(`An error occurred. Status: ${response.status}`);
            }
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Order created successfully!");
        setFormData({
          pickupLocation: "",
          dropOffLocation: "",
          packageDetails: "",
          deliveryTime: "",
          status: "Pending",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again.");
      });
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.header}>Create Order</h2> 
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label>Pickup Location:</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Drop-off Location:</label>
          <input
            type="text"
            name="dropOffLocation"
            value={formData.dropOffLocation}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Package Details:</label>
          <textarea
            name="packageDetails"
            value={formData.packageDetails}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Delivery Date and Time:</label>
          <input
            type="datetime-local"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled
            style={styles.input}
          />
        </div>
        <button style={styles.button} type="submit">Create Order</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  page: {
    padding: '20px',
    textAlign: 'left', 
  },
  header: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    height: '150px',  
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1864bc',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
    width: '100%',  
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#1864bc', 
  },
};

export default CreateOrder;
