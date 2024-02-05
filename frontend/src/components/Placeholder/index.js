import Button from "../Button";
import "./placeholder.css"
import { FaWallet } from "react-icons/fa6";
import { useContext } from "react";
import { ConnectionContext } from "../../context/ConnectionContext";
import { message } from "antd";

const Placeholder = () => {
    const connecttionContext = useContext(ConnectionContext);
    const onClick = ()=>{
        connecttionContext.connectWallet();
        if(connecttionContext.connected){
            message.success("Wallet Connected");
        }else{
            message.error("Wallet not Connected")
        }
        
    }
    return ( 
        <div className="fullscreen">
                <h1>
                    Connect your Wallet to Access Lottery Application.
                </h1>
                <div>
                    <Button onClick = {onClick} icon={<FaWallet />}>
                        Connect Wallet
                    </Button>
                </div>
        </div>
     );
}
 
export default Placeholder;