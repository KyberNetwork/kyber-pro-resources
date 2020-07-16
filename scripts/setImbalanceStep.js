require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
require('dotenv').config();
var FPR = require("kyber-fpr-sdk");
var Web3 = require("web3");
const utils = require("./utils.js");
var convertToTWei = utils.convertToTwei;
var addresses = require("./addresses.json");
const KTTokenAddress = "0xc376079608C0F17FE06b9e950872666f9c3C3DA4";
 
const provider = new Web3.providers.HttpProvider(process.env.TESTNET_NODE_URL);
const web3 = new Web3(provider);
const operator = web3.eth.accounts.privateKeyToAccount(process.env.TEST_OPERATOR_PRIVATE_KEY);
const reserveManager = new FPR.Reserve(web3, addresses);
web3.eth.accounts.wallet.add(operator);
 
function toStepFuncData(steps) {
   //convert each steps.buy element into StepFunctionDataPoint
   const buy = steps.buy.map(e=>new FPR.StepFunctionDataPoint(e.x,e.y));
   // convert each steps.sell element into StepFunctionDataPoint
   const sell = steps.sell.map(e=>new FPR.StepFunctionDataPoint(e.x,e.y));
   return {buy:buy, sell:sell};
};
steps = {
   "buy":[
       {"x": convertToTWei(100), "y": 0},
       {"x": convertToTWei(200), "y": -30}
   ],
   "sell":[
      {"x": convertToTWei(0), "y": 0},
      {"x": convertToTWei(-100), "y": -30}
   ]
};
var stepsData = toStepFuncData(steps);
 
(async () => {
   
   //setQtyStepFunction is a only operator function 
   console.log("setting imbalance step func's");
   await reserveManager.setImbalanceStepFunction(operator.address, KTTokenAddress, stepsData.buy, stepsData.sell);
   console.log("done");
})();
 