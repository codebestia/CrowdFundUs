import { createContext, useEffect,useState } from "react";
import {Web3} from "web3";
import {message} from "antd";
import abi from "../abi.json";

export const ConnectionContext = createContext({
    connected: false,
    connectionAddress: null,
    connectWallet: ()=>{},
    disconnectWallet: ()=>{},
    walletContract: null,
    web3: new Web3(),

});

const ConnectionContextProvider = ({children}) => {
     const [connected, setConnected] = useState(false);
     const [connectionAddress, setConnectionAddress] = useState(null);
     const [web3, setWeb3] = useState(null);
     const [walletContract, setWalletContract] = useState(null);
     
    const connectWallet = async ()=>{
        if (window.ethereum) {
            try{
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3initial = new Web3(window.ethereum);
            
            const accounts = await web3initial.eth.getAccounts();
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setConnected(true);
            setConnectionAddress(accounts[0]);
            setWeb3(web3initial);
            let walletContractInitial = new web3initial.eth.Contract(abi.abi, abi.contract);
            setWalletContract(walletContractInitial);
            
            sessionStorage.setItem('wallet_address',accounts[0]);
            loadEvents();
            }catch(e){
                message.error("Unable to Connect to network")
            }
            
        }else{
            alert("Download Metamask Wallet");
        }
    }
    
    const disconnectWallet = async ()=>{
        await window.ethereum._metamask.clearCachedAppKey();
        sessionStorage.removeItem('wallet_address');
        handleWalletDisConnection();

    }
    const handleWalletConnection = async ()=>{
        let web3initial = new Web3(window.ethereum)
        const accounts = await web3initial.eth.getAccounts();
        if (accounts.length > 0){
        setConnected(true);
        setConnectionAddress(accounts[0]);
        setWeb3(web3initial);
        }
        
    }
    const handleWalletDisConnection =()=>{
        setConnected(false);
        setConnectionAddress(null);
        setWeb3(new Web3());
    }
    const handleChainChanged = ()=>{
        
    }
    const loadEvents = ()=>{
        window.ethereum.on('connect',handleWalletConnection);
        window.ethereum.on('disconnect',handleWalletDisConnection);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', async () => {
            window.location.reload();
            // handleWalletConnection();
        });
    }
    useEffect(()=>{
        if(window.ethereum){
            connectWallet();
        }
        
    },[])
    return ( 
        <ConnectionContext.Provider value={{
            connected,
            connectionAddress,
            connectWallet,
            disconnectWallet,
            web3,
            walletContract

        }}>
            {children}
        </ConnectionContext.Provider>
     );
}
 
export default ConnectionContextProvider;