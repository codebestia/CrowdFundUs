import os
from brownie import CrowdFundFactory
from scripts.helpers import get_account
import json


def deploy_crowdfunding():
    account = get_account()
    crowndfundfactory = CrowdFundFactory.deploy(account,{'from':account})
    abi = crowndfundfactory.abi
    address = crowndfundfactory.address
    print(abi)
    path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),'frontend','src')
    if os.path.exists(path):
        with open(path+"/abi.json","w") as file:
            contract_data = {
                'abi':abi,
                'contract': address
            }
            json.dump(contract_data,file)
            
    return crowndfundfactory

def main():
    deploy_crowdfunding()