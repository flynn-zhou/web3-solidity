const { network } = require("hardhat");
const {devalopmentChains,DECIMALS, INITIAL_ANSWER} = require("../helper-hardhat-config");


module.exports = async ({ getNamedAccounts, deployments }) =>{
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const name = network.name;
    if(devalopmentChains.includes(name)){
        log("local network detected! deploying Mocks...");
        log("deployer:"+deployer);
        log("deployer.length:"+deployer.length);

        await deploy("MockV3Aggregator",  {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })

        log("Mocks deployed!");
        log("----------------------------------------------------");

    }

}

//添加标记
module.exports.tags = ["all", "Mocks"]