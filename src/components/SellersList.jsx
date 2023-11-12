import React, { useState, useEffect } from 'react';
import './SellersList.css'; // Import the CSS file
import './DropDown.css';
import PopupBuy from './PopupBuy';
import H3 from './H3.jsx';

const SellersList = ({ contract, address, id , pathname}) => {
  const [sellers, setSellers] = useState([]);
  const [sortingOption, setSortingOption] = useState('Lowest Price');
  const [sortedSellers, setSortedSellers] = useState([]);

  const getCardList = async () => {
    try {
      const sellingCardList = await contract.methods.see_sale_card_list(id).call();
      return sellingCardList.map((data) => data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const sortSellers = (option, data) => {
    let sorted = [...data];

    switch (option) {
      case 'Lowest Price':
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'Highest Price':
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        break;
    }

    return sorted;
  };

  useEffect(() => {
    const fetchData = async () => {
      const userList = await getCardList();
      setSellers(userList);
    };

    fetchData();
  }, [contract, id]);

  useEffect(() => {
    const sorted = sortSellers(sortingOption, sellers);
    setSortedSellers(sorted);
  }, [sortingOption, sellers]);

  return (
    <div className="sellers-container">
      <div className="sort-options">
        <h3>
        <label><b>Sort by : </b></label>
        <select onChange={(e) => setSortingOption(e.target.value)}>
          <option value="Lowest Price">Lowest Price</option>
          <option value="Highest Price">Highest Price</option>
        </select>
        </h3>
      </div>
      <h2 className="sellers-heading">Available Sellers</h2>
      <div className="sellers-list">
        {sortedSellers.map((seller, index) => (
          <div key={index} className="seller-card">
            <div className="seller-info">
              <p className="seller-price">{seller[2] + " Wei"}</p> 
              <p className="seller-address">{seller[0]}</p> 
              <PopupBuy
                contract={contract}
                address={address}
                id={id}
                price={seller[2]}
                ownerAddress={seller[0]}
                pathname = {pathname}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersList;