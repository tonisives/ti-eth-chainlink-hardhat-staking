import { Stack } from "@mui/material"
import type { NextPage } from "next"
import { Header } from "../components/Header"
import StakeDetails from "../components/StakeDetails"

const Home: NextPage = () => {
  return (
    <Stack p={"20px"} spacing={"20px"}>
      <Header />
      <StakeDetails />
    </Stack>
  )
}

export default Home
