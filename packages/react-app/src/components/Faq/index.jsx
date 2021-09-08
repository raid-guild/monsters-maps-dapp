import React from "react";
import {
  Box,
  Text,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"


export function Faq() {
  return (
    <Box bgColor="secondaryAlpha.900" borderRadius="8px" overflow="hidden" p={10} sx={{
      ".chakra-accordion__item": {
        borderColor: "secondaryAlpha.100"
      },
      ".chakra-accordion__panel": {
        textAlign: "left",
        "ol": {
          listStylePosition: "inside",
        },
        "li": {
          fontSize: ["md", "lg", "xl"],
        }
      }
    }}>
      <Accordion width="100%" allowToggle>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                How do I mint Monsters or Monster Maps on Etherscan ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <ol>
              <li>Go to the Hunt & Mint tab</li>
              <li>Choose 'Claim'(Monsters) or 'discoverEncounters’ (MonsterMaps)</li>
              <li>Choose a number between 1 - 9750 and try to claim!</li>
              <li>Connect wallet</li>
            </ol>
            <Text>If the gas is ridiculously high(e.g. ~$15K), then that is claimed already.Try another number!</Text>

          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Why are there 2 Etherscan links?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>There are 2 Etherscan links because there are 2 different NFTs you can mint.
              We have the Monsters - the creatures and beasts who roam the land. Next, we have the Monster Maps, which show you where each of these Monsters spawn on a Map.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Should I mint a Monster or Monster Map ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>You can mint either a Monster or a Monster Map. Minting a Monster Map would show you the Monsters on your map, which you can go mint new Monsters!</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Do we need to overlay Maps & Monster Maps ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>Not for now, as it is just a demo we do to show how we derived Monster Maps' spawn points from Maps.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                I've just minted a Monster / Monster Map and it shows the "Monster Maps" logo on Opensea. Why is this happening?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>Be patient, young traveler. Give Opensea a while and the full image of your Monster / Monster Map will be generated</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                How is this related to Loot ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>Monster Maps lives in the wider ecosystem of the Loot project. We are in the process of getting added to Loot's Derivative projects. You do not need to own a Loot to mint or buy a Monster or a Monster Map!</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                How is this related to Maps project ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>Monster Map is a derivative of Maps, where we derived Monster Maps' spawn points from the locations in Maps. If you find a Map and Monster Map with a similar ID, you'll see that the locations have Monsters spawned there.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Why are there Monsters beyond #9750 if we can only mint from #1 - #9750 ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>As this is a fair mint project, the Monsters from #9751 - #10000 are allocated for the dev fund to kickstart, build and grow this world of Monster Maps, as well as fund public goods within the Web3 ecosystem.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Who is behind this ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>RaidGuild. We are A Decentralized Collective of Mercenaries Ready to Slay Your Web3 Product Demons.</Text>

            <Text>We are deeply entrenched in the bleeding edge of DAOs, DeFi, dApps and everything else in between. Hailing from the MetaCartel network, our team consists of a diverse group of talent with over 9000 years of combined experience.</Text>

            <Text>Find out more at http://raidguild.org/</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading size="xl">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                What are quests ?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>As part of this emergent storytelling adventure, Quests are narrative - based missions started by Game Masters and shaped by adventurers(like yourself). Join the fight, tell a story and you will be rewarded with booty.</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
