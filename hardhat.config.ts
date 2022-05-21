import "@nomiclabs/hardhat-waffle"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/types"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6", // used in chainlink contracts
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0, // ethers built in account at index 0
    },
  },
}

export default config
