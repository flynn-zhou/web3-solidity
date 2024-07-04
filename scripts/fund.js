const { getNamedAccounts, ethers } = require("hardhat");


async function main(){
    const {deployer} = await getNamedAccounts();

    const fundMe = await ethers.getContract("FundMe", deployer);

    
    const startFundMeBalance = await ethers.provider.getBalance(fundMe.target);
    console.log("fund..., startFundMeBalance:"+startFundMeBalance);

    const transactionResponse = await fundMe.fund({value: ethers.parseEther("0.1")});
    await transactionResponse.wait(1);

    
    const endFundMeBalance = await ethers.provider.getBalance(fundMe.target);
    console.log("funded! endFundMeBalance:"+endFundMeBalance);

}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error)
    process.exit(1)
});