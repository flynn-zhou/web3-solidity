//avva
const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x11113123112111111111111111",
    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    //31337?

}

//test local chain
const devalopmentChains = ["hardhat","localhost"]

//MOCK PARAMS
const DECIMALS = 8;
const INITIAL_ANSWER = 300000000000;

module.exports = {
    networkConfig, devalopmentChains, DECIMALS, INITIAL_ANSWER
}