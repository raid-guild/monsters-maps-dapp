import React from "react";
import Blockies from "react-blockies";
import { Typography, Skeleton } from "antd";
import { useLookupAddress } from "../hooks";
import { Box, Stack, HStack } from "@chakra-ui/react";

// changed value={address} to address={address}

/*
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    ensProvider={mainnetProvider}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
*/

const { Text } = Typography;

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

export default function Address(props) {

  const address = props.value || props.address;

  const ens = useLookupAddress(props.ensProvider, address);

  // const { currentTheme } = useThemeSwitcher();

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = address.substr(0, 6);

  if (ens && ens.indexOf("0x")<0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  const etherscanLink = blockExplorerLink(address, props.blockExplorer);
  if (props.minimized) {
    return (
      <HStack sx={{
        "a": {
          color: "primaryAlpha.400"
        },
        ".ant-typography-copy": {
          color: "secondaryAlpha.900"
        }
      }}>
        <a target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          <Blockies seed={address.toLowerCase()} size={4} />
        </a>
      </HStack>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <Text editable={{ onChange: props.onChange }} copyable={{ text: address }}>
        <a target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          {displayAddress}
        </a>
      </Text>
    );
  } else {
    text = (
      <Text copyable={{ text: address }}>
        <a target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          {displayAddress}
        </a>
      </Text>
    );
  }

  return (
    <HStack sx={{
      "a": {
        color: "primaryAlpha.400"
      },
      ".ant-typography-copy": {
        color: "secondaryAlpha.900"
      }
    }}>

      <Blockies seed={address.toLowerCase()} size={4} scale={props.fontSize ? props.fontSize / 7 : 4} />
      <span style={{ paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 28 }}>{text}</span>
    </HStack>
  );
}
