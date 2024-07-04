// module.exports = async () => {}

const { network, run } = require("hardhat");

// async function deployFunc(hre) {
//     log("deploying...");
// }

// module.exports.default = deployFunc;

// module.exports = async (hre) =>{
//     log("deploying...");
//     const { getNamedAccounts, deployments } = hre;
//     log(getNamedAccounts);
//     log(deployments);
// }

const { networkConfig } = require("../helper-hardhat-config");
const {devalopmentChains,DECIMALS, INITIAL_ANSWER} = require("../helper-hardhat-config");
const {verify} = require("../utils/verify")


module.exports = async ({ getNamedAccounts, deployments }) =>{
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    const chainId = network.config.chainId;

    log("chainId:"+chainId);

    // log(deployer);
    // log(deploy);
    
    // log(networkConfig);
    
    // log(networkConfig[chainId]);
    
    let feedAddress;
    if(devalopmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        feedAddress = ethUsdAggregator.address;
    }else{
        feedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    log("feedAddress:"+feedAddress);
    log("FundMe deploying...");

    const args = [feedAddress];

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitComfirmations: network.config.blockComfirmations || 1,
    });

    //verify when  not localhost
    if(!devalopmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, args);
    }

    log("FundMe deployed!");
    log("----------------------------------------------------");

}


module.exports.tags = ["all", "fundme"]
