import { Stack } from "@mui/material"
import { BigNumber, ethers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import {
  daiAddress,
  erc20Abi,
  rewardTokenAbi,
  rewardTokenAddress,
  stakingAbi,
  stakingAddress
} from "../constants/constants"
import StakeForm from "./StakeForm"

export default function StakeDetails() {
  const { account, isWeb3Enabled, network } = useMoralis()
  const [rtBalance, setRtBalance] = useState("0")
  const [stakeBalance, setStakeBalance] = useState("0")
  const [earnedBalance, setEarnedBalance] = useState("0")
  const [daiBalance, setDaiBalance] = useState("0")
  const [stakeAmount, setStakeAmount] = useState("0")

  const { runContractFunction: getRtBalance } = useWeb3Contract({
    abi: rewardTokenAbi,
    contractAddress: rewardTokenAddress,
    functionName: "balanceOf",
    params: {
      account: account,
    },
  })

  const { runContractFunction: getDaiBalance } = useWeb3Contract({
    abi: erc20Abi,
    contractAddress: daiAddress,
    functionName: "balanceOf",
    params: {
      account: account,
    },
  })

  const { runContractFunction: getStakeBalance } = useWeb3Contract({
    abi: stakingAbi,
    contractAddress: stakingAddress,
    functionName: "getStaked",
    params: {
      account: account,
    },
  })

  const { runContractFunction: getEarned } = useWeb3Contract({
    abi: stakingAbi,
    contractAddress: stakingAddress,
    functionName: "earned",
    params: {
      user: account,
    },
  })

  const updateUiValues = useCallback(async () => {
    const rtBalanceContract =
      ((await getRtBalance({
        onError: (error) => {
          console.log(error)
        },
      })) as BigNumber) ?? BigNumber.from("0")

    const rtBalance_ = ethers.utils.formatUnits(rtBalanceContract, "ether")
    setRtBalance(rtBalance_)

    const stakingBalanceContract =
      ((await getStakeBalance({
        onError: (error) => {
          console.log(error)
        },
      })) as BigNumber) ?? BigNumber.from("0")

    const stakingBalance_ = ethers.utils.formatUnits(stakingBalanceContract, "ether")
    setStakeBalance(stakingBalance_)

    const daiBalanceContract =
      ((await getDaiBalance({
        onError: (error) => {
          console.log(error)
        },
      })) as BigNumber) ?? BigNumber.from("0")

    const daiBalance_ = ethers.utils.formatUnits(daiBalanceContract, "ether")
    setDaiBalance(daiBalance_)

    console.log(`get earned ${account}`)

    const earnedContract =
      ((await getEarned({
        onError: (error) => {
          console.log(error)
        },
      })) as BigNumber) ?? BigNumber.from("0")

    const earned_ = ethers.utils.formatUnits(earnedContract, "ether")
    setEarnedBalance(earned_)
  }, [account, getDaiBalance, getEarned, getRtBalance, getStakeBalance])

  useEffect(() => {
    if (isWeb3Enabled && account) {
      updateUiValues()
    }
  }, [account, isWeb3Enabled, network, updateUiValues])

  return (
    <Stack spacing={"20px"}>
      <div>Dai balance: {daiBalance}</div>
      <div>RewardToken balance: {rtBalance}</div>
      <div>Stake balance: {stakeBalance}</div>
      <div>Rewards earned: {earnedBalance}</div>
      <div></div>
      <StakeForm />
    </Stack>
  )
}
