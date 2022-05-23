import { createTheme, CssBaseline, Stack, ThemeProvider } from "@mui/material"
import { MoralisProvider } from "react-moralis"
import { Header } from "./components/Header"
import StakeDetails from "./components/StakeDetails"

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
})

function App() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack p={"20px"} spacing={"20px"}>
          <Header />
          <StakeDetails />
        </Stack>
      </ThemeProvider>
    </MoralisProvider>
  )
}

export default App
