import React, { useState, useEffect } from 'react';
import './SellersList.css';

const SellersList = ({ contract, id }) => {
  const [sellers, setSellers] = useState([]);

  const get_card_list = async () => {
    const selling_card_list = await contract.methods.see_sale_card_list(id).call();
    return selling_card_list.map((data) => data);
  };

  useEffect(() => {

    const fetchCardList = async () => {
      try {
        const userList = await get_card_list();
        setSellers(userList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCardList();
  }, [contract, id]); 

  return (
    <div className="sellers-container">
      <h2 className="sellers-heading">Available Sellers</h2>
      <div className="sellers-list">
        {sellers.map((seller, index) => (
          <div key={index} className="seller-card">
            <div className="seller-info">
              <p className="seller-price">{seller[2]}</p> 
              <p className="seller-address">{seller[0]}</p> 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersList;