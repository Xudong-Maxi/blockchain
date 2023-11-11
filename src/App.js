import {Routes, Route, Switch, Router} from "react-router-dom";
import {useNavigate, useLocation} from "react-router-dom";
import {useState} from 'react';
import {ethers} from 'ethers';
import Web3 from "web3";

import './App.css';
import Login from "./pages/login/login";
import Profile from "./components/profile/profile";
import Storage from "./components/storage/storage";
import History from "./components/history/history";
import Types from "./pages/Types";
import Cards from "./pages/Cards";
import Card from "./pages/Card";
import Inventory from "./pages/Inventory";
import Selling from "./pages/Selling";

import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contracts/config";

import GlobalContext from "./providers/GlobalContext";
import { defaultGlobal } from "./providers/dataGlobal";
import Header from "./components/Header";

export default function App() {
    const [haveMetamask, setHaveMetamask] = useState(true);     // check if the browser has MetaMask installed. 
    const [address, setAddress] = useState(null);               // address of connected MetaMask account. 
    const [network, setNetwork] = useState(null);               // network the account is using. 
    const [balance, setBalance] = useState(0);                  // balance of connected MetaMask account. 
    const [isConnected, setIsConnected] = useState(false);      // check if is connected to MetaMask account. 

    const [storedPending, setStoredPending] = useState(false);        // check if a value is pending. 
    const [storedDone, setStoredDone] = useState(false);        // check if a value is stored. 
    const [storedVal, setStoredVal] = useState(0);              // value that is stored right now. 
    const [showVal, setShowVal] = useState(0);                  // value that is showed on screen. 

    const [historyRecord, setHistoryRecord] = useState(null);   // record of history operations. 
    const [recordLen, setRecordLen] = useState(0);              // length of record. 
    const maxRecordLen = 50;                                    // maximum length of record list. 

    const navigate = useNavigate();
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3 = new Web3(Web3.givenProvider || "https://localhost:8545");
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    // Pokemon set global data
    const [dataGlobal, setDataGlobal] = useState(defaultGlobal);
    const setData = (data) => {  // set function of updating global data
        setDataGlobal({ ...dataGlobal, ...data });
    };

    const location = useLocation();
    const shouldShowHeader = (location.pathname !== '/blockchain/') && (location.pathname !== '/blockchain');  // don't show header in login page


////// connect to MetaMask. 
    const connectWallet = async () => {         // function that connect to METAMASK account, activated when clicking on 'connect'. 
        try {
            if (!ethereum){
                setHaveMetamask(false);
            }
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            const chainId = await ethereum.request({
                method: 'eth_chainId',
            });

            let balanceVal = await provider.getBalance(accounts[0]);
            let bal = ethers.utils.formatEther(balanceVal);

            console.log(chainId);
            if (chainId === '0x3'){
                setNetwork('Ropsten Test Network');
            }
            else if (chainId === '0x5'){
                setNetwork('Goerli Test Network');
            }
            else if (chainId === '0xaa36a7'){
                setNetwork('Sepolia Test Network');
            }
            else {
                setNetwork('Other Test Network');
            }
            setAddress(accounts[0]);
            setBalance(bal);
            setIsConnected(true);
            
            const new_indicator = await contract.methods.check_new_user(accounts[0]).call();
            if(new_indicator == 0){
                alert('We are creating your account.\nPlease click OK and confirm on your metamask.\nIt may take several seconds.');
                await contract.methods.addUser().send({from: accounts[0]});
            }

            const userdata = await contract.methods.getUserData(accounts[0]).call();
            console.log(userdata[1][0][0]);


            navigate('/blockchain/Types');
        }
        catch (error){
            setIsConnected(false);
        }
    }


////// Contract Deployment. 
    // IMPORTANT: async / await is essential to get values instead of Promise. 
    const storeData = async (inputVal) => {
        const res = await contract.methods.set(inputVal).send({from: address});
        return res;
    }

    const getData = async () => {
        const res = await contract.methods.get().call();
        return res;
    }


////// history recording. 
    const RecordOverFlow = () => {
        if (recordLen > maxRecordLen){
            let outlierNum = recordLen - maxRecordLen;
            setHistoryRecord(current => current.splice(1, outlierNum));
            setRecordLen(maxRecordLen);
        }
    }

    const RecordPush = (opr, val, detail) => {
        let stat = 1;
        let cost = 0;
        if (val.length === 0){
            val = 'NA';
            cost = 'NA';
            stat = 0;
        }
        else{
            if (opr === 'get'){
                cost = 0;
                stat = 1;
            }
            else{
                if (detail === 'null'){
                    setStoredPending(false);
                    setStoredDone(true);
                    console.log('Rejected');
                    cost = 'NA';
                    stat = 2;
                }
                else{
                    setStoredDone(true);
                    console.log('Done');
                    console.log(detail);    // show the details of transaction. 
                    cost = detail.gasUsed;
                    stat = 1;
                }
            }
        }

        const newRecord = {
            id: recordLen + 1, 
            address: address, 
            operation: opr, 
            value: val, 
            cost: cost, 
            status: stat
        };
        if (recordLen === 0){
            setHistoryRecord([newRecord, newRecord]);
        }
        else{
            setHistoryRecord(current => [...current, newRecord]);
        }
        setRecordLen(recordLen + 1);

        if (recordLen > maxRecordLen){
            RecordOverFlow();
        }
    }


////// store and get value. 
    const storedValUpdate = async () => {
        const inputVal = document.getElementById('inputVal').value;
        setStoredPending(false);
        setStoredDone(false);

        if (inputVal.length === 0) {
            const detail = 'null';
            RecordPush('store', inputVal, detail);
        }
        else {
            setStoredPending(true);
            setStoredVal(inputVal);
            
            try{
                const detail = await storeData(inputVal);   // contract deployed. 
                RecordPush('store', inputVal, detail);      // recorded. 
            }
            catch(err){
                const detail = 'null';                      // no detail info. 
                RecordPush('store', inputVal, detail);      // recorded. 
            }
        }
    }

    const showValUpdate = async () => {
        const ans = await getData();
        setStoredPending(false);
        setStoredDone(false);

        setShowVal(ans);
        RecordPush('get', ans);
    }


////// display functions. 
    const ProfileDisplay = () => {
        return (
            <Profile 
                isConnected = {isConnected}
                address = {address} 
                networkType = {network} 
                balance = {balance}
            />
        )
    }

    const StorageDisplay = () => {
        return (
            <Storage 
                isConnected = {isConnected}
                storeValHandle = {storedValUpdate} 
                showValHandle = {showValUpdate} 
                showVal = {showVal} 
                storedPending = {storedPending}
                storedDone = {storedDone}
            />
        )
    }

    const HistoryDisplay = () => {
        return (
            <History 
                isConnected = {isConnected}
                recordList = {historyRecord}
                recordLen = {recordLen}
            />
        )
    }

    // display types page
    const TypesDisplay = () => {
        return (
            <Types/>
        )
    }

    // display cards list cooresponding to types
    const CardsDisplay = () => {
        return (
            <Cards/>
        )
    }

    const CardDisplay = () => {
        return (
            <Card
                address = {address}
                contract = {contract}
            />
        )
    }

    const InventoryDisplay = () => {
        return (
            <Inventory
                address = {address}
                contract = {contract}
            />
        )
    }

    const SellingDisplay = () =>{
        return (
            <Selling
                type = "Fighting"
                address = {address}
                contract = {contract}
            />
        )
    }

    return (
        <div className="App">
            <GlobalContext.Provider value={{ setData, dataGlobal }}>
                {shouldShowHeader && <Header />}
                <Routes>
                    <Route path = "/blockchain" element = {<Login isHaveMetamask = {haveMetamask} connectTo = {connectWallet} />}></Route>
                    <Route path = "/blockchain/Types" element = {<TypesDisplay/>}></Route>
                    <Route path = "/blockchain/Types/:type" element = {<CardsDisplay/>}></Route>
                    <Route path = "/blockchain/Types/:type/:id" element = {<CardDisplay/>}></Route>
                    <Route path = "/blockchain/Home" element = {<InventoryDisplay/>}></Route>
                    <Route path = "/blockchain/Home/:id" element = {<CardDisplay/>}></Route>
                    <Route path = "/blockchain/Home/Selling" element = {<SellingDisplay/>}></Route>
                    <Route path = "/blockchain/Home/Selling/:id" element = {<CardDisplay/>}></Route>
                    {/* <Route path = "/blockchain/Types/Inventory/:type/:id" element = {<CardDisplay/>}></Route>
                    <Route path = "/blockchain/Types/Selling/:type" element = {<SellingDisplay/>}></Route>
                    <Route path = "/blockchain/Types/Selling/:type/:id" element = {<CardDisplay/>}></Route> */}
                    {/* <Route path = "/blockchain/profile" element = {<ProfileDisplay/>}></Route>
                    <Route path = "/blockchain/storage" element = {<StorageDisplay/>}></Route>
                    <Route path = "/blockchain/history" element = {<HistoryDisplay/>}></Route> */}
                </Routes>
            </GlobalContext.Provider>
        </div>
    );
}

