import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { Route, Routes } from 'react-router-dom';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import Orders from './pages/Orders/Orders';
 import { ToastContainer } from 'react-toastify';

const App = () => {
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }
  
  return (
    <>
      <div className="d-flex" id="wrapper">
        <Sidebar sidebarVisible={sidebarVisible} />
        <div id="page-content-wrapper">
          <Menubar toggleSidebar={toggleSidebar} />
          <ToastContainer />
          
            <Routes>
              <Route path='/add' element={<AddFood />} />
              <Route path='/list' element={<ListFood />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/' element={<ListFood />} />
            </Routes>
          </div>
        </div>
      
    </>
  );
}

export default App;