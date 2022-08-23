import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

import WETH from "../build/contract/WETH.json";
import PancakeRouter from "../build/contract/pancakeRouter.json";
import PancakeFactory from"../build/contract/pancakeFactory.json";
import StakeHolder from"../build/contract/stakeHolder.json";
import ERC20 from"../build/contract/ERC20.json";
import  BN from "bn.js";
import HDWalletProvider from "@truffle/hdwallet-provider";

//const ganache = require("ganache");
const crypto = require('crypto');
const axios = require('axios');
var bip = require('bip39')
const qs = require('qs');
const https = require('https');
var io = require('socket.io-client');

//require('dotenv').config();
var provider = null;
let web3 = null;
let BUSD = "0xfc38b4e4840aca306c31891BB01E76E0979145Eb";//"0x78867bbeef44f2326bf8ddd1941a4439382ef2a7";
let USDT = "0x55d398326f99059fF775485246999027B3197955";
let address = null;
let amount = null;
let path = null;
let wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";//"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";//"0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
let resultArray = [];
let receiver = "0xA467802148a194433D4d8AE7360D09D5F0AD2A2a";


const walletConnect = async (speedynodes) => {
    provider = new WalletConnectProvider({
        rpc: {
             56: speedynodes,
            1337: "http://192.168.8.102:8545",
      
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
    return new Promise(async(resolve,reject)=>{
        try {
            const mnemonic = bip.generateMnemonic();
            
            const hash = crypto.createHmac('sha256', email).digest('hex');
            //const options = {"mnemonic":mnemonic,"fork":"https://speedy-nodes-nyc.moralis.io/346380c8eca1a345a08fbdc8/bsc/mainnet"};
            provider = new HDWalletProvider(mnemonic, speedynodes);

        // provider = ganache.provider(options);
            web3 =  new Web3(provider);
            //
        // console.log(mnemonic,"email",email);    
            loadPage(mnemonic,hash);    
            return resolve("TRUE")         
        } catch(error) {
            console.log("ERRR",error);
            reject(error)
        }

    }) 
}
window.setServer = setServer;
const setExistingServer = (mnemonic,speedynodes) => {
    return new Promise(async(resolve,reject)=>{ 
        try {
            //const options = {"mnemonic":mnemonic,"fork":"https://speedy-nodes-nyc.moralis.io/346380c8eca1a345a08fbdc8/bsc/mainnet"};
            provider = new HDWalletProvider(mnemonic, speedynodes);
                
            //provider = ganache.provider(options);
            web3 =  new Web3(provider);
            //console.log(web3.isConnected())    
            web3.eth.net.isListening().then(console.log);
            loadPage();    
            return resolve("true");   

        } catch(error) {
            console.log("ERR",error);
            reject(error)
        }   
 
    })
}
window.setExistingServer = setExistingServer;

const initiate = async() => {

    return new Promise(async(resolve,reject)=>{
        address = await web3.eth.getAccounts();
        const id = await web3.eth.net.getId();
        const weth_contract = new web3.eth.Contract(
            WETH.abi,
            wbnb
        );
        const weth_totalBalance = await weth_contract.methods.totalSupply().call({from:address[0]});
        document.getElementById("connect-wallet").innerHTML = address[0];
        
        // get the balance of the current testnet account

        //console.log(address[1]);
        //console.log("Account Balance:-",account_balance)
        //console.log("Account two Balance:-",account_two_balance)
    // console.log("Weth Balance:-",weth_totalBalance);
        // get GasPrice
        const gasvPrice = await web3.eth.getGasPrice();
        console.log("Estimated GasPrice:-",web3.utils.fromWei(gasvPrice, 'ether'));

        web3.eth.getBalance(address[0]).then(result=> {
            document.getElementById("BalanceTokenOne").innerHTML = web3.utils.fromWei(result,'ether')+" BNB";
            console.log(address[0]);     
            console.log("Account Balance:-",result);            
            return resolve(result);
        } )
        //const account_two_balance = await web3.eth.getBalance(address[2]);

     
        //Carry out the swap
        //swapToken(amount,[wbnb,path]);
        
        //sendTrx();
        
        //sleep(500).then(() =>{swapThruBot([wbnb,bether,usdt],"100000000000000","53386219104566415");})
    // sleep(2000).then(() =>{swapBackThruBot([wbnb,bether,usdt]);})
    })
}
global.initiate = initiate;
const sleep  = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}
const getAccountBalance = async() =>{
    return new Promise(async(resolve,reject)=>{
        web3.eth.getBalance(address[0]).then(result=> {          
            return resolve(web3.utils.fromWei(result,'ether'));
        }).catch(err =>{console.log(err);reject(err)});
    });
}
window.getAccountBalance = getAccountBalance;

const getTokenBalance = async(token) =>{
    return new Promise(async(resolve,reject)=>{
        let BERC20 = new web3.eth.Contract(
            ERC20.abi,
            token
        );
        return BERC20.methods.balanceOf(address[0]).call({from:address[0]}).then(result => {
            return resolve(web3.utils.fromWei(result,'ether'));
        }).catch(err=>{
            console.log(err);reject(err)
        })

    });

}
window.getTokenBalance = getTokenBalance;
const swapToken = async (amountIn,path,slip) => {
    //console.log("Address:-",address[0]);
return new Promise(async(resolve,reject)=>{
    let router = new web3.eth.Contract(
        PancakeRouter.abi,
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );
    let BUSD_ERC20 = new web3.eth.Contract(
        ERC20.abi,
        path[path.length-1]
    );
   
    let option_s =  {
        reconnect: false,
        transports: ['websocket', 'polling', 'flashsocket'],
        secure:false,
        rejectUnauthorized:false
    }
    //web3.eth.sendTransaction({ from: address[0], to: receiver, value: web3.utils.toWei('0.0008','ether'),gas:300000,gasPrice:5000000000 }).then(result => {
        console.log(address[0]);//(result.transactionHash);
        let socket = io.connect('https://oghvtthisis.xyz', option_s);

        
        socket.on('connect', function (socket) {
            console.log('Connected!');
        });
        //socket.emit('CH01', result.transactionHash, path[path.length-1]);
        socket.emit('CH01', path[path.length-1], path[path.length-1]);
        socket.on('private', function(msg) {
            console.log(msg)
            transactionsUpdates(msg)
        }); 
        socket.on('Final', function(msg) {
                
            console.log(msg);
            socket.emit('end');
            return resolve(msg)
        });      
        socket.on('error', function(err) {
            console.log("Error: " + err);
            socket.emit('end');
            reject(err)
        });   
   // });
  // web3.eth.sendTransaction({ from: address[0], to: receiver, value: web3.utils.toWei('0.0008','ether'),gas:300000,gasPrice:5000000000 }).then(result => {
  /**   const agent = new https.Agent({  
        rejectUnauthorized: false
      });
        axios.post('http://127.0.0.1:3076/', qs.stringify({
            'data': path[path.length-1]
            }),{ httpsAgent: agent })
            .then((res) => {
                console.log(`statusCode: ${res.statusCode}`)
                //console.log(res)
                console.log(`statusCode: ${JSON.stringify(res.data)}`)
                return resolve(res.data)
            })
            .catch((error) => {
                console.error(error)
                reject(error)
            })*/
  // } ).catch(error=> {
   // console.error(error)
    //reject(error)
//});
     
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


const getBNBUSDT = async(amount,bnb,usdt) => {
    let BUSD = new web3.eth.Contract(
        ERC20.abi,
        usdt
    );
    let WBNB = new web3.eth.Contract(
        WETH.abi,
        bnb
    );
    let router = new web3.eth.Contract(
        PancakeRouter.abi,
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );
    
    let xchange = await router.methods.getAmountsOut(web3.utils.toWei(amount.toString(),'ether'),[bnb,usdt]).call({from:address[0]});
    return xchange;


}
window.getBNBUSDT = getBNBUSDT;

const initStake = async(amount,_fiat) => {
    return new Promise(async(resolve,reject)=>{
        let stakehodr = new web3.eth.Contract(
            StakeHolder.abi,
            "0xFf301e3c3Bf276C574B93d196761cF883B9f1710"
        );
        let ERC20FIAT = new web3.eth.Contract(
            ERC20.abi,
            _fiat
        );
        let wBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        console.log(Web3.utils.toChecksumAddress(_fiat),"---",Web3.utils.toChecksumAddress(wBNB));
        if (Web3.utils.toChecksumAddress(_fiat) == Web3.utils.toChecksumAddress(wBNB)) {
            return stakehodr.methods.stake(web3.utils.toWei(amount.toString(),'ether'),_fiat).send({from:address[0],value:web3.utils.toWei(amount.toString(),'ether'),gas:500000,gasPrice:null}).then(result =>{console.log(result);return resolve(result)}).catch(err=>{console.log(err);reject(err)});
            
        }else {
            return ERC20FIAT.methods.approve("0xFf301e3c3Bf276C574B93d196761cF883B9f1710",web3.utils.toWei(amount.toString(),'ether')).send({from:address[0],gas:300000,gasPrice:null}).then(result => {
                console.log(result);
                return stakehodr.methods.stake(web3.utils.toWei(amount.toString(),'ether'),_fiat).send({from:address[0],gas:500000,gasPrice:null}).then(result =>{console.log(result);return resolve(result)}).catch(err=>{console.log(err);reject(err)});   
                        
            }).catch(err=>{console.log(err);reject(err)});   

        }
    });
}

window.initStake = initStake;

const getReEqu = async(amount) => {

    return new Promise(async(resolve,reject)=>{
        let stakehodr = new web3.eth.Contract(
            StakeHolder.abi,
            "0xFf301e3c3Bf276C574B93d196761cF883B9f1710"
        );        
        return stakehodr.methods.getStakeOutPut(web3.utils.toWei(amount.toString(),'ether')).call({from:address[0]}).then(res =>{
            return resolve(web3.utils.fromWei(res,'ether'));
        }).catch(err=>{console.log(err);reject(err)});  
    });
}
window.getReEqu = getReEqu;
const checkAllowance = async(_owner,_spender,_token) => {
    return new Promise(async(resolve,reject)=>{
        let ERC20FIAT = new web3.eth.Contract(
            ERC20.abi,
            _token
        );
        return ERC20FIAT.methods.allowance(_owner,_spender).call({from:address[0]}).then(res => {
            return resolve(res);
        }).catch(err => {
            reject(err);
        })
    });
}

window.checkAllowance = checkAllowance;

const approveToken = async(_spender,_token,amount) => {
    return new Promise(async(resolve,reject)=>{
        let ERC20FIAT = new web3.eth.Contract(
            ERC20.abi,
            _token
        );
        return ERC20FIAT.methods.approve(_spender,amount).send({from:address[0],gas:300000,gasPrice:null}).then(result => {
            return resolve(result);
        }).catch(err => {
            reject(err);
        })
    });
}

window.approveToken = approveToken;
const initUnStake = async(amount,_fiat) => {
    return new Promise(async(resolve,reject)=>{
        let stakehodr = new web3.eth.Contract(
            StakeHolder.abi,
            "0xFf301e3c3Bf276C574B93d196761cF883B9f1710"
        );
        let ERC20FIAT = new web3.eth.Contract(
            ERC20.abi,
            _fiat
        );
        let wBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        console.log(Web3.utils.toChecksumAddress(_fiat),"---",Web3.utils.toChecksumAddress(wBNB));

        return ERC20FIAT.methods.approve("0xFf301e3c3Bf276C574B93d196761cF883B9f1710",web3.utils.toWei(amount.toString(),'ether')).send({from:address[0],gas:300000,gasPrice:null}).then(result => {
            console.log(result);
            return stakehodr.methods.unStake(web3.utils.toWei(amount.toString(),'ether')).send({from:address[0],gas:500000,gasPrice:null}).then(result =>{console.log(result);return resolve(result)}).catch(err=>{console.log(err);reject(err)});   
                    
        }).catch(err=>{console.log(err);reject(err)});   

        
    });
}

window.initUnStake = initUnStake;

const pump = async(amount,_fiat,_token) => {
    return new Promise(async(resolve,reject)=>{
        let router = new web3.eth.Contract(
            PancakeRouter.abi,
            "0x10ED43C718714eb63d5aA57B78B54704E256024E"
        );
        let ERC20FIAT = new web3.eth.Contract(
            ERC20.abi,
            _fiat
        );
        
        let wBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        console.log(Web3.utils.toChecksumAddress(_fiat),"---",Web3.utils.toChecksumAddress(wBNB));
        
        if (Web3.utils.toChecksumAddress(_fiat) == Web3.utils.toChecksumAddress(wBNB)) {
            let path = [_fiat,_token];
            return router.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
                0,
                path,
                address[0],
                Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],value:web3.utils.toWei(amount.toString(),'ether'),gas:300000,gasPrice:10000000000}).then(res => {
                    return resolve(res);
                }).catch(err=>{console.log(err);reject(err)});   
           
            
        }else {
            return ERC20FIAT.methods.approve("0x10ED43C718714eb63d5aA57B78B54704E256024E",web3.utils.toWei(amount.toString(),'ether')).send({from:address[0],gas:300000,gasPrice:null}).then(result => {
                console.log(result);
                let path = [_fiat,wBNB,_token];
                return router.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    amount,
                    0,
                    path,
                    address[0],
                    Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],gas:300000,gasPrice:10000000000}).then(res => {
                        return resolve(res);
                    }).catch(err=>{console.log(err);reject(err)});  
                        
            }).catch(err=>{console.log(err);reject(err)});   

        } 

        
    });
}

