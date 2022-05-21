import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert } from "chai"
import { BigNumber, Contract } from "ethers"
import { deployments, ethers } from "hardhat"
import { advanceBlocks, increaseTime } from "./utils/utils"

const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_YEAR = 31449600

describe("Staking Test", async function () {
  let staking: Contract,
    rewardToken: Contract,
    deployer: SignerWithAddress,
    stakeAmount: BigNumber,
    dai: Contract

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    deployer = await accounts[0]
    // run all the deployments
    await deployments.fixture(["all"])
    staking = await ethers.getContract("Staking")
    rewardToken = await ethers.getContract("RewardToken")
    stakeAmount = ethers.utils.parseEther("100000")
    dai = await ethers.getContract("DAI")
  })

  it("sets reward token address correctly", async () => {
    const response = await staking.s_rewardToken()
    assert(response === rewardToken.address)
  })

  it("Allows users to stake and claim rewards", async () => {
    // approve staking contract to take tokens from reward token(from msg.sender balance)
    await rewardToken.approve(staking.address, stakeAmount)
    await staking.stake(stakeAmount)
    const startingEarned = await staking.earned(deployer.address)
    console.log(`Earned in start ${startingEarned}`)

    increaseTime(SECONDS_IN_A_YEAR)
    advanceBlocks(1)

    const endingEarned = await staking.earned(deployer.address)

    assert(endingEarned > startingEarned)
    console.log(`Earned in the end ${endingEarned}`)
  })
})
