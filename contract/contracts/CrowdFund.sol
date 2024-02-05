// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

// import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";

contract CrowdFund{
    string public projectName;
    string public projectDescription;
    string public imageUrl;
    uint256 public minAmount = 10 * (10**18);
    uint256 public contributionBalance;
    // AggregatorV3Interface priceFeed;
    uint256 public targetPrice;
    mapping(address => uint256) public funders;
    address[] public fundersArray;
    address public owner;
    enum FUND_STATE{
        open,
        completed
    }
    FUND_STATE public fundState;
    event CompletionEvent(uint completionId);


    constructor
    (address _owner, string memory _projectName, 
    string memory _projectDescription, string memory _imageUrl, 
    // address priceFeedAddress,
    uint256 _targetPrice, uint256 _minAmount
    
    ) public {
        projectName = _projectName;
        owner = _owner;
        projectDescription = _projectDescription;
        imageUrl = _imageUrl;
        targetPrice = _targetPrice;
        minAmount = _minAmount;
        fundState = FUND_STATE.open;
        // priceFeed = AggregatorV3Interface(priceFeedAddress);
        
    }
    modifier onlyOwner(){
        require(msg.sender == owner,"Unknown User");
        _;
    }
    function fund(address funder) public payable {
        // require(fundState == FUND_STATE.open,"Project funding is completed");
        require(msg.value >= minAmount,"cannot fund lower than the minimum amount ");
        if(funders[funder] == 0){
            fundersArray.push(funder);
        }
        funders[funder] += msg.value;
        contributionBalance += msg.value;
        if(msg.value >= targetPrice){
            fundState = FUND_STATE.completed;
            emit CompletionEvent(1);
        }
    }
    function withdraw(uint256 amount, address sender) public{
        require(sender == owner,"Unknown User");
        require(amount <= address(this).balance,"Insufficient Funds");
        payable(owner).transfer(amount);
    }
    function update_target(uint256 _targetPrice) public{
        targetPrice = _targetPrice;
    }
    function getFunders() public view returns(address[] memory) {
        return fundersArray;
    }
    function getProjectBalance() public view returns (uint256){
        return address(this).balance;
    }
}