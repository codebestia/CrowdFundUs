import { MdAccountBalance } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState, useContext, useEffect } from "react";
import contract, {web3} from "../../contractInteractor";
import { ConnectionContext } from "../../context/ConnectionContext";
import abi from "../../abi.json"
import Button from "../../components/Button";
import Input, { TextArea } from "../../components/Input";
import "./admin.css";
import { message, Spin } from "antd";
import { FaCopy, FaRocket } from "react-icons/fa6";
import { GiPodiumWinner } from "react-icons/gi";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components/Loader";
import NotFound from "../NotFound";


const Admin = () => {

    const [contractBalance, setContractBalance] = useState(0);

    //Input Variable
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectImageUrl, setProjectImageUrl] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [target,setTarget] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    //States
    const [isOwner, setIsOwner] = useState(false);
    const [projects, setProjects] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    const connectionContext = useContext(ConnectionContext);
    
    const gasPrice = 1600000;
    const gasLimit = 3000000;
    
    const sliceAddress = (address)=>{
        return address.slice(0,5)+"....."+address.slice(37,42);
    }
    const copyContract=()=>{
        navigator.clipboard.writeText(abi.contract).then(()=>{
            message.success("Contract Address Copied");
        })
    }
    const getContractBalance = async ()=>{
        const balance = await web3.eth.getBalance(abi.contract);
        const balanceInEther = web3.utils.fromWei(balance,'ether');
        setContractBalance(parseFloat(balanceInEther));
    }
    const getOwner = async ()=>{
        const owner = await contract.methods.owner().call();
        if(owner == connectionContext.connectionAddress){
            setIsOwner(true);
            document.title = "CrowdFundUs | Admin"
        }
    }
    const getProjectAddresses = async ()=>{
        const addresses = await contract.methods.getProjectsAddresses().call();
        addresses.reverse();
        setProjects(addresses);
    }
    const methodsCall = async ()=>{
        getContractBalance();
        await getOwner();
        getProjectAddresses();
        setPageLoading(false);
    
    }
    const resetForm = ()=>{
        setProjectName("");
        setProjectDescription("");
        setProjectImageUrl("");
        setTarget("");
        setMinAmount("");
    }
    const submitForm = async ()=>{
        if(!projectName || !projectDescription || !minAmount || !target){
            message.error("All required fields should be not be empty")
            return
        }
        if(!projectImageUrl){
            setProjectImageUrl("#");
        }
        try{
            setFormLoading(true);
            message.loading({
                content:"Transaction Processing",
                key:"updatable",
                duration: 10
            });
            await connectionContext.walletContract.methods.createProject(
                projectName, projectDescription,projectImageUrl,
                web3.utils.toWei(target,'ether'),web3.utils.toWei(minAmount,'ether')
            ).send({
                from: connectionContext.connectionAddress,
                gasPrice:gasPrice,
                gas: gasLimit
            });
            message.success({
                content:"Project created successfully",
                key:"updatable",
                duration: 1
            });
            resetForm();
            methodsCall();
        }catch(e){
            console.log(e)
            message.error({
                content:"Error occurred with transaction",
                key:"updatable",
                duration: 1
            })
        }
        setFormLoading(false);
    }


    useEffect(()=>{
        methodsCall();
    },[])
    return ( 
        <>
        {pageLoading?(<PageLoader />):(
            <>
            {!isOwner?(
                <NotFound />
            ):(
                <div className="container">
            <div className="metrics" >
        <div style={{width: "50%"}}>
            <div className="activity-block success">
            <div className="media">
                <div className="media-body">
                    <h2 className="font-weight-bold"><span className="">{contractBalance}</span> eth</h2>
                    <p>Contract Balance</p>
                </div>
                <span ><MdAccountBalance /></span>
            </div>
            <div className="row">
                <div className="progress ">
                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                </div>
            </div>
            <span className="bg-icon"><MdAccountBalance /></span>
            </div>
        </div>
        <div style={{width: "50%"}}>
        <div className="activity-block success">
            <div className="media">
                <div className="media-body">
                <h2 className="font-weight-bold"><span className="mobile-text">{sliceAddress(abi.contract)}</span>&nbsp;<span className="copy-button" onClick={copyContract}><FaCopy  size={15} /></span></h2>
                <p>Contract Address</p>
                </div>
                <span><FaMapMarkerAlt /></span>
            </div>
            <div className="row">
                <div className="progress ">
                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                </div>
            </div>
            <span className="bg-icon"><FaMapMarkerAlt /></span>
        </div>
        </div>
        <div style={{width: "50%"}}>
        <div className="activity-block success">
            <div className="media">
                <div className="media-body">
                <h2 className="font-weight-bold"><span className="mobile-text">{projects.length}</span></h2>
                <p>No of Projects</p>
                </div>
                <span><FaRocket /></span>
            </div>
            <div className="row">
                <div className="progress ">
                <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ><span className="trackerball"></span></div>
                </div>
            </div>
            <span className="bg-icon"><FaRocket /></span>
        </div>
        </div>
    </div>
    <div className="content-body">
        <div className="flex-center">
            <div className="form-box">
                <div className="form-group">
                    <Input type={"text"} value={projectName} onChange={(e)=>setProjectName(e.target.value)} label="Project Name" maxLength={50} placeholder={"e.g MarketPlace for Nfts"} />
                </div>
                <div className="form-group">
                    <TextArea value={projectDescription} onChange={(e)=>setProjectDescription(e.target.value)} label="Project Description" maxLength={500} placeholder={"Describe the project"} />
                </div>
                <div className="form-group">
                    <Input type={"text"} value={projectImageUrl} onChange={(e)=>setProjectImageUrl(e.target.value)} label="Project Image Url (optional)" placeholder={"e.g https://url_to_image_file"} />
                </div>
                <div className="form-group">
                <div className="side-form-group">
                        <div>
                            <Input value={minAmount} onChange={(e)=>setMinAmount(e.target.value)} type="number" label="Min Amount (eth)" placeholder="e.g 0.01" />
                        </div>
                            <div>
                                <Input value={target} onChange={(e)=>setTarget(e.target.value)} type="number" label="Target (eth)" placeholder="e.g 1" />
                        </div>
                    </div>
                </div>

                <div className="form-group flex-center">
                    <Button disabled={formLoading} onClick={()=>submitForm()}>
                        {formLoading?(<Spin />):(
                            <>Create Project</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
        <div style={{marginTop: 15}}>
            <h2>
                All Project Addresses
            </h2>
            <ul className="projects">
               
                    {projects.map((data,idx)=>(
                        <li key={idx}>
                            <Link className="mobile-text" to={`/${data}`}>{data}</Link>
                        </li>
                    ))}
            </ul>
        </div>
    </div>
</div> 
            )}
            </>
        )}
        </>     
 );
}
 
export default Admin;