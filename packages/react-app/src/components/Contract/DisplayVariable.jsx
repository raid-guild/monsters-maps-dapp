/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import { Box, Heading, HStack } from "@chakra-ui/react";
import tryToDisplay from "./utils";

const DisplayVariable = ({ contractFunction, functionInfo, refreshRequired, triggerRefresh}) => {
  const [variable, setVariable] = useState("");

  const refresh = useCallback(async () => {
    try {
      const funcResponse = await contractFunction();
      setVariable(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setVariable, contractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, contractFunction]);

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
          d: "inline-flex",
          flex: "1 1 66%",
          fontSize: 24
        }}>
          <span>{tryToDisplay(variable)}</span>
        </Box>
      </Box>
    </Box>
  );
};

export default DisplayVariable;
