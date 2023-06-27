import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";

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
  
  return (
    <div className="footer">
      <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit'}}>Home</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Footer;
