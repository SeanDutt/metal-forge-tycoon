import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";
import './footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      // Logout successful, perform any additional actions if needed
    } catch (error) {
      // Handle any errors that occur during logout
      console.error('Error logging out:', error);
    }
  };

  const handleHome = () => {
    navigate("/")
  }
  
  return (
    <div className="footer">
      <button onClick={handleHome} >Home</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Footer;
