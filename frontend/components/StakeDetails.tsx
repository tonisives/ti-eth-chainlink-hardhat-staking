import { BigNumber, ethers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { rewardTokenAbi, rewardTokenAddress } from "../constants/constants"

export default function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis()
  const [rtBalance, setRtBalance] = useState("0")

  const { runContractFunction: getRtBalance } = useWeb3Contract({
    abi: rewardTokenAbi,
    contractAddress: rewardTokenAddress,
    functionName: "balanceOf",
    params: {
      account: account,
    },
  })

  const updateUiValues = useCallback(async () => {
    const rtBalanceFromContract =
      ((await getRtBalance({
        onError: (error) => {
          console.log(error)
        },
      })) as BigNumber) ?? BigNumber.from("0")
      
    const formattedRtBalanceFromContract = ethers.utils.formatUnits(rtBalanceFromContract, "ether")
    setRtBalance(formattedRtBalanceFromContract)
  }, [])

  useEffect(() => {
    if (isWeb3Enabled && account) updateUiValues()
  }, [updateUiValues, account, isWeb3Enabled])

  return (
    <div>
      <div>RewardToken balance: {rtBalance}</div>
    </div>
  )
}
