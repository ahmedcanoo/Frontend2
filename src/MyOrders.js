import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyOrders.css';  

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Initialize orders as an empty array
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8001/api/orders`, {
        method: 'GET',
        headers: {
          'userId': userId,
        },
      })
        .then(response => response.json())
        .then(data => {
          setOrders(data || []); // Ensure data is an array, default to empty array if null
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
        });
    } else {
      console.error('UserID is not available');
    }
  }, [userId]);

  return (
    <div className="orders-container">
      <h2 className="heading">My Orders</h2>
      <ul className="orders-list">
        {orders.length > 0 ? (
          orders.map(order => (
            <li key={order._id} className="order-card">
              <div className="order-details">
                <p className="order-info"><strong>Pickup Location:</strong> {order.pickupLocation}</p>
                <p className="order-info"><strong>Drop-off Location:</strong> {order.dropOffLocation}</p>
                <p className="order-info"><strong>Status:</strong> {order.status}</p>
              </div>
              <Link to={`/order-details/${order.id}`} className="view-details-button">View Details</Link>
            </li>
          ))
        ) : (
          <p>No orders available.</p> 
        )}
      </ul>
    </div>
  );
};

export default MyOrders;
