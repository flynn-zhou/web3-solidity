const { getNamedAccounts, ethers } = require("hardhat");

async function main(){
    
    const {deployer} = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    
    //fundMe.runner.provider.getBalance()
    const startFundMeBalance = await ethers.provider.getBalance(fundMe.target);
    console.log("cheaperWithdraw..., startFundMeBalance:"+startFundMeBalance);

    const transactionResponse = await fundMe.cheaperWithdraw();
    await transactionResponse.wait(1);

    const endFundMeBalance = await ethers.provider.getBalance(fundMe.target);

    console.log("Got it back! endFundMeBalance:"+endFundMeBalance);

}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error)
    process.exit(1)
});