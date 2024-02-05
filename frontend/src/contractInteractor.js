import Web3 from "web3";
import abi from "./abi.json"


const LIGHTLINK_PROVIDER = 'https://replicator.pegasus.lightlink.io/rpc/v1';


const provider = new Web3.providers.HttpProvider(LIGHTLINK_PROVIDER);

export const web3 = new Web3(provider);

const contract = new web3.eth.Contract(abi.abi, abi.contract);



export default contract;

