const Web3 = require('web3');
const ganache = require("ganache-cli");
//const HDWalletProvider = require('@truffle/hdwallet-provider');
//const mnemonic = require("../secrets.json").mnemonic;

const prompt = require('prompt');
const WETH = require("../build/contract/WETH.json");
const PancakeRouter = require("../build/contract/pancakeRouter.json");
const PancakeFactory = require("../build/contract/pancakeFactory.json");

const ERC20 = require("../build/contract/ERC20.json");
const BN = require("bn.js");
require('dotenv').config();

prompt.start();
//https://speedy-nodes-nyc.moralis.io/346380c8eca1a345a08fbdc8/bsc/mainnet

var provider = new Web3.providers.HttpProvider('http://31.220.108.168:8541/');
const web3 = new Web3 (provider);
let BUSD = "0xfc38b4e4840aca306c31891BB01E76E0979145Eb";//"0x78867bbeef44f2326bf8ddd1941a4439382ef2a7";
let address = null;
let amount = null;
let path = null;
let slipAmount = null
prompt.get(['amount', 'path','slip'], function (err, result) {

    if (err) {
      return onErr(err);
    }
    console.log('Command-line input received:');
    amount = parseFloat(result.amount);
    console.log('  amount: ' + amount);
    path = result.path;
    console.log('  path: ' + path);
    slipAmount = parseFloat(result.slip)/100;
    console.log("Slippage:-",slipAmount)
    init();
  });
  
  function onErr(err) {
    console.log(err);
    return 1;
  }
const init = async() => {
    let pancakeswaprouter = null;
    let pancakefact = null;
    let firstConfirm = 0;
    
    let wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";//"0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
    let bether = "0x8babbb98678facc7342735486c851abd7a0d17ca";
    let usdt = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684";

    address = await web3.eth.getAccounts();
    const id = await web3.eth.net.getId();
    const weth_contract = new web3.eth.Contract(
        WETH.abi,
        wbnb
    );
    const weth_totalBalance = await weth_contract.methods.totalSupply().call({from:address[0]});

    // get the balance of the current testnet account
    const account_balance = await web3.eth.getBalance(address[0]);
    const account_two_balance = await web3.eth.getBalance(address[2]);
    console.log(address[0]);
    console.log(address[1]);
    console.log("Account Balance:-",account_balance)
    console.log("Account two Balance:-",account_two_balance)
    console.log("Weth Balance:-",weth_totalBalance);
    // get GasPrice
    const gasvPrice = await web3.eth.getGasPrice();
    console.log("Estimated GasPrice:-",web3.utils.fromWei(gasvPrice, 'ether'));
       
    //Carry out the swap
    swapToken(amount,[wbnb,path],slipAmount);
    
    //sendTrx();
    
    //sleep(500).then(() =>{swapThruBot([wbnb,bether,usdt],"100000000000000","53386219104566415");})
   // sleep(2000).then(() =>{swapBackThruBot([wbnb,bether,usdt]);})
    
}
const sleep  = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}


const swapToken = async (amountIn,path,slip) => {
    console.log("Address:-",address[0]);
    let router = new web3.eth.Contract(
        PancakeRouter.abi,
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );
    let BUSD_ERC20 = new web3.eth.Contract(
        ERC20.abi,
        path[path.length-1]
    );


    try {
     return router.methods.getAmountsOut(
            web3.utils.toWei(amountIn.toString(),'ether') ,
            path
        ).call({from:address[0]}).then(async getAmountMin=> {
            console.log("Amount-MinOut:-",parseInt(getAmountMin[path.length-1]));
            let amountMin = parseInt(getAmountMin[path.length-1]);
            let Slippage = amountMin-(amountMin*parseFloat(slip));
            console.log('Slipage Amount:-',Slippage);
            try {
                let swapBUSD = await router.methods.swapExactETHForTokens(
                    Slippage.toString().split('.')[0],
                    path,
                    address[0],
                    Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],value:web3.utils.toWei(amountIn.toString(),'ether'),gas:300000,gasPrice:10000000000});
                console.log("Swap Report:-",swapBUSD);  

                //SwapBack

                let amountTokenIn = await BUSD_ERC20.methods.balanceOf(address[0]).call({from:address[0]});
                console.log("Amount of TOken Recieved:-",amountTokenIn.toString());

                return BUSD_ERC20.methods.approve("0x10ED43C718714eb63d5aA57B78B54704E256024E",amountTokenIn).send({from:address[0]}).then(async result=> {
                    console.log("Approve Contract:-",result);
                    let swapBUSDToBNB = await router.methods.swapExactTokensForETH(
                        amountTokenIn,
                        0,
                        path.reverse(),
                        address[0],
                        Math.floor(Date.now() / 1000) + 60 * 10).send({from:address[0],gas:300000,gasPrice:10000000000});
                    }).catch (error => {
                        console.error("Er-ror",error)
                    });
            } catch (error) {
                console.error("Error",error)
            }
            
        });

    } catch (err) {
        console.error(err);
        
    }

}



