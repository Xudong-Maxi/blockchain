// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract UserDataContract {
    uint public userCount = 0;
    address[] allUserAddresses;
    // struct Sell_list{
    //     address userAddress;
    //     uint card_id;
    // }
    struct Sale_cards{
        uint card;
        uint price;
    }

    struct UserData{           //define user struct info
        address userAddress;
        string username;
        uint[] cards;
        Sale_cards[] sale_cards;
    }

    struct Sale_cards_list{
        address owner_addr;
        string username;
        uint card;
        uint price;
    }

    //create a list to save which cards are on sale and the owner and price
    Sale_cards_list[] public sale_cards_list;
    
    // mapping(address => Sell_list) public sell_list;
    mapping(address => UserData) public users;


    ///function to add a new user
    function addUser(string memory _username) public {
        UserData storage userData = users[msg.sender];
        userData.userAddress = msg.sender;
        userData.username = _username;
        userCount += 1;
        allUserAddresses.push(msg.sender);
    }

    function UserCount() public view returns (uint){
        return userCount;
    }

    ///function to get info of one user
    function getUserData(address _userAddress) public view returns (string memory, uint[] memory, Sale_cards[] memory) {
        UserData storage userData = users[_userAddress];
        return (userData.username, userData.cards, userData.sale_cards);
    }


    ///function to add card into a user's package
    function add_card(address _userAddress, uint card_number) public{       //should change to internal later
        UserData storage userData = users[_userAddress];
        userData.cards.push(card_number);
    }

    ///function to sale card
    //only card holder(msg.sender) can control this function
    function sale_card(uint _card_number, uint _price) public{       //should change to internal later
        UserData storage userData = users[msg.sender];
        for (uint i = 0; i < userData.cards.length; i++) {      //remove card from non-selling list
            if (userData.cards[i] == _card_number){
                userData.cards[i] = userData.cards[userData.cards.length - 1];
                userData.cards.pop();
                Sale_cards memory new_sale_cards = Sale_cards(_card_number, _price);
                userData.sale_cards.push(new_sale_cards);       //add sale_card info into user's selling list
                
                sale_cards_list.push(Sale_cards_list(msg.sender, userData.username, _card_number, _price));     //add sale_card info into system's selling list
                break;
            }
        }
    }

    ///function to abort card selling
    //only card holder(msg.sender) can control this function
    function abort_sale_card(uint _card_number) public{
        UserData storage userData = users[msg.sender];
        for (uint i = 0; i < userData.sale_cards.length; i++) {      //remove card from user's selling list
            if (userData.sale_cards[i].card == _card_number){
                userData.sale_cards[i] = userData.sale_cards[userData.sale_cards.length - 1];
                userData.sale_cards.pop();
                userData.cards.push(_card_number);       //put the card back into non-selling list
                break;
            }
        }
        for (uint m = 0; m < sale_cards_list.length; m++) {     //remove card from system's selling list
            if (sale_cards_list[m].owner_addr == msg.sender && sale_cards_list[m].card == _card_number){
                sale_cards_list[m] = sale_cards_list[sale_cards_list.length -1];
                sale_cards_list.pop();
                break;
            }
        }
    }

    //function to return the price of a specific selling card
    function card_price(uint _card_number, address _owner_address)
        public
        view
        returns (uint)
    {
        for (uint m = 0; m < sale_cards_list.length; m++) {     //remove the card from system's selling list
            if (sale_cards_list[m].owner_addr == _owner_address && sale_cards_list[m].card == _card_number){
                uint data = sale_cards_list[m].price;
                return data;
            } 
        }
        return 0;
    }

    //  function to buy card
    function buy_card(uint _card_number, address _owner_address)
        public
        payable
    {
        uint sale_state = 0;
        for (uint m = 0; m < sale_cards_list.length; m++) {     //remove the card from system's selling list
            if (sale_cards_list[m].owner_addr == _owner_address && sale_cards_list[m].card == _card_number && msg.value == sale_cards_list[m].price){
                payable(_owner_address).transfer(msg.value);        //transfer the money to seller
                sale_cards_list[m] = sale_cards_list[sale_cards_list.length -1];
                sale_cards_list.pop();
                sale_state = 1;     //indicate the sale success
                break;
            }
            else {
                payable(msg.sender).transfer(address(this).balance);        //if there is something wrong, return the money back to the buyer
            }
        }

        if (sale_state == 1) {
            UserData storage userData = users[_owner_address];
            for (uint i = 0; i < userData.sale_cards.length; i++) {      //remove the card from user's selling list
                if (userData.sale_cards[i].card == _card_number){
                    userData.sale_cards[i] = userData.sale_cards[userData.sale_cards.length - 1];
                    userData.sale_cards.pop();
                    break;
                }
            }
            UserData storage userData1 = users[msg.sender];     //add the card into buyer's account
            userData1.cards.push(_card_number);
        }
    }

    ///function to get info of all users
    function getAllUsers() public view returns (UserData[] memory) {
        uint256 userCount_number = allUserAddresses.length;
        UserData[] memory allUsers = new UserData[](userCount);

        for (uint256 i = 0; i < userCount_number; i++) {
            address userAddress = allUserAddresses[i];
            allUsers[i] = users[userAddress];
        }

        return allUsers;
    }

    /// funtion to see all selling card with the a specific card_id
    function see_sale_card_list(uint _card) public view returns (Sale_cards_list[] memory) {
        uint k = 0; // indicator to show the number of this card is selling
        Sale_cards_list[] memory return_list = new Sale_cards_list[](sale_cards_list.length);

        for (uint i = 0; i < sale_cards_list.length; i++) {
            if (sale_cards_list[i].card == _card) {
                return_list[k] = Sale_cards_list(sale_cards_list[i].owner_addr, sale_cards_list[i].username, sale_cards_list[i].card, sale_cards_list[i].price);
                k = k + 1;
            }
        }

        // Resize the return_list to contain only the relevant elements
        assembly {
            mstore(return_list, k)
        }

        return return_list;
    }
}