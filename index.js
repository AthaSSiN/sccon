const Web3 = require("Web3");
const contract = require("@truffle/contract");

async function run() {
    const provider1 = new Web3.providers.WebsocketProvider("http://127.0.0.1:9545/")
    const web3_1 = new Web3(provider1);
    accounts1 = await web3_1.eth.getAccounts();

    const contractArtifact = require("../metacoin/build/contracts/MetaCoin.json");
    const MyContract = contract(contractArtifact);
    MyContract.setProvider(provider1);
    let instance = await MyContract.deployed();

    async function listen_events() {
        instance.Transfer({}, (error, result) => {
            if (error) console.log(error);
            console.log(result.returnValues._value);
        })
    }

    listen_events();

    let res = await instance.sendCoin(accounts1[1], 5, { from: accounts1[0] });
} 

run();
console.log("foj");