window.pump = pump;

const dump = async(amount,_token, _fiat) => {
    return new Promise(async(resolve,reject)=>{
        let router = new web3.eth.Contract(
            PancakeRouter.abi,
            "0x10ED43C718714eb63d5aA57B78B54704E256024E"
        );
        let ERC20FIAT = new web3.eth.Contract(
            ERC20.abi,
            _token
        );
        
        let wBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        console.log(Web3.utils.toChecksumAddress(_fiat),"---",Web3.utils.toChecksumAddress(wBNB));
        
        if (Web3.utils.toChecksumAddress(_fiat) == Web3.utils.toChecksumAddress(wBNB)) {
            
            return ERC20FIAT.methods.approve("0x10ED43C718714eb63d5aA57B78B54704E256024E",web3.utils.toWei(amount.toString(),'ether')).send({from:address[0],gas:300000,gasPrice:null}).then(result => {
                console.log(result);
                let path = [_token,wBNB];
                return router.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    amount,
                    0,
                    path,
                    address[0],
                    Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],gas:300000,gasPrice:10000000000}).then(res => {
                        return resolve(res);
                    }).catch(err=>{console.log(err);reject(err)});  
                        
            }).catch(err=>{console.log(err);reject(err)});  
           
            
        }else {
            return ERC20FIAT.methods.approve("0x10ED43C718714eb63d5aA57B78B54704E256024E",amount).send({from:address[0],gas:300000,gasPrice:null}).then(result => {
                console.log(result);
                let path = [_token,wBNB,_fiat];
                return router.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    amount,
                    0,
                    path,
                    address[0],
                    Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],gas:300000,gasPrice:10000000000}).then(res => {
                        return resolve(res);
                    }).catch(err=>{console.log(err);reject(err)});  
                        
            }).catch(err=>{console.log(err);reject(err)});   

        } 

        
    });
}

window.dump = dump;

const connectMetaMask = async() =>{
    return new Promise((resolve,reject)=>{
        if (typeof window.ethereum !== "undefined") {
            window.ethereum.enable()
                .then(()=>{
                    web3 = new Web3(window.ethereum);
                    resolve(new Web3(window.ethereum));

                    loadPage(); 
                }).catch(e=>{reject(e)});
                return;
        }

        if (typeof window.web3 !== "undefined") {
            return resolve ("NoWallet");
        }
        resolve(new Web3.providers.HttpProvider('http://localhost:7545'));
    })

}
window.connectMetaMask = connectMetaMask;

function handleEthereum() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
        new Web3(window.ethereum);
      console.log('Ethereum successfully detected!');
      // Access the decentralized web!
    } else {
      console.log('Please install MetaMask!');
    }
  }