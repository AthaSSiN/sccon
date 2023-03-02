const Web3 = require("web3");
const contract = require("@truffle/contract");
const { randE, to256Bytes, toBytes } = require('./rsa');
const { evaluate, verify } = require('./vdf');
const { BigNumber } = require("@ethersproject/bignumber");

async function run() {
    const provider1 = new Web3.providers.WebsocketProvider("http://127.0.0.1:9545/")
    const web3_1 = new Web3(provider1);
    accounts1 = await web3_1.eth.getAccounts();

    const contractArtifact = require("../metacoin/build/contracts/MetaCoin.json");
    const MyContract = contract(contractArtifact);
    MyContract.setProvider(provider1);
    let instance = await MyContract.deployed();

    async function listen_events() {
        instance.MineVDF(async (error, result) => {
            if (error) console.log(error);
            // console.log(result);
            const g = BigNumber.from(result.returnValues.input);
            const t = Number(result.returnValues.delay);
            const proof = evaluate(g, t);
            // console.log(proof);
            console.log(verify(g, t, proof));

            let res = await instance.verifyTree.call(to256Bytes(proof.pi), to256Bytes(proof.y), to256Bytes(proof.q), '0x', proof.challenge.nonce, { from: accounts1[0] });

            // await instance.primeEmit(async (error, result) => {
            //     console.log("hi");
            //     console.log(BigNumber.from(result.returnValues.l).toString());
            //     console.log((result.returnValues))
            // });

            console.log(res);
            // console.log(g);
        })
    }

    listen_events();

    let res = await instance.beginConsensus(accounts1[1], 5, { from: accounts1[0] });
} 

run();