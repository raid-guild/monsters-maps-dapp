import React from "react";
import { PageHeader } from "antd";
import { Box, Heading } from "@chakra-ui/react";

// displays a page header

export default function Header() {
  return (
    <Box pos="fixed" top="0" left="0" zIndex="1000" w="100vw" color="primaryAlpha.500" py={4} bg="rgba(0,0,0,0.4)" backdropFilter="blur(8px)">
      <Heading as="h1" variant="rg" size="lg" color="primaryAlpha.500">Monsters & Maps (For Adventurers)</Heading>
    </Box>
  );
}
