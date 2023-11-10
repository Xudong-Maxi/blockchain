import React, { useState, useEffect } from 'react';
import './SellersList.css'; // Import the CSS file
import './DropDown.css';

const SellersList = () => {
  const [sellers, setSellers] = useState([
    { price: '$10.99', address: '0x0', latestArrival: '2023-10-15T14:30:00' },
    { price: '$12.49', address: '0x1', latestArrival: '2023-10-16T14:30:00' },
    { price: '$9.99', address: '0x2', latestArrival: '2023-10-17T14:30:00' },
    { price: '$9.99', address: '0x2', latestArrival: '2023-10-18T14:30:00' },
  ]);

  const [sortingOption, setSortingOption] = useState('Lowest Price');
  const [sortedSellers, setSortedSellers] = useState([]);

  const sortSellers = (option) => {
    let sorted = [...sellers];

    switch (option) {
      case 'Lowest Price':
        sorted.sort((a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)));
        break;
      case 'Highest Price':
        sorted.sort((a, b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1)));
        break;
      case 'Latest Arrival':
        sorted.sort((a, b) => new Date(b.latestArrival) - new Date(a.latestArrival));
        break;
      default:
        break;
    }

    setSortedSellers(sorted);
    setSortingOption(option);
  };

  const formatLatestArrival = (timestamp) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    // Initially, sort the sellers by the lowest price
    sortSellers('Lowest Price');
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  return (
    <div className="sellers-container">
      <div className="sort-options">
        <label>Sort by:</label>
        <select onChange={(e) => sortSellers(e.target.value)}>
          <option value="Lowest Price">Lowest Price</option>
          <option value="Highest Price">Highest Price</option>
          <option value="Latest Arrival">Latest Arrival</option>
        </select>
      </div>
      <h2 className="sellers-heading">Available Sellers</h2>
      <div className="sellers-list">
        {sortedSellers.map((seller, index) => (
          <div key={index} className="seller-card">
            <div className="seller-info">
              <p className="seller-price">{seller.price}</p>
              <p className="seller-address">{seller.address}</p>
              <p className="seller-latest-arrival">
                Latest Arrival: {formatLatestArrival(seller.latestArrival)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersList;
