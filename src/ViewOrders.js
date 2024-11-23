import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewOrders.css'; // Import CSS file for custom styles

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState(''); // State for displaying messages

  const [newStatus, setNewStatus] = useState(""); // Added state for new status
  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/admin/orders');
        console.log("Fetched Orders:", response.data); // Check if userName is included
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  const handleUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);  // Set the current status as the default in the dropdown
    setShowUpdateModal(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const updateOrderStatus = async () => {
    try {
      const response = await axios.put(`http://localhost:8001/api/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setShowUpdateModal(false);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const deleteOrder = async () => {
    console.log("Selected Order to Delete:", selectedOrder);
  
    if (!selectedOrder || !selectedOrder.id) {
      console.log("Invalid Order ID");
      setMessage("Order ID is invalid.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8001/api/admin/orders/${selectedOrder.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'userId': localStorage.getItem('userId'),
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Order deleted successfully:", data);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== selectedOrder.id));
        setShowDeleteModal(false);
        setMessage("Order deleted successfully.");
      } else {
        setMessage(`Failed to delete order. ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setMessage(`Failed to delete order. ${error.message}`);
    }
  }; 

  return (
    <div className="orders-container">
      <h2>Orders Management</h2>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer Id</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id || 'No Name'}</td> 
                <td>{order.status}</td>
                <td className="actions-column">
                  <button onClick={() => handleUpdate(order)} className="update-button">Update</button>
                  <button onClick={() => handleDelete(order)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Confirmation Modal */}
      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Order Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)} // Handle the status change
              className="status-dropdown"
            >
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="In transit">In transit</option>
              <option value="Accepted">Accepted</option>
              <option value="Picked up">Picked up</option>
              <option value="Pending acceptance">Pending acceptance</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={updateOrderStatus} className="confirm-button-blue">Yes, Update</button>
            <button onClick={() => setShowUpdateModal(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this order?</h3>
            <button onClick={deleteOrder} className="confirm-button-red">Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewOrders;
