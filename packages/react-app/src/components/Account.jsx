import React from "react";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { Box, HStack, Button } from "@chakra-ui/react";
// import { useThemeSwitcher } from "react-css-theme-switcher";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          size="sm"
          sx={{ verticalAlign: "top", marginLeft: 8, marginTop: 0 }}
          onClick={logoutOfWeb3Modal}
        >
          Disconnect
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          size="sm"
          sx={{ verticalAlign: "top", marginLeft: 8, marginTop: 0 }}
          onClick={loadWeb3Modal}
        >
          Connect
        </Button>,
      );
    }
  }

  // const { currentTheme } = useThemeSwitcher();

  const display = minimized ? (
    ""
  ) : (
      <>
      {address ? <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} /> : "Connecting..."}
        {/* <Balance address={address} provider={localProvider} price={price} /> */}
        {/* <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} /> */}
      </>
  );

  return (
    <HStack>
      {display}
      {modalButtons}
    </HStack>
  );
}
