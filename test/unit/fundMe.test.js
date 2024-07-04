const {deployments, getNamedAccounts, ethers} = require("hardhat");
const { assert, expect} = require("chai");


describe("fundMe", async function(){
    console.log("~~~~~~~~1~~~~~~~~");

    //before, deploy our contract
    let fundMe,deployer,mockV3Aggregator;
    // const sendValue = "1000000000000000000";
    console.log("ethers.parseEther():"+ethers.parseEther("1"));
    console.log("~~~~~~~~1.2~~~~~~~~");
    const sendValue = ethers.parseEther("1");
    beforeEach(async function(){
        //export all tags
        // const accounts = await ethers.getSigners();
        // const accountOne = accounts[0];
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer);
        console.log("~~~~~~~~1.5~~~~~~~~");
    });

    describe("constructor", async function(){
        console.log("~~~~~~~~2~~~~~~~~");
        it("set constructor param:address correctly",async function(){
            const response = await fundMe.priceFeed();
            console.log("response:"+response);
            assert.equal(response, mockV3Aggregator.target);
        })
    })

    describe("fund", async function(){
        console.log("······························")
        it("failed if don't send enough eth", async function(){
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        })
        // 
        it("update addressToAmountFunded map struct", async function (){
            await fundMe.fund({value: sendValue});
            // console.log("deployer.address:"+deployer);
            const response = await fundMe.addressToAmountFunded(deployer);
            // console.log("response:"+response);
            assert.equal(response.toString(), sendValue.toString());
        })
        it("set funders correctly", async function (){
            await fundMe.fund({value: sendValue});

            const response = await fundMe.funders(0);

            assert.equal(response, deployer);
        })
    })

    describe("withdraw", async function(){
        beforeEach(async function(){
            await fundMe.fund({value: sendValue});
            console.log("~~~~~~~~withdraw~~~~~~~~");
        })
        it("withdraw from a single funder", async function(){
            //arrange
            const startFundMeBalance = await ethers.provider.getBalance(fundMe.target);
            
            const startDeployerBalance = await fundMe.runner.provider.getBalance(deployer);
            // console.log("startFundMeBalance:"+startFundMeBalance+" , startDeployerBalance:"+startDeployerBalance);

            //ACT
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);

            //  // "ethers": "^6.13.1",
            const { gasUsed, gasPrice } = transactionReceipt;
            // console.log("gasUsed:"+gasUsed,", effectiveGasPrice:"+gasPrice);
            const gasCost = gasUsed * gasPrice;
            // console.log("ethers.BigNumber.from-gasCost:"+gasCost);

            const endFundMeBalance = await fundMe.runner.provider.getBalance(fundMe.target);
            const endDeployerBalance = await ethers.provider.getBalance(deployer);
            
            // console.log("endFundMeBalance:"+endFundMeBalance+" , endDeployerBalance:"+endDeployerBalance+" , gasCost:"+gasCost);

            //assert
            assert.equal(endFundMeBalance, 0);

            assert.equal(startFundMeBalance + startDeployerBalance, endDeployerBalance + gasCost);


        })

        it("allow us to withdraw with multiple funders", async function(){
            const accounts = await ethers.getSigners();
            console.log(accounts.length)
            for(let i=0;i<6;i++){
                const fundMeConnectContract = await fundMe.connect(accounts[i]);

                await fundMeConnectContract.fund({value: sendValue});
            }

            const startFundMeBalance = await ethers.provider.getBalance(fundMe.target);
            
            const startDeployerBalance = await fundMe.runner.provider.getBalance(deployer);

             //ACT
             const transactionResponse = await fundMe.withdraw();
             const transactionReceipt = await transactionResponse.wait(1);

             const { gasUsed, gasPrice } = transactionReceipt;
             const gasCost = gasUsed * gasPrice;

             const endFundMeBalance = await fundMe.runner.provider.getBalance(fundMe.target);
             const endDeployerBalance = await ethers.provider.getBalance(deployer);

             assert.equal(endFundMeBalance, 0);
             assert.equal(startFundMeBalance + startDeployerBalance, endDeployerBalance + gasCost);

            //assert
            await expect(fundMe.funders(0)).to.be.reverted;

            for(i=1;i<6;i++){
                const addressValue = await fundMe.addressToAmountFunded(accounts[i].address);
                assert.equal(addressValue, 0);
            }

        })

        it("only allow owner to withdraw", async function(){
            const accounts = await ethers.getSigners();
            //assume accounts 1 is attacker
            const attackerConnectContract = await fundMe.connect(accounts[1]);
            await expect(attackerConnectContract.withdraw()).to.be.revertedWithCustomError(fundMe,"FundMe_onlyOwner");
        })


    })

    describe("cheaperWithdraw", async function(){
        beforeEach(async function(){
            await fundMe.fund({value: sendValue});
            console.log("~~~~~~~~cheaperWithdraw~~~~~~~~");
        })
        it("withdraw from a single funder", async function(){
            //arrange
            const startFundMeBalance = await ethers.provider.getBalance(fundMe.target);
            
            const startDeployerBalance = await fundMe.runner.provider.getBalance(deployer);
            // console.log("startFundMeBalance:"+startFundMeBalance+" , startDeployerBalance:"+startDeployerBalance);

            //ACT
            const transactionResponse = await fundMe.cheaperWithdraw();
            const transactionReceipt = await transactionResponse.wait(1);

            //  // "ethers": "^6.13.1",
            const { gasUsed, gasPrice } = transactionReceipt;
            // console.log("gasUsed:"+gasUsed,", effectiveGasPrice:"+gasPrice);
            const gasCost = gasUsed * gasPrice;
            // console.log("ethers.BigNumber.from-gasCost:"+gasCost);

            const endFundMeBalance = await fundMe.runner.provider.getBalance(fundMe.target);
            const endDeployerBalance = await ethers.provider.getBalance(deployer);
            
            // console.log("endFundMeBalance:"+endFundMeBalance+" , endDeployerBalance:"+endDeployerBalance+" , gasCost:"+gasCost);

            //assert
            assert.equal(endFundMeBalance, 0);

            assert.equal(startFundMeBalance + startDeployerBalance, endDeployerBalance + gasCost);


        })

        it("allow us to withdraw with multiple funders", async function(){
            const accounts = await ethers.getSigners();
            console.log(accounts.length)
            for(let i=0;i<6;i++){
                const fundMeConnectContract = await fundMe.connect(accounts[i]);

                await fundMeConnectContract.fund({value: sendValue});
            }

            const startFundMeBalance = await ethers.provider.getBalance(fundMe.target);
            
            const startDeployerBalance = await fundMe.runner.provider.getBalance(deployer);

             //ACT
             const transactionResponse = await fundMe.cheaperWithdraw();
             const transactionReceipt = await transactionResponse.wait(1);

             const { gasUsed, gasPrice } = transactionReceipt;
             const gasCost = gasUsed * gasPrice;

             const endFundMeBalance = await fundMe.runner.provider.getBalance(fundMe.target);
             const endDeployerBalance = await ethers.provider.getBalance(deployer);

             assert.equal(endFundMeBalance, 0);
             assert.equal(startFundMeBalance + startDeployerBalance, endDeployerBalance + gasCost);

            //assert
            await expect(fundMe.funders(0)).to.be.reverted;

            for(i=1;i<6;i++){
                const addressValue = await fundMe.addressToAmountFunded(accounts[i].address);
                assert.equal(addressValue, 0);
            }

        })

        it("only allow owner to withdraw", async function(){
            const accounts = await ethers.getSigners();
            //assume accounts 1 is attacker
            const attackerConnectContract = await fundMe.connect(accounts[1]);
            await expect(attackerConnectContract.cheaperWithdraw()).to.be.revertedWithCustomError(fundMe,"FundMe_onlyOwner");
        })


    })




})