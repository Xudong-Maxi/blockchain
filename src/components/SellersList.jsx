import React, { useState, useEffect } from 'react';
import './SellersList.css'; // Import the CSS file
import './DropDown.css';
import PopupBuy from './PopupBuy';

const SellersList = ({ contract, address, id }) => {
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

  const [sortingOption, setSortingOption] = useState('Lowest Price');
  const [sortedSellers, setSortedSellers] = useState([]);


  const sortSellers = (option) => {
    let sorted = [...sellers];

    switch (option) {
      case 'Lowest Price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'Highest Price':
        sorted.sort((a, b) => b.price - a.price);
        break;
    }

    setSortedSellers(sorted);
    setSortingOption(option);
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
        </select>
      </div>
      <h2 className="sellers-heading">Available Sellers</h2>
      <div className="sellers-list">
        {sortedSellers.map((seller, index) => (
          <div key={index} className="seller-card">
            <div className="seller-info">
              <p className="seller-price">{seller[2] + " ETH"}</p> 
              <p className="seller-address">{seller[0]}</p> 
              <PopupBuy
                contract={contract}
                address={address}
                id={id}
                price={seller[2]}
                ownerAddress={seller[0]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersList;