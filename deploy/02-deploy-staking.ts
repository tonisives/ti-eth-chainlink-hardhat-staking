import { deployments, ethers, getNamedAccounts } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

const deployFunction: DeployFunction = async () => {
  const { deploy } = deployments
  // from hardhat.config.ts
  const deployer = (await getNamedAccounts())["deployer"]

  // most recently deployed RewardToken contract
  const rewardToken = await ethers.getContract("RewardToken")
  const dai = await ethers.getContract("DAI")

  // name of the contract: RewardToken
  const staking = await deploy("Staking", {
    from: deployer,
    // TODO: why are these the same here? shouldn't it be DAI?
    args: [rewardToken.address, rewardToken.address], // no constructor arguments
    log: true,
  })
}

export default deployFunction
deployFunction.tags = ["all", "staking"]
