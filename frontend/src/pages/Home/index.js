import { FaEthereum } from "react-icons/fa6";
import "./home.css"
import {web3} from "../../contractInteractor";
import contract from "../../contractInteractor";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components/Loader";

const Home = () => {
    document.title = "CrowndFundUs | Projects"
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const spliceWord = (word)=>{
        if(word.length > 20){
          return word.slice(0,20) +"...."  
        }
        return word
    }
    const weiToEth = (wei)=>{
        return web3.utils.fromWei(wei,'ether');
    }
    const methodCall = async () =>{
        const projects  = await contract.methods.getProjects().call();
        projects.reverse();
        setProjects(projects);
        setLoading(false);
    }
    useEffect(()=>{
        methodCall();
    },[])
    return (
        <>
        {loading?(<PageLoader />):(
            <div className="container">
            <div className="header">
               <h1 className="text-center">CrowdFundUs</h1>
                <p className="writeup">
                    The project that you want to fund is here, help it reach its dream by funding it.
                </p> 
            </div>
            <div className="project-section">
                <h1 className="header">All Projects</h1>
                <div className="row">
                    
                        {projects.map((data,idx)=>(
                        <div className="column">
                            <div className="card">
                                <div className="img-container">
                                    <img src={data.projectImageUrl} />
                                    <span className="state"></span>
                                </div>
                                <div className="card-content">
                                    <h3>
                                        <Link to={`/${data.projectAddress}`} className="link" >{spliceWord(data.projectName)}</Link>
                                    </h3>
                                    <h2>
                                    <FaEthereum />{weiToEth(data.targetPrice)} Eth <span className="small-text">(target)</span>
                                    </h2>
                                </div>
                            </div>
                        </div>
                        ))}
                        
                        
                    
                    {projects.length == 0 && (
                            <div style={{paddingTop:20, paddingBottom: 20, width: "100%"}} className="flex-center">
                                <h1>No Projects Yet</h1>
                            </div>
                        )}
                </div>
            </div>
        </div> 
        )}
        </>
    );
}
 
export default Home;