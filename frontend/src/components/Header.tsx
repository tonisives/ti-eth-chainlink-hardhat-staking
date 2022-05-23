import { Stack } from "@mui/material"
import { ConnectButton } from "web3uikit"

export const Header = () => {
  return (
    <div>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <h1>Staking app</h1>
        <div>
          <ConnectButton moralisAuth={false} />
        </div>
      </Stack>
      <hr />
    </div>
  )
}
