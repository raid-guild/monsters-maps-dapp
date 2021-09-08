import React, { useMemo, useState } from "react";
import { Card } from "antd";
import { Box, HStack, Heading } from "@chakra-ui/react";
import { useContractLoader, useContractExistsAtAddress } from "../../hooks";
import Account from "../Account";
import Address from "../Address";
import DisplayVariable from "./DisplayVariable";
import FunctionForm from "./FunctionForm";

const noContractDisplay = (
  <Box>
    Loading...{" "}
  </Box>
);

const isQueryable = fn => (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;

export default function Contract({ customContract, readContract, account, gasPrice, signer, provider, name, show, price, blockExplorer }) {

  const contracts = useContractLoader(provider);
  let contract
  if(!customContract){
    contract = contracts ? contracts[name] : "";
  }else{
    contract = customContract
  }

  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);

  const displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
          )
        : [],
    [contract, show],
  );

  const [refreshRequired, triggerRefresh] = useState(false)
  const contractDisplay = displayedContractFunctions.map(fn => {
    if (isQueryable(fn)) {
      // If there are no inputs, just display return value
      return <DisplayVariable key={fn.name} contractFunction={contract[fn.name]} functionInfo={fn} refreshRequired={refreshRequired} triggerRefresh={triggerRefresh}/>;
    }
    // If there are inputs, display a form to allow users to provide these
    return (
      <FunctionForm
        key={"FF" + fn.name}
        contractFunction={(fn.stateMutability === "view" || fn.stateMutability === "pure")?contract[fn.name]:contract.connect(signer)[fn.name]}
        functionInfo={fn}
        provider={provider}
        gasPrice={gasPrice}
        triggerRefresh={triggerRefresh}
      />
    );
  });

  return (
    <Box sx={{
      margin: "auto", flex: "0 0 49%", width: "49%", color: "primaryAlpha.200", bg: "secondaryAlpha.100",
      borderRadius: "8px",
      overflow: "hidden",
      ".ant-card": {
        border: "0px solid transparent",
        color: "primaryAlpha.200",
      }
    }}>
      <Card
        title={
          <Box d="flex" flexFlow="row nowrap" alignContent="center" justifyContent="space-between">
            <Heading size="lg">{name} Contract</Heading>
            <Box>
              <Address
                address={address}
                mainnetProvider={provider}
                blockExplorer={blockExplorer}
              />
              {/* {account} */}
            </Box>
          </Box>
        }
        size="large"
        style={{ marginTop: 25, width: "100%", backgroundColor: "transparent" }}
        loading={contractDisplay && contractDisplay.length <= 0}
      >
        {contractIsDeployed ? contractDisplay : noContractDisplay}
      </Card>
    </Box>
  );
}
