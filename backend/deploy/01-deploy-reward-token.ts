import { deployments, getNamedAccounts } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

const deployFunction: DeployFunction = async () => {
  const { deploy } = deployments
  // from hardhat.config.ts
  const { deployer } = await getNamedAccounts()
  // name of the contract: RewardToken
  const rewardtoken = await deploy("RewardToken", {
    from: deployer,
    args: [], // no constructor arguments
    log: true,
  })
}

export default deployFunction
deployFunction.tags = ["all", "rewardtoken"]
