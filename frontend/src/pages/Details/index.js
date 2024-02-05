import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { PageLoader } from "../../components/Loader";
import { ConnectionContext } from "../../context/ConnectionContext";
import { FaRocket, FaUsers, FaEthereum, FaCoins, FaWallet } from "react-icons/fa6";
import { Spin, message } from "antd";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./details.css";
import contract, {web3} from "../../contractInteractor";
import NotFound from "../NotFound";

const Details = () => {
  const address = useParams().id;
  const gasPrice = 1600000;
  const gasLimit = 3000000;
  //context
  const connectionContext = useContext(ConnectionContext);
  // states
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [invalid, setInvalid] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Data
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectImageUrl, setProjectImageUrl] = useState("");
  const [minAmount, setMinAmount] = useState(0);
  const [target, setTarget] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [amountContributed, setAmountContributed] = useState(0);
  const [funders, setFunders] = useState([]);

  //Input 
  const [fundAmount, setFundAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const getProjectsAddresses = async ()=>{
    const addresses = await contract.methods.getProjectsAddresses().call();
    if(addresses.includes(address)){
      setInvalid(false);
      return true
    }
    return false;
  }
  const getContractBalance = async ()=>{
    const balance = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balance,'ether');
    setContractBalance(parseFloat(balanceInEther));
}
  const getProjectDetails = async()=>{
    const details = await contract.methods.getProjectDetails(address).call();
    console.log(details);
    setProjectName(details[0]);
    setProjectDescription(details[1]);
    setProjectImageUrl(details[2]);
    setContractBalance(web3.utils.fromWei(details[3],'ether'));
    setAmountContributed(parseFloat(web3.utils.fromWei(details[4],'ether')));
    setTarget(parseFloat(web3.utils.fromWei(details[5],'ether')));
    setMinAmount(parseFloat((web3.utils.fromWei(details[6],'ether'))));
    setFunders(details[7]);
  }
  const getOwner = async ()=>{
    const owner = await contract.methods.owner().call();
    if(owner == connectionContext.connectionAddress){
        setIsOwner(true);
    }
}
const FunderDetails = ({funderAddress}) => {
  const [funderAmount, setFunderAmount] = useState(0);
  const [funderLoading, setFunderLoading] = useState(true);
  const getFunderDetail = async (funderAddress)=>{
    const funderDetail = await contract.methods.getProjectFunderDetails(address, funderAddress).call();
     setFunderAmount(parseFloat(web3.utils.fromWei(funderDetail[1],'ether')));
     setFunderLoading(false);
  }
  useEffect(()=>{
    getFunderDetail(funderAddress);
  },[])
  return(
    <>
    {funderLoading?(
      <Spin />
    ):(
      <span>
      {funderAmount} eth
      </span>
    )}
    </>
  )
}

