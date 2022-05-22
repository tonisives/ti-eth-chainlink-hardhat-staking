import { deployments, ethers, getNamedAccounts } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { ERC20 } from "../typechain-types"

const deployFunction: DeployFunction = async () => {
  const { deploy } = deployments
  // from hardhat.config.ts
  const deployer = (await getNamedAccounts())["deployer"]

  // most recently deployed RewardToken contract
  const rewardToken:ERC20 = await ethers.getContract("RewardToken")
  const dai = await ethers.getContract("DAI")

  // name of the contract: RewardToken
  const staking = await deploy("Staking", {
    from: deployer,
    // TODO: why are these the same here? shouldn't it be DAI?
    args: [dai.address, rewardToken.address], // no constructor arguments
    log: true,
  })

  // send all the reward tokens to the staking contract
  const totalRewardTokenSupply = await rewardToken.totalSupply()
  await rewardToken.approve(deployer, totalRewardTokenSupply)
  await rewardToken.transferFrom(deployer, staking.address, totalRewardTokenSupply)
}

export default deployFunction
deployFunction.tags = ["all", "staking"]
