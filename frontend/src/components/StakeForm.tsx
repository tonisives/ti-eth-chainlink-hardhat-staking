import { Alert, Button, Snackbar, Stack, TextField } from "@mui/material"
import { ethers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract, Web3ExecuteFunctionParameters } from "react-moralis"
import { daiAddress, erc20Abi, stakingAbi, stakingAddress } from "../constants/constants"

let approveOptions: Web3ExecuteFunctionParameters = {
  abi: erc20Abi,
  contractAddress: daiAddress,
  functionName: "approve",
}

let stakeOptions: Web3ExecuteFunctionParameters = {
  abi: stakingAbi,
  contractAddress: stakingAddress,
  functionName: "stake",
}

export default function StakeForm() {
  const { account, isWeb3Enabled } = useMoralis()
  const [stakeAmount, setStakeAmount] = useState("0")
  const [error, setError] = useState<String | undefined>(undefined)

  const updateUiValues = useCallback(async () => {}, [])

  const handleApproveSuccess = async () => {
    stakeOptions.params = {
      amount: ethers.utils.parseEther(stakeAmount),
    }

    const tx = (await stakeCall({
      params: stakeOptions,
      onError: (txError) => {
        console.log(txError)
        setError(txError.message)
      },
    })) as any
    await tx.wait(1)
    console.log("tx has been confirmed by 1 block")
  }

  const approveAndStake = async () => {
    approveOptions.params = {
      _value: ethers.utils.parseEther(stakeAmount),
      _spender: stakingAddress,
    }

    await approveCall({
      params: approveOptions,
      onError: (txError) => {
        console.log(txError)
        setError(txError.message)
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
        <Snackbar
          open={error !== undefined}
          autoHideDuration={5000}
          onClose={() => setError(undefined)}
          anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
          }}
        >
          <Alert onClose={() => setError(undefined)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  )
}
