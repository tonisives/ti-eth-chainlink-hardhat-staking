import { deployments, ethers, getNamedAccounts } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

const deployFunction: DeployFunction = async () => {
  const { deploy } = deployments
  // from hardhat.config.ts
  const deployer = (await getNamedAccounts())["deployer"]

  // most recently deployed RewardToken contract
  const rewardToken = await ethers.getContract("RewardToken")

  // name of the contract: RewardToken
  const stakingContract = await deploy("Staking", {
    from: deployer,
    args: [rewardToken.address, rewardToken.address], // no constructor arguments
    log: true,
  })
}

export default deployFunction
deployFunction.tags = ["all", "stakingContract"]