const fundProject = async ()=>{
  if(!fundAmount || fundAmount < 0){
    message.error("Enter a valid amount in eth");
    return
  }
  setFormLoading(true);
  message.loading("Transaction Processing")
  try{
    await connectionContext.walletContract.methods.fundProject(address).send({
    from: connectionContext.connectionAddress,
    value: web3.utils.toWei(fundAmount,"ether"),
    gas: gasLimit,
    gasPrice: gasPrice
  })
  message.success("You have funded this project.. Thanks for funding")
  setFundAmount("");
  methodCall();
  }catch(e){
    message.error("An Error occurred with the transaction")
  }
  setFormLoading(false);
}
const withdrawFunds = async ()=>{
  if(!withdrawAmount || withdrawAmount < 0){
    message.error("Enter a valid amount in eth");
    return
  }
  setFormLoading(true);
    message.loading("Transaction Processing..");
    try{
      await connectionContext.walletContract.methods.withdrawProjectFund(address, 
        web3.utils.toWei(withdrawAmount,'ether')).send({
      from: connectionContext.connectionAddress,
      gas: gasLimit,
      gasPrice
    })
    setWithdrawAmount("");
    message.success("Project Funds Withdrawn successfully");
    methodCall();
    }catch(e){
      message.error("An Error occurred with this transaction");
    }
    setFormLoading(false);
    
}
  const methodCall = async ()=>{
      setLoading(true);
      const validator = await getProjectsAddresses();
      if(validator){
        document.title = `CrowdFundUs | Project ${address}`
        await getProjectDetails();
        getContractBalance();
        await getOwner();
      }
      setLoading(false);
  }
  useEffect(()=>{
    methodCall();
  },[])
  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>{invalid?(<NotFound />):(
          <div className="container">
          <div className="details-header-section">
            <div className="details" style={{backgroundImage:`url(${projectImageUrl})`}}>
                <h2>
                    {projectName}
                </h2>
                <p>
                    {projectDescription}
                </p>
            </div>
          </div>
          <div className="metrics">
            <div>
              <div className="activity-block success">
                <div className="media">
                  <div className="media-body">
                    <h2 className="font-weight-bold">
                      <span className="">{minAmount}</span> eth
                    </h2>
                    <p>Min Contribution Amount</p>
                  </div>
                  <span>
                    <FaEthereum />
                  </span>
                </div>
                <div className="row">
                  <div className="progress ">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span className="trackerball"></span>
                    </div>
                  </div>
                </div>
                <span className="bg-icon">
                  <FaEthereum />
                </span>
              </div>
            </div>
            <div>
              <div className="activity-block success">
                <div className="media">
                  <div className="media-body">
                    <h2 className="font-weight-bold">
                      <span className="">{amountContributed}</span> eth
                    </h2>
                    <p>Amount Contributed</p>
                  </div>
                  <span>
                    <FaCoins />
                  </span>
                </div>
                <div className="row">
                  <div className="progress ">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span className="trackerball"></span>
                    </div>
                  </div>
                </div>
                <span className="bg-icon">
                  <FaCoins />
                </span>
              </div>
            </div>
            <div>
              <div className="activity-block success">
                <div className="media">
                  <div className="media-body">
                    <h2 className="font-weight-bold">
                      <span className="">{target}</span> eth
                    </h2>
                    <p>Target</p>
                  </div>
                  <span>
                    <FaRocket />
                  </span>
                </div>
                <div className="row">
                  <div className="progress ">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span className="trackerball"></span>
                    </div>
                  </div>
                </div>
                <span className="bg-icon">
                  <FaRocket />
                </span>
              </div>
            </div>
            <div>
              <div className="activity-block success">
                <div className="media">
                  <div className="media-body">
                    <h2 className="font-weight-bold">
                      <span className="">{funders.length}</span>
                    </h2>
                    <p>No of Contributors</p>
                  </div>
                  <span>
                    <FaUsers />
                  </span>
                </div>
                <div className="row">
                  <div className="progress ">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span className="trackerball"></span>
                    </div>
                  </div>
                </div>
                <span className="bg-icon">
                  <FaUsers />
                </span>
              </div>
            </div>
            {isOwner && (
                <div>
                <div className="activity-block success">
                  <div className="media">
                    <div className="media-body">
                      <h2 className="font-weight-bold mobile-text">
                        <span className="">{contractBalance}</span> eth
                      </h2>
                      <p>Contract Balance</p> 
                    </div>
                    <span>
                      <FaCoins />
                    </span>
                  </div>
                  <div className="row">
                    <div className="progress ">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <span className="trackerball"></span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-icon">
                    <FaCoins />
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="small-form-box">
            {connectionContext.connected?(
            <div className="form-group flex" style={{alignItems:"flex-end"}}>
                        <div style={{flex:1, paddingRight: 10}}>
                            <Input value={fundAmount} onChange={(e)=>setFundAmount(e.target.value)} type="number" label='Contribution Amount (eth)' placeholder="e.g 0.1" />
                        </div>
                <div>
                  <Button onClick={()=>fundProject()} disabled={formLoading}>
                    {formLoading?(<Spin />):(
                      <>
                      Contribute
                      </>
                    )}
                    
                  </Button>
                </div>
            </div>
            ):(
            <div className="form-group flex" style={{alignItems:"center"}}>
                <div style={{flex:1, paddingRight: 10}}>
                   <p>Connect Wallet to Contribute</p>
                </div>
                    <div><Button icon={<FaWallet />} onClick={()=>connectionContext.connectWallet()}>Connect Wallet</Button></div>
            </div>
            )}
            {isOwner && (
              <div style={{paddingTop:10, paddingBottom: 10}}>
                <div className="form-group flex" style={{alignItems:"flex-end"}}>
                        <div style={{flex:1, paddingRight: 10}}>
                            <Input value={withdrawAmount} onChange={(e)=>setWithdrawAmount(e.target.value)} type="number" label='Withdrawal Amount (eth)' placeholder="e.g 0.1" />
                        </div>
                <div>
                  <Button onClick={()=>withdrawFunds()} disabled={formLoading}>
                    {formLoading?(<Spin />):(
                      <>
                      Withdraw Funds
                      </>
                    )}
                    
                  </Button>
                </div>
            </div>
              </div>
            )}
            </div>
          <div style={{marginTop: 15}}>
            <h2>
                Contributors
            </h2>
            <div>
                {isOwner && (
                <div className="flex-end" style={{paddingTop: 10, paddingBottom: 10}}>
                    <Button>Download Contributors List</Button>
                </div>  
                )}
                
                <table className="contributors">
                  <tr>
                        <th>Address</th>
                        <th>Amount</th>
                  </tr>
                  {funders.map((data,idx)=>(
                    <tr key={idx}>
                        <td>{data}</td>
                        <td><FunderDetails funderAddress={data} /></td>
                    </tr>
                  ))}
                    
                    
                </table>
            </div>
          </div>
        </div>
        )}</>
        
      )}
    </>
  );
};

export default Details;
