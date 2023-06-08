import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer">
      <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit'}}>Home</Link>
    </div>
  );
};

export default Footer;
