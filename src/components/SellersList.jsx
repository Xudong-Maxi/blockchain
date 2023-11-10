import React from 'react';
import './SellersList.css'; // Import the CSS file

const SellersList = () => {
  const sellers = [
    { name: 'Seller 1', price: '$10.99', address: '0x0' },
    { name: 'Seller 2', price: '$12.49', address: '0x1' },
    { name: 'Seller 3', price: '$9.99', address: '0x2' },
    { name: 'Seller 4', price: '$9.99', address: '0x2' },
  ];

  return (
    <div className="sellers-container">
      <h2 className="sellers-heading">Available Sellers</h2>
      <div className="sellers-list">
        {sellers.map((seller, index) => (
          <div key={index} className="seller-card">
            <div className="seller-info">
              <p className="seller-name">{seller.name}</p>
              <p className="seller-price">{seller.price}</p>
              <p className="seller-address">{seller.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersList;
