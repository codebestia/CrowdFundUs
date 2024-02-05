import "./nav.css"
import Button from "../Button";
import { useEffect, useContext, useState } from "react";
import { ConnectionContext } from "../../context/ConnectionContext";
import { FaWallet } from "react-icons/fa6";
import contract from "../../contractInteractor";
import { NavLink } from "react-router-dom";
const Layout = ({children}) => {
    const connectionConnection = useContext(ConnectionContext);
    const [isOwner,setIsOwner] = useState(false);
    const connnectButtonClick = ()=>{
        if(!connectionConnection.connected){
            connectionConnection.connectWallet();
        }
    }
    const sliceAddress = (address)=>{
        return address.slice(0,5)+"....."+address.slice(37,42);
    }
    const methodCall = async ()=>{
        const owner = await contract.methods.owner().call();
        if(owner === connectionConnection.connectionAddress){
            setIsOwner(true);
        }
    }
    useEffect(()=>{
        methodCall();
    })
    return ( 
    <div>
        <nav className="nav">
            <div>
                <h1 ><NavLink className="nav-header" to={"/"}>CrowdFundUs</NavLink></h1>
            </div>
            <div style={{display:"flex",alignItems:"center"}}>
                {isOwner && (
                    <NavLink to={"/admin"} className={"nav-link"}>Admin</NavLink>
                )}
                <Button icon={<FaWallet />} onClick={connnectButtonClick}>
                    {!connectionConnection.connected?(
                        "Connect Wallet"
                    ):(
                        sliceAddress(connectionConnection.connectionAddress)
                    )}
                    
                </Button>
            </div>
        </nav>
        <div className="content">
            {children}
        </div>
    </div> );
}
 
export default Layout;