// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";
import "./CrowdFund.sol";

contract CrowdFundFactory{
    using SafeMathChainlink for uint256;
    address public owner;
    CrowdFund[] projects;
    struct ProjectTuple{
        address projectAddress;
        string projectName;
        uint256 targetPrice;
        string projectImageUrl;
    }
    ProjectTuple[] projectitems;
    constructor(address _owner) public {
        owner = _owner;    
    }
    modifier onlyOwner(){
        require(msg.sender == owner,"Unknown User");
        _;
    }
    function createProject
    (
    string memory _projectName, 
    string memory _projectDescription,
    string memory _imageUrl, 
    uint256 _targetPrice, uint256 _minAmount
    ) public onlyOwner{
        CrowdFund project = new CrowdFund(owner,_projectName, _projectDescription,_imageUrl,_targetPrice,_minAmount);
        projects.push(project);
        projectitems.push(ProjectTuple({projectAddress: address(project),projectName:_projectName,targetPrice: _targetPrice,
        projectImageUrl: _imageUrl }));
    } 
    function fundProject(address projectAddress) public payable{
        CrowdFund project = CrowdFund(address(projectAddress));
        project.fund{value:msg.value}(msg.sender);
    }
    function withdrawProjectFund(address projectAddress, uint256 amount) public onlyOwner{
        CrowdFund project = CrowdFund(address(projectAddress));
        project.withdraw(amount,owner);

    }
    function getProjects() public  view returns(ProjectTuple[] memory){
        return projectitems;
    }
    function getProjectsAddresses() public view returns(CrowdFund[] memory){
        return projects;
    }
    function getProjectDetails(address projectAddress) external view returns(string memory, string memory, string memory, uint256, uint256,uint256, uint256,address[] memory){
        CrowdFund project = CrowdFund(address(projectAddress));
        return (project.projectName(),project.projectDescription(), project.imageUrl(),address(projectAddress).balance,
        project.contributionBalance(),project.targetPrice(),project.minAmount(), project.getFunders());
    }
    function getProjectFunderDetails(address projectAddress, address funderAddress) public view returns(address, uint256){
        CrowdFund project = CrowdFund(address(projectAddress));
        uint256 fund = project.funders(address(funderAddress));
        return (funderAddress, fund);
    }
}