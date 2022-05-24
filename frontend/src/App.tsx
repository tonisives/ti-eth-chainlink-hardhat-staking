import { createTheme, CssBaseline, Stack, ThemeProvider } from "@mui/material"
import { MoralisProvider } from "react-moralis"
import { Header } from "./components/Header"
import StakeDetails from "./components/StakeDetails"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#212121",
      paper: "#424242",
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
