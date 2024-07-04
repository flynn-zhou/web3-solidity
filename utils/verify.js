const { run } = require("hardhat");
const { modules } = require("web3")

async function verify(contractAddress, args){
    console.log("verifying contract...");
    try{
        await run("verify:verify",{
            address: contractAddress,
            constructorArguments: args,
        })
    }catch(e){
        if(e.message.toLowerCase().includes("already verifyed")){
            console.log("already verifyed!,");
        }else{
            console.log(e);
        }
    }
    
}

module.exports = {verify}
