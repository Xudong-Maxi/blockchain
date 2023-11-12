// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract UserDataContract {
    uint public userCount = 0;
    address[] allUserAddresses;

    struct Sale_cards{
        string card;
        uint price;
    }

    struct UserData{           //define user struct info
        address userAddress;
        string[] cards;
        Sale_cards[] sale_cards;
    }

    struct Sale_cards_list{
        address owner_addr;
        string card;
        uint price;
    }

    //create a list to save which cards are on sale and the owner and price
    Sale_cards_list[] public sale_cards_list;
    
    // mapping(address => Sell_list) public sell_list;
    mapping(address => UserData) public users;

    //check if the user have an account in our website
    function check_new_user(address _userAddr) public view returns (uint){
        for(uint i=0; i<allUserAddresses.length; i++){
            if (allUserAddresses[i] == _userAddr){
                return 1;
            }
        }
        return 0;
    }

    ///function to add a new user
    function addUser() public {

        UserData storage userData = users[msg.sender];
        userData.userAddress = msg.sender;
        userCount += 1;
        allUserAddresses.push(msg.sender);
    }

    function UserCount() public view returns (uint){
        return userCount;
    }

    ///function to get info of one user
    function getUserData(address _userAddress) public view returns (string[] memory, Sale_cards[] memory) {
        UserData storage userData = users[_userAddress];
        return (userData.cards, userData.sale_cards);
    }



    ///function to add card into a user's package
    function add_card(address _userAddress, string memory _card_number) public{       //should change to internal later
        UserData storage userData = users[_userAddress];
        userData.cards.push(_card_number);
    }

    function add_many_cards(address _userAddress, string[] memory _card_number) public{       //should change to internal later
        UserData storage userData = users[_userAddress];
        for(uint i = 0; i < _card_number.length; i++){
            userData.cards.push(_card_number[i]);
        }
    }

    ///function to sale card
    //only card holder(msg.sender) can control this function
    function sale_card(string memory _card_number, uint _price) public{       //should change to internal later
        UserData storage userData = users[msg.sender];
        for (uint i = 0; i < userData.cards.length; i++) {      //remove card from non-selling list
            if (keccak256(abi.encodePacked(userData.cards[i])) == keccak256(abi.encodePacked(_card_number))){   //compare hash of 2 strings
                userData.cards[i] = userData.cards[userData.cards.length - 1];
                userData.cards.pop();
                Sale_cards memory new_sale_cards = Sale_cards(_card_number, _price);
                userData.sale_cards.push(new_sale_cards);       //add sale_card info into user's selling list
                
                sale_cards_list.push(Sale_cards_list(msg.sender, _card_number, _price));     //add sale_card info into system's selling list
                break;
            }
        }
    }

    ///function to abort card selling
    //only card holder(msg.sender) can control this function
    function abort_sale_card(string memory _card_number, uint _card_price) public{
        UserData storage userData = users[msg.sender];
        for (uint i = 0; i < userData.sale_cards.length; i++) {      //remove card from user's selling list
            if (keccak256(abi.encodePacked(userData.sale_cards[i].card)) == keccak256(abi.encodePacked(_card_number)) && userData.sale_cards[i].price ==_card_price){
                userData.sale_cards[i] = userData.sale_cards[userData.sale_cards.length - 1];
                userData.sale_cards.pop();
                userData.cards.push(_card_number);       //put the card back into non-selling list
                break;
            }
        }
        for (uint m = 0; m < sale_cards_list.length; m++) {     //remove card from system's selling list
            if (sale_cards_list[m].owner_addr == msg.sender && keccak256(abi.encodePacked(sale_cards_list[m].card)) == keccak256(abi.encodePacked(_card_number)) && sale_cards_list[m].price == _card_price){
                sale_cards_list[m] = sale_cards_list[sale_cards_list.length -1];
                sale_cards_list.pop();
                break;
            }
        }
    }

    //function to return the price of a specific selling card
    function card_price(string memory _card_number, address _owner_address)
        public
        view
        returns (uint)
    {
        for (uint m = 0; m < sale_cards_list.length; m++) {     //remove the card from system's selling list
            if (sale_cards_list[m].owner_addr == _owner_address && keccak256(abi.encodePacked(sale_cards_list[m].card)) == keccak256(abi.encodePacked(_card_number))){
                uint data = sale_cards_list[m].price;
                return data;
            } 
        }
        return 0;
    }

    //  function to buy card
    function buy_card(string memory _card_number, address _owner_address, uint _card_price)
        public
        payable
    {
        require(msg.sender != _owner_address, "Seller cannot be the buyer");
        uint sale_state = 0;
        for (uint m = 0; m < sale_cards_list.length; m++) {     //remove the card from system's selling list
            if (sale_cards_list[m].owner_addr == _owner_address && keccak256(abi.encodePacked(sale_cards_list[m].card)) == keccak256(abi.encodePacked(_card_number)) && msg.value == sale_cards_list[m].price && sale_cards_list[m].price == _card_price){
                payable(_owner_address).transfer(msg.value);        //transfer the money to seller
                sale_cards_list[m] = sale_cards_list[sale_cards_list.length -1];
                sale_cards_list.pop();
                sale_state = 1;     //indicate the sale success
                break;
            }
        }
        if (sale_state == 0){
            payable(msg.sender).transfer(address(this).balance);        //if there is something wrong, return the money back to the buyer
        }

        if (sale_state == 1) {
            UserData storage userData = users[_owner_address];
            for (uint i = 0; i < userData.sale_cards.length; i++) {      //remove the card from user's selling list
                if (keccak256(abi.encodePacked(userData.sale_cards[i].card)) == keccak256(abi.encodePacked(_card_number)) && userData.sale_cards[i].price == _card_price){
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
    function see_sale_card_list(string memory _card) public view returns (Sale_cards_list[] memory) {
        uint k = 0; // indicator to show the number of this card is selling
        Sale_cards_list[] memory return_list = new Sale_cards_list[](sale_cards_list.length);

        for (uint i = 0; i < sale_cards_list.length; i++) {
            if (keccak256(abi.encodePacked(sale_cards_list[i].card)) == keccak256(abi.encodePacked(_card))){
                return_list[k] = Sale_cards_list(sale_cards_list[i].owner_addr, sale_cards_list[i].card, sale_cards_list[i].price);
                k = k + 1;
            }
        }
        // Resize the return_list to contain only the relevant elements
        assembly {
            mstore(return_list, k)
        }

        return return_list;
    }

    function delete_user(address _userAddr) 
        public
    {
        delete users[_userAddr];    //delete the user data struct
        for (uint i=0; i<allUserAddresses.length; i++){     // delete the user address in address list
            if(allUserAddresses[i] == _userAddr){
                allUserAddresses[i] = allUserAddresses[allUserAddresses.length - 1];
                allUserAddresses.pop();
            }
        }  
        for (uint m=0; m<sale_cards_list.length; m++){
            if(sale_cards_list[m].owner_addr == _userAddr){
                sale_cards_list[m] = sale_cards_list[sale_cards_list.length - 1];
                sale_cards_list.pop();
            }
        }
        userCount -= 1;
    }

    function clean_all_data() public{
        for (uint i=0; i<allUserAddresses.length; i++){
            delete users[allUserAddresses[i]];
        }
        delete sale_cards_list;
        userCount = 0;
        allUserAddresses = new address[](0);
    }
}