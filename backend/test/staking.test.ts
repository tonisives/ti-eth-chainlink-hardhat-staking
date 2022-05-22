import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert } from "chai"
import { BigNumber } from "ethers"
import { deployments, ethers } from "hardhat"
import { ERC20, RewardToken, Staking } from "../typechain-types"
import { advanceBlocks, increaseTime } from "./utils/utils"


const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_YEAR = 31449600

describe("Staking Test", async function () {
  let staking: Staking,
    rewardToken: RewardToken,
    deployer: SignerWithAddress,
    stakeAmount: BigNumber,
    dai: ERC20

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    deployer = await accounts[0]
    // run all the deployments
    await deployments.fixture(["mocks", "rewardtoken", "staking"])
    staking = await ethers.getContract("Staking")
    rewardToken = await ethers.getContract("RewardToken")
    dai = await ethers.getContract("DAI")
    stakeAmount = ethers.utils.parseEther("100000")
  })

  it("sets reward token address correctly", async () => {
    const response = await staking.s_rewardToken()
    assert(response === rewardToken.address)
  })

  it("returns 1 reward token based on time spent locked up", async () => {
    await dai.approve(staking.address, stakeAmount)
    await staking.stake(ethers.utils.parseEther("1"))
    // need to call this to make the test work 🤔
    await staking.earned(deployer.address)

    // rewards are 100 tokens/s. Not sure why increseTime starts working after 1000 seconds only
    await increaseTime(1000)
    await advanceBlocks(1)

    let endingEarned = await staking.earned(deployer.address)
    
    assert(endingEarned.eq(100000))

    await increaseTime(2000)
    await advanceBlocks(1)

    endingEarned = await staking.earned(deployer.address)
    assert(endingEarned.eq(300000))
  })

  it("moves tokens from the user to the staking contract", async () => {
    // 1mil tokens on init
    let initialBalance = await dai.balanceOf(deployer.address)

    assert(initialBalance.eq(ethers.utils.parseEther((1e6).toString())))
    const stakeAmount = ethers.utils.parseEther((5e5).toString())

    await dai.approve(staking.address, stakeAmount)
    await staking.stake(stakeAmount)

    let newBalance = await dai.balanceOf(deployer.address)
    let contractBalance = await dai.balanceOf(staking.address)

    assert(newBalance.eq(stakeAmount))
    assert(contractBalance.eq(stakeAmount))
  })

  it("can withdraw tokens", async () => {
    // stake and withdraw.
    // verify tokens returned to account
    await dai.approve(staking.address, stakeAmount)
    await staking.stake(stakeAmount)

    const balanceAfterStake = await dai.balanceOf(deployer.address)

    await increaseTime(SECONDS_IN_A_DAY)
    await advanceBlocks(1)

    const earned = await staking.earned(deployer.address)

    await staking.withdraw(stakeAmount)
    const balanceAfterWithdraw = await dai.balanceOf(deployer.address)
    assert(balanceAfterStake.add(stakeAmount).eq(balanceAfterWithdraw))
    assert(earned.toString() === "8600000")
  })

  it("can withdraw rewards", async () => {
    // stake and claim rewards. verify reward tokens in user account
    await dai.approve(staking.address, stakeAmount)
    
    await staking.stake(stakeAmount)

    await increaseTime(SECONDS_IN_A_DAY)
    await advanceBlocks(1)

    await staking.claimReward()
    const rewardTokenBalanceAfterWithdraw = await rewardToken.balanceOf(deployer.address)
    assert(rewardTokenBalanceAfterWithdraw.eq(86e5))
  })
})
