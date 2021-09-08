/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { hexlify } from "@ethersproject/bytes";
import { Row, Col, Input, Divider, Tooltip, Button } from "antd";
import { Box, Heading, HStack } from "@chakra-ui/react";
import { Transactor } from "../../helpers";
import tryToDisplay from "./utils";
import Blockies from "react-blockies";
const { utils } = require("ethers");


export default function FunctionForm({ contractFunction, functionInfo, provider, gasPrice, triggerRefresh }) {
  const [form, setForm] = useState({});
  const [txValue, setTxValue] = useState();
  const [returnValue, setReturnValue] = useState();
  const [uri, setUri] = useState();

  const tx = Transactor(provider, gasPrice);
  // console.log("🍻 contract: ", contract);
  let inputIndex = 0;
  const inputs = functionInfo.inputs.map(input => {

    const key = functionInfo.name + "_" + input.name + "_" + input.type + "_" + inputIndex++

    let buttons = ""
    if (input.type === "bytes32") {
      buttons = (
        <></>
      )
    } else if (input.type === "bytes") {
      buttons = (
        <></>
      )
    } else if (input.type == "uint256") {
      buttons = (
        <></>
      )
    } else if (input.type == "address") {
      const possibleAddress = form[key]&&form[key].toLowerCase&&form[key].toLowerCase().trim()
      if(possibleAddress && possibleAddress.length==42){
        buttons = (
          <></>
        )
      }
    }


    // const onFormSubmit = async (values) => {
    //   if (currentUser && contract) {

    //     try {
    //       const muri = await contract.tokenURI(values.tokenId).call();
    //       if (muri) {
    //         const meta = atob(muri.split('base64,')[1]);
    //         setUri(JSON.parse(meta).image);
    //         return;
    //       }
    //     } catch {
    //       setUri(undefined);
    //       console.log('new monster found');
    //     }
    //   }
    // };


    return (
      <div style={{ margin: 2 }} key={key}>
        <Input
          size="large"
          placeholder={input.name ? input.type + " " + input.name : input.type}
          autoComplete="off"
          value={form[key]}
          name={key}
          onChange={(event) => {
            const formUpdate = { ...form };
            formUpdate[event.target.name] = event.target.value;
            setForm(formUpdate);
          }}
          suffix={buttons}
        />
      </div>
    )
  });

  const txValueInput = (
    <div style={{ margin: 2 }} key={"txValueInput"}>
      <Input
        placeholder="transaction value"
        onChange={e => setTxValue(e.target.value)}
        value={txValue}
        addonAfter={
          <div>
            <Row>
              <Col span={16}>
                <Tooltip placement="right" title={" * 10^18 "}>
                  <div
                    type="dashed"
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      let floatValue = parseFloat(txValue)
                      if(floatValue) setTxValue("" + floatValue * 10 ** 18);
                    }}
                  >
                    ✳️
                  </div>
                </Tooltip>
              </Col>
              <Col span={16}>
                <Tooltip placement="right" title={"number to hex"}>
                  <div
                    type="dashed"
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      setTxValue(BigNumber.from(txValue).toHexString());
                    }}
                  >
                    #️⃣
                </div>
                </Tooltip>
              </Col>
            </Row>
          </div>
        }
      />
    </div>
  );

  if (functionInfo.payable) {
    inputs.push(txValueInput);
  }

  const buttonIcon = functionInfo.type === "call" ? <Button style={{ marginLeft: -32 }}>Read📡</Button> : <Button>Mint</Button>;

  inputs.push(
    <Box sx={{ cursor: "pointer", margin: 2, flex: "0 0 auto", textAlign: "left" }} key={"goButton"}>
      <Input
        onChange={e => setReturnValue(e.target.value)}
        defaultValue=""
        bordered={false}
        disabled={true}
        value={returnValue}
        suffix={
          <div
            style={{ width: 50, height: 30, margin: 0 }}
            type="default"
            onClick={async () => {
              let innerIndex = 0
              const args = functionInfo.inputs.map((input) => {
                const key = functionInfo.name + "_" + input.name + "_" + input.type + "_" + innerIndex++
                let value = form[key]
                if(input.baseType=="array"){
                  value = JSON.parse(value)
                } else if(input.type === "bool"){
                  if(value==='true' || value==='1' || value ==="0x1"|| value ==="0x01"|| value ==="0x0001"){
                    value = 1;
                  }else{
                    value = 0;
                  }
                }
                return value
              });

              let result
              if(functionInfo.stateMutability === "view"||functionInfo.stateMutability === "pure"){
                const returned = await contractFunction(...args)
                result = tryToDisplay(returned);
              }else{
                const overrides = {};
                if (txValue) {
                  overrides.value = txValue; // ethers.utils.parseEther()
                }
                // Uncomment this if you want to skip the gas estimation for each transaction
                // overrides.gasLimit = hexlify(1200000);


                // console.log("Running with extras",extras)
                const returned = await tx(contractFunction(...args, overrides));
                result = tryToDisplay(returned);
              }


              console.log("SETTING RESULT:", result);
              setReturnValue(result);
              triggerRefresh(true);
            }}
          >
            {buttonIcon}
          </div>
        }
      />
    </Box>
  );

  if (functionInfo.name === "claim" || functionInfo.name === "discoverEncounters") {
    return (
      <Box>
        <Box d="flex">
          <Box
            sx={{
              textAlign: "right",
              opacity: 0.6,
              paddingRight: 6,
              fontSize: 24,
              flex: "0 0 33%",
              width: "33%",
            }}
          >
            {functionInfo.name}
          </Box>
          <Box sx={{
            flex: "1 1 66%",
            textAlign: "left",
          }}>
            {inputs}
          </Box>
        </Box>
        <Divider />
      </Box>
    );
  } else {
    return "";
  }
}
