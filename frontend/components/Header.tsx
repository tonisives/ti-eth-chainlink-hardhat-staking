import { Stack } from "@mui/material"
import { ConnectButton } from "web3uikit"

export const Header = () => {
  return (
    <div>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <h1 className="py-4 px-4 font-bold text-3xl">Staking app</h1>
        <div className="ml-auto py-4 px-4">
          <ConnectButton moralisAuth={false} />
        </div>
      </Stack>
      <hr />
    </div>
  )
}
