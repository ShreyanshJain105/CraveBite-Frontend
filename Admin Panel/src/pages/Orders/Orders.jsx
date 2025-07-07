import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   
   const fetchOrders = async () => {
      try {
         setLoading(true);
         setError(null);
         
         const token = localStorage.getItem('token');
         const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
         
         const response = await axios.get('http://localhost:8080/api/orders/all', { headers });
         
         let ordersArray = [];
         
         if (Array.isArray(response.data)) {
            ordersArray = response.data;
         } else {
            ordersArray = [];
         }
         
         setData(ordersArray);
         
      } catch (error) {
         console.error('Error fetching orders:', error);
         setError(error.response?.data?.message || error.message || 'Failed to fetch orders');
      } finally {
         setLoading(false);
      }
   }
   
   const updateStatus = async (event, orderId) => {
      try {
         const token = localStorage.getItem('token');
         const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
         
         await axios.patch(
            `http://localhost:8080/api/orders/status/${orderId}?status=${event.target.value}`,
            null,
            { headers }
         );
         
         await fetchOrders();
      } catch (error) {
         console.error('Error updating status:', error);
         alert('Failed to update status: ' + (error.response?.data?.message || error.message));
      }
   }
   
   useEffect(() => {
      fetchOrders();
   }, [])
   
   if (loading) {
      return (
         <div className="container">
            <div className="py-5 row justify-content-center">
               <div className="col-11 card">
                  <div className="card-body text-center">
                     <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                     </div>
                     <p className="mt-2">Loading orders...</p>
                  </div>
               </div>
            </div>
         </div>
      );
   }
   
   if (error) {
      return (
         <div className="container">
            <div className="py-5 row justify-content-center">
               <div className="col-11 card">
                  <div className="card-body text-center">
                     <div className="alert alert-danger">
                        <h5>Error Loading Orders</h5>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={fetchOrders}>
                           Try Again
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
   
   return (
      <div className="container">
         <div className="py-5 row justify-content-center">
            <div className="col-11 card">
               <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Orders ({data.length})</h5>
                  <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders}>
                     Refresh
                  </button>
               </div>
               <table className="table table-responsive">
                  <tbody>
                     {data.length > 0 ? data.map((order, index) => (
                        <tr key={order.id || index}>
                           <td>
                              <img src={assets.parcel} alt="order" height={48} width={48} />
                           </td>
                           <td>
                              <div>
                                 {order.orderedItems?.map((item, itemIndex) => (
                                    <span key={itemIndex}>
                                       {item.name} x {item.quantity}
                                       {itemIndex < order.orderedItems.length - 1 ? ', ' : ''}
                                    </span>
                                 ))}
                              </div>
                              <div>
                                 {order.userAddress}
                              </div>
                           </td>
                           <td>&#x20B9; {order.amount?.toFixed(2)}</td>
                           <td>Items: {order.orderedItems?.length || 0}</td>
                           <td>
                              <select 
                                 className='form-control' 
                                 onChange={(event) => updateStatus(event, order.id)} 
                                 value={order.orderStatus || 'PENDING'}
                              >
                                 <option value='PENDING'>PENDING</option>
                                 <option value='SHIPPED'>SHIPPED</option>
                                 <option value='DELIVERED'>DELIVERED</option>
                                 <option value='CANCELLED'>CANCELLED</option>
                              </select>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan="5" className="text-center py-4">
                              <div className="text-muted">
                                 <h6>No orders found</h6>
                                 <button className="btn btn-link btn-sm" onClick={fetchOrders}>
                                    🔄 Refresh
                                 </button>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

export default Orders;
