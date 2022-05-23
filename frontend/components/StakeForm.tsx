import { Button, Stack, TextField } from "@mui/material"
import { BigNumber, ethers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract, Web3ExecuteFunctionParameters } from "react-moralis"
import { daiAddress, erc20Abi, stakingAbi, stakingAddress } from "../constants/constants"

export default function StakeForm() {
  const { account, isWeb3Enabled } = useMoralis()
  const [stakeAmount, setStakeAmount] = useState("0")

  let approveOptions: Web3ExecuteFunctionParameters = {
    abi: erc20Abi,
    contractAddress: daiAddress,
    functionName: "approve",
    params: {
      amount: BigNumber.from("1000000"),
      spender: stakingAddress,
    },
  }

  let stakeOptions: Web3ExecuteFunctionParameters = {
    abi: stakingAbi,
    contractAddress: stakingAddress,
    functionName: "stake",
    params: {
      amount: ethers.utils.parseEther(stakeAmount),
    },
  }


  const updateUiValues = useCallback(async () => {
    
  }, [])

  const handleApproveSuccess = async () => {
    const tx = (await stakeCall({
      onError: (error) => {
        console.log(error)
      },
    })) as any
    await tx.wait(1)
    console.log("tx has been confirmed by 1 block")
  }

  const approveAndStake = async () => {
    await approveCall({
      onError: (error) => {
        console.log(error)
      },
      onSuccess: () => {
        handleApproveSuccess()
      },
    })
  }

  const { runContractFunction: stakeCall } = useWeb3Contract(stakeOptions)
  const { runContractFunction: approveCall } = useWeb3Contract(approveOptions)

  useEffect(() => {
    if (isWeb3Enabled && account) updateUiValues()
  }, [updateUiValues, account, isWeb3Enabled])

  return (
    <>
      <h3>Stake DAI</h3>
      <Stack direction={"row"} spacing={"10px"}>
        <TextField
          value={stakeAmount}
          onChange={(event) => {
            setStakeAmount(event.currentTarget.value)
          }}
          label={"amount"}
        />
        <Button
          onClick={() => {
            approveAndStake()
          }}
        >
          Stake
        </Button>
      </Stack>
    </>
  )
}
