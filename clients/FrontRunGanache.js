const Web3 = require('web3');
const ganache = require("ganache");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = require("../secrets.json").mnemonic;

const prompt = require('prompt');
const WETH = require("../build/contract/WETH.json");
const PancakeRouter = require("../build/contract/pancakeRouter.json");
const PancakeFactory = require("../build/contract/pancakeFactory.json");

const ERC20 = require("../build/contract/ERC20.json");
const BN = require("bn.js");
const options = {"fork":"https://speedy-nodes-nyc.moralis.io/346380c8eca1a345a08fbdc8/bsc/mainnet"};
const provider = ganache.provider(options);

const web3 = new Web3(provider);

let address = null;
let amount = null;

const init = async() => {
    address = await web3.eth.getAccounts();
    console.log(address);
    //balance
    amount = await web3.eth.getBalance("0xB0A478255452F7D7401dE860415cC1038113a8eA");
    console.log(amount);
}

init();