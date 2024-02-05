
# CrowdFundUs

This is decentralized fundraising application built on the Ethereum blockchain. This is an application where projects are posted with a target funding amount and then people,in this sense contributors, fund projects that they will like to invest in. These projects might be blockchain involved or other things like charity work and building communities. This application can be used for different types of fundraising like **Donation based** fundraising where contributors make charitable donations to support a cause without expecting financial returns or rewards or a **Reward based** fundraising where contributors receive non-financial rewards in exchange for their support. These rewards can range from early access to products, exclusive content or incentives. This application can be used by DAO to get funds for innovative projects or events that need funding from members.
## Features

- Smart Contract: The application ensures security and transparency by using smart contract for storing data and collecting contributions.
- Decentralized Project Funding: The Admin i.e the person that deployed the contract to the blockchain can create project campaigns without the need of centralized authority for receiving the contribution or storing the data.
- User Friendly Interface: The application is built with react and it provides an intuitive and responsive user interface for easy interaction.
- Detailed Project Information: The application show detailed Information of projects and what it is about. this will help influence the mind of contributors



## Prerequisites
- Python
- Node Js
- Brownie (python)
- Solidity
- npm/yarn

#### Note: the smart contract can be deployed with brownie if user has experience with brownie or it could be copied from the contracts/contract folder and sent to remix for deployment and then replace the content of the abi.json file in the frontend/src folder with the abi and contract in an json format and seen in the abi.json file. The main contrat to be deployed is the CrowndFundFactory.sol with the CrowdFund.sol as its dependency.
## Run Locally
### Creating a Python Virtual Environment for Brownie

**Note:** you can skip to no. 12 if you want to perform the actions specified by the previous note.

1. Choose a folder for the project
2. Open cmd or bash in the project directory
3. Create a virtual environment (make sure you have python installed and virtualenv installed as a pip package)
```bash
  virtualenv env
```
4. if you dont virtualenv installed, you can install it by running
```bash
  pip install virtualenv
```
5. Activate the virtualenv, run
```bash
  env\Scripts\activate
```
### Installation
6. Clone the project

```bash
  git clone https://github.com/codebestia/CrowdFundUs.git
```

7. Go to the project directory
```bash
  cd CrowdFundUs
```

8. Install dependencies for brownie

```bash
  cd contract
  pip install -r requirements.txt
```
9. Create a .env file and add the following environment variables to the file
`PRIVATE_KEY` - your wallet account private key that will be used to deploy the project 
`
`WEB3_INFURA_PROJECT_ID` (optional) - for deploying to other chain using infura provider and your infura project id.

10. Add lightlink network (for deploying to lightlink blockchain)
```bash
  brownie networks add lightlink-pegasus host=https://replicator.pegasus.lightlink.io/rpc/v1 chainid=1891 explorer=https://pegasus.lightlink.io/
``` 

11. Compile the smart contract with brownie
```bash
  brownie compile
  brownie run scripts/deploy --network lightlink-pegasus
```
**Note:** if you want to deploy to other networks replace lightlink-pegasus with the name of the network. run
```bash
  brownie networks list
```
to see all available network

12. Install the dependencies for react
```bash
cd frontend # navigate into the frontend in the CrowdFundUs folder
npm install   # or yarn install

```
12. Start the react server

```bash
  npm run start
```
13. Access the application at http://localhost:3000 in your web browser.


## Usage

1. Connect your Ethereum wallet to the application.
2. Explore existing projects.
3. Create Project (for admins)
4. Contribute to projects that align with your interests.
5. Monitor the progress of projects through the admin dashboard. (for admins)


## Screenshots

Project List Page
![Project List](https://res.cloudinary.com/ds81lsf2c/image/upload/v1707068270/project_list_page_chs4vg.jpg)

Project Details Page
![Project Details](https://res.cloudinary.com/ds81lsf2c/image/upload/v1707068270/project_details_page_fcki6e.jpg)

Admin Page
![Admin Page](https://res.cloudinary.com/ds81lsf2c/image/upload/v1707068270/admin_dashboard_vl1djx.jpg)


## License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

