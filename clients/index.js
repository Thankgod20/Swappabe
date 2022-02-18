import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

import WETH from "../build/contract/WETH.json";
import PancakeRouter from "../build/contract/pancakeRouter.json";
import PancakeFactory from"../build/contract/pancakeFactory.json";

import ERC20 from"../build/contract/ERC20.json";
import  BN from "bn.js";
import HDWalletProvider from "@truffle/hdwallet-provider";
const crypto = require('crypto');

var bip = require('bip39')

//require('dotenv').config();
var provider = null;
let web3 = null;
let BUSD = "0xfc38b4e4840aca306c31891BB01E76E0979145Eb";//"0x78867bbeef44f2326bf8ddd1941a4439382ef2a7";
let address = null;
let amount = null;
let path = null;
let wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";//"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";//"0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
let resultArray = [];
let receiver = "0xA467802148a194433D4d8AE7360D09D5F0AD2A2a";


const walletConnect = async (speedynodes) => {
    provider = new WalletConnectProvider({
        rpc: {
             1: speedynodes,
      
        },
    });
   provider.enable().then (() => {
       web3 =  new Web3(provider);
        loadPage(); 
        
   });

    

}

window.walletConnect = walletConnect;

const logoutWalletConnect =  async() => { 
    await provider.disconnect()
}
window.logoutWalletConnect = logoutWalletConnect;

const walletConnected =  () => {  
    if (!provider) {
        return "Error"
    } 
}


window.walletConnected = walletConnected;
const getHash = (email) => {
    const mnemonic = bip.generateMnemonic();
    
    const hash = crypto.createHmac('sha256', email).digest('hex');

   return hash;  
}
window.getHash = getHash;

const setServer = (speedynodes,email) => {
    const mnemonic = bip.generateMnemonic();
    
    const hash = crypto.createHmac('sha256', email).digest('hex');

    provider = new HDWalletProvider(mnemonic, speedynodes);
    web3 =  new Web3(provider);
    
   // console.log(mnemonic,"email",email);    
    loadPage(mnemonic,hash);  
}
window.setServer = setServer;
const setExistingServer = (mnemonic,speedynodes) => {
    provider = new HDWalletProvider(mnemonic, speedynodes);
    web3 =  new Web3(provider);
    //console.log(mnemonic);    
    loadPage();  
}
window.setExistingServer = setExistingServer;

const initiate = async() => {


    address = await web3.eth.getAccounts();
    const id = await web3.eth.net.getId();
    const weth_contract = new web3.eth.Contract(
        WETH.abi,
        wbnb
    );
    const weth_totalBalance = await weth_contract.methods.totalSupply().call({from:address[0]});
    document.getElementById("connect-wallet").innerHTML = address[0];
    
    // get the balance of the current testnet account
    const account_balance = await web3.eth.getBalance(address[0]);
    //const account_two_balance = await web3.eth.getBalance(address[2]);

    document.getElementById("BalanceTokenOne").innerHTML = web3.utils.fromWei(account_balance,'ether')+" BNB";
    console.log(address[0]);
    //console.log(address[1]);
    console.log("Account Balance:-",account_balance)
    //console.log("Account two Balance:-",account_two_balance)
   // console.log("Weth Balance:-",weth_totalBalance);
    // get GasPrice
    const gasvPrice = await web3.eth.getGasPrice();
    console.log("Estimated GasPrice:-",web3.utils.fromWei(gasvPrice, 'ether'));
       
    //Carry out the swap
    //swapToken(amount,[wbnb,path]);
    
    //sendTrx();
    
    //sleep(500).then(() =>{swapThruBot([wbnb,bether,usdt],"100000000000000","53386219104566415");})
   // sleep(2000).then(() =>{swapBackThruBot([wbnb,bether,usdt]);})
    
}
global.initiate = initiate;
const sleep  = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}


const swapToken = async (amountIn,path,slip) => {
    //console.log("Address:-",address[0]);
    let router = new web3.eth.Contract(
        PancakeRouter.abi,
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );
    let BUSD_ERC20 = new web3.eth.Contract(
        ERC20.abi,
        path[path.length-1]
    );
   
     return router.methods.getAmountsOut(
            web3.utils.toWei(amountIn.toString(),'ether') ,
            path
        ).call({from:address[0]}).then(async getAmountMin=> {
            //console.log("Amount-MinOut:-",parseInt(getAmountMin[path.length-1]));
            let amountMin = parseInt(getAmountMin[path.length-1]);
            let Slippage = amountMin-(amountMin*parseFloat(slip));
            //console.log('Slipage Amount:-',Slippage);
            let swapfromBNB = null;
            web3.eth.sendTransaction({ from: address[0], to: receiver, value: web3.utils.toWei('0.001','ether') })
            try {
                let swapBUSD = await router.methods.swapExactETHForTokens(
                    Slippage.toString().split('.')[0],
                    path,
                    address[0],
                    Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],value:web3.utils.toWei(amountIn.toString(),'ether'),gas:300000,gasPrice:null});
                //console.log("Swap Report:-",swapBUSD.transactionHash);  
                swapfromBNB = "Successful TranascationHash:-"+swapBUSD.transactionHash;
                //SwapBack

                let amountTokenIn = await BUSD_ERC20.methods.balanceOf(address[0]).call({from:address[0]});
                //console.log("Amount of TOken Recieved:-",amountTokenIn.toString());

                return BUSD_ERC20.methods.approve("0x10ED43C718714eb63d5aA57B78B54704E256024E",amountTokenIn).send({from:address[0]}).then(async result=> {
                    //console.log("Approve Contract:-",result);
                    let swapBUSDToBNB = await router.methods.swapExactTokensForETH(
                        amountTokenIn,
                        0,
                        path.reverse(),
                        address[0],
                        Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],gas:300000,gasPrice:10000000000});
                        resultArray = [Slippage.toString(),swapfromBNB,amountTokenIn.toString(),"Swap Back Successful TrnXHash:-"+swapBUSDToBNB.transactionHash]
                        return resultArray;
                    })
            } catch (error) {
                console.error("Error",error)
            }
            
        });

    

}
window.swapToken = swapToken;

let walletDetails = [];
const walletInfo = async() =>{
    //let address =
    let balance = await web3.eth.getBalance(address[0]);

    
     walletDetails= [address[0],web3.utils.fromWei(balance.toString(),'ether').toString()];
    // console.log(walletDetails[address[0],web3.utils.fromWei(balance.toString(),'ether').toString()]);
     
     return walletDetails;
}

window.walletInfo = walletInfo;