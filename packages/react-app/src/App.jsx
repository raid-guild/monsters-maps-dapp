import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import "./App.css";
import { Spin, Row, Col, Menu, Alert, Switch as SwitchD } from "antd";
import { LogoutOutlined, SendOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useOnBlock, useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "./hooks";
import { Address, AddressInput, Header, Account, Faucet, Ramp, Contract, GasGauge, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
import axios from "axios";
import { Hints, ExampleUI, Subgraph } from "./views"
// import { useThemeSwitcher } from "react-css-theme-switcher";
import { INFURA_ID, NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, MONSTERS_CONTRACT_ADDRESS, MONSTERS_CONTRACT_ABI, MAPS_CONTRACT_ADDRESS, MAPS_CONTRACT_ABI, NETWORK, NETWORKS } from "./constants";
import StackGrid from "react-stack-grid"
import { Box, Heading, HStack, Image, AspectRatio, Button, Text } from "@chakra-ui/react";
import { Faq } from "./components/Faq";
// import { Box, Link } from "@chakra-ui/react";
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

const { BufferList } = require('bl')
//
//  we will connect to infura, but you can connect to _any_ IPFS node:
//    (and you should run your own!)
//
const ipfsAPI = require('ipfs-http-client');// https://www.npmjs.com/package/ipfs-http-client
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })



/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['mainnet']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true


// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);


// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


function App(props) {

  const mainnetProvider = (scaffoldEthProvider && scaffoldEthProvider._network) ? scaffoldEthProvider : mainnetInfura

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork,mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork,"fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  let localChainId = localProvider && localProvider._network && localProvider._network.chainId
  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const nftContractRead = useExternalContractLoader(localProvider, NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI)

  const monstersContractRead = useExternalContractLoader(localProvider, MONSTERS_CONTRACT_ADDRESS, MONSTERS_CONTRACT_ABI)

  const mapsContractRead = useExternalContractLoader(localProvider, MAPS_CONTRACT_ADDRESS, MAPS_CONTRACT_ABI)

  // If you want to bring in the mainnet DAI contract it would look like:
  const monstersContractWrite = useExternalContractLoader(userProvider, MONSTERS_CONTRACT_ADDRESS, MONSTERS_CONTRACT_ABI)

  const mapsContractWrite = useExternalContractLoader(userProvider, MAPS_CONTRACT_ADDRESS, MAPS_CONTRACT_ABI)

  const contractName = useContractReader({ nftContractRead }, "nftContractRead", "name")

  const monstersContractName = useContractReader({ monstersContractRead }, "monstersContractRead", "name")

  const mapsContractName = useContractReader({ mapsContractRead }, "mapsContractRead", "name")

  // keep track of a variable from the contract in the local React state:
  const yourNFTBalance = useContractReader({ nftContractRead }, "nftContractRead", "balanceOf", [address])
  const yourMonstersBalance = useContractReader({ monstersContractRead }, "monstersContractRead", "balanceOf", [address])

  const yourMapsBalance = useContractReader({ mapsContractRead }, "mapsContractRead", "balanceOf", [address])
  if (DEBUG && yourMapsBalance) console.log("🧮 yourMapsBalance", yourMapsBalance)

  const [yourCollectibles, setYourCollectibles] = useState()
  const [yourMonsters, setYourMonsters] = useState()
  const [yourMaps, setYourMaps] = useState()
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [monstersLoading, setMonstersLoading] = useState(true);
  const [mapsLoading, setMapsLoading] = useState(true);

  const yourMonstersBalancetoNumber = yourMonstersBalance && yourMonstersBalance.toNumber && yourMonstersBalance.toNumber()

  const yourMapsBalancetoNumber = yourMapsBalance && yourMapsBalance.toNumber && yourMapsBalance.toNumber()

  console.log("your monster bal: ", yourMonstersBalancetoNumber);

  useEffect(() => {
    web3Modal.cachedProvider && setUserLoggedIn(true);

    const updateYourMonsters = async () => {

      let monstersUpdate = []
      for (let tokenIndex = yourMonstersBalancetoNumber - 1; tokenIndex >= 0; tokenIndex--) {
        try {
          //console.log("Getting token index",tokenIndex)

         const tokenId = await monstersContractRead.tokenOfOwnerByIndex(address, tokenIndex)
          if(DEBUG&&tokenId)console.log("🆔 tokenId",tokenId)
         const tokenURI = await monstersContractRead.tokenURI(tokenId)
          if (DEBUG && tokenURI) console.log("🏷 tokenURI", tokenURI)

          //loading your token information from the tokenURI might work in a few different ways....

          const jsonManifest = await axios({ url: tokenURI }, { timeout: 2 })
          console.log("jsonManifest",jsonManifest)
          if (jsonManifest) {
            monstersUpdate.push({ id: tokenId._hex, ...jsonManifest.data })
          }

          setMonstersLoading(false);

        } catch (e) { console.log("🀄 Error: ", e) }
        setYourMonsters(monstersUpdate)
      }

    }
    const updateYourMaps = async () => {
      let mapsUpdate = []
      for (let tokenIndex = yourMapsBalancetoNumber - 1; tokenIndex >= 0; tokenIndex--) {
        try {
          //console.log("Getting token index",tokenIndex)
          const tokenId = await mapsContractRead.tokenOfOwnerByIndex(address, tokenIndex)
          if (DEBUG && tokenId) console.log("🆔 tokenId", tokenId)
          const tokenURI = await mapsContractRead.tokenURI(tokenId)
          if (DEBUG && tokenURI) console.log("🏷 tokenURI", tokenURI)

          //loading your token information from the tokenURI might work in a few different ways....

          //you might just grab the data from the uri directly:
          const jsonManifest = await axios({ url: tokenURI })
          console.log("jsonManifest", jsonManifest)
          if (jsonManifest) {
            //console.log("manifest",manifest)
            mapsUpdate.push({ id: tokenId._hex, ...jsonManifest.data })
          }

          setMapsLoading(false);
        } catch (e) {
          console.log(e)
        }
        setYourMaps(mapsUpdate)
      }

    }
    if (web3Modal.cachedProvider) {
      updateYourMonsters()
      updateYourMaps()
    }

  }, [readContracts, address, yourMonstersBalancetoNumber, yourMapsBalancetoNumber])

  let yourMonstersRender = []
  let yourMapsRender = []
  const [ showSend, setShowSend ] = useState({})
  const [ toAddress, setToAddress ] = useState({})
  const monsterOpenSeaUrl = (id) => {
    const tokenId = BigNumber.from(id).toString();
    const osUrl = `https://opensea.io/assets/0xeCb9B2EA457740fBDe58c758E4C574834224413e/${tokenId}`
    return osUrl;

  }
  const mapOpenSeaUrl = (id) => {
    const tokenId = BigNumber.from(id).toString();
    const osUrl = `https://opensea.io/assets/0x6C8715ade6361D35c941EB901408EFca8A20F65a/${tokenId}`;

    return osUrl;
  }

  for (let c in yourMonsters) {
     let cardActions = []

    const id = yourMonsters[c].id

     if(showSend[id]){
       cardActions.push(
         <div style={{marginTop:-32}}>
           <div style={{paddingTop:8,padding:4,marginBottom:8,backgroundColor:"#ffffff"}}>
             <AddressInput
               autoFocus
               ensProvider={mainnetProvider}
               placeholder="to address"
               value={toAddress[id]}
               onChange={(value)=>{
                 let update = {}
                 update[id] = value
                 setToAddress({...toAddress, ...update})
               }}
             />
           </div>
           <div>
            <Row>
              <Col span={12}>
                <Button onClick={()=>{
                  let update = {}
                  update[id] = false
                  setShowSend({...showSend, ...update})
                }}>
                  <CloseCircleOutlined />
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={async ()=>{
                  console.log("💸 Transfer...")
                   const result = await tx(monstersContractWrite.transferFrom(address, toAddress[id], id))
                  console.log("📡 result...",result)
                  let update = {}
                  update[id] = false
                  setShowSend({...showSend, ...update})
                }}>
                  <SendOutlined />
                </Button>
              </Col>
            </Row>

           </div>
         </div>
       )
     }

    if (!showSend[yourMonsters[c].id]) {
       cardActions.push(
         <div>
           <Button onClick={(id)=>{
             let update = {}
             update[yourMonsters[c].id] = true
             setShowSend({...showSend, ...update})
           }}>
             <SendOutlined />
           </Button>
         </div>
       )
       cardActions.push(
          <div>
            <Button onClick={()=>{
             window.open(yourMonsters[c].external_url.replace("{id}", yourMonsters[c].id))
           }}>
             <LogoutOutlined />
           </Button>
         </div>
       )
    }



    yourMonstersRender.push(
      <Box boxShadow="0 0 25px #82b52a40">
        <Box sx={{ backgroundColor: "secondaryAlpha.900", border: "1px solid primaryAlpha.200", borderRadius: "8px", overflow: "hidden" }} key={"your" + yourMonsters[c].entropy + yourMonsters[c].id}>
          <AspectRatio maxW="300px" ratio={1}>
            <Image sx={{ maxWidth: 300 }} src={yourMonsters[c].image} />
          </AspectRatio>
          <Box d="flex" flexFlow="column wrap" p={4} color="primaryAlpha.200" fontSize={["md", "lg", "xl"]}>
            <span>
              {yourMonsters[c].name}
            </span>
            <a href={monsterOpenSeaUrl(yourMonsters[c].id)} target="_blank">View on OpenSea</a>
          </Box>
        </Box>
      </Box>
    )
  }


  for (let c in yourMaps) {
    let cardActions = []

    const id = yourMaps[c].id

    if (showSend[id]) {
      cardActions.push(
        <div style={{ marginTop: -32 }}>
          <div style={{ paddingTop: 8, padding: 4, marginBottom: 8, backgroundColor: "#ffffff" }}>
            <AddressInput
              autoFocus
              ensProvider={mainnetProvider}
              placeholder="to address"
              value={toAddress[id]}
              onChange={(value) => {
                let update = {}
                update[id] = value
                setToAddress({ ...toAddress, ...update })
              }}
            />
          </div>
          <div>
            <Row>
              <Col span={12}>
                <Button onClick={() => {
                  let update = {}
                  update[id] = false
                  setShowSend({ ...showSend, ...update })
                }}>
                  <CloseCircleOutlined />
                </Button>
              </Col>
              <Col span={12}>
                <Button onClick={async () => {
                  console.log("💸 Transfer...")
                  const result = await tx(mapsContractWrite.transferFrom(address, toAddress[id], id))
                  console.log("📡 result...", result)
                  let update = {}
                  update[id] = false
                  setShowSend({ ...showSend, ...update })
                }}>
                  <SendOutlined />
                </Button>
              </Col>
            </Row>

          </div>
        </div>
      )
    }

    if (!showSend[yourMaps[c].id]) {
      cardActions.push(
        <div>
          <Button onClick={(id) => {
            let update = {}
            update[yourMaps[c].id] = true
            setShowSend({ ...showSend, ...update })
          }}>
            <SendOutlined />
          </Button>
        </div>
      )
      cardActions.push(
        <div>
          <Button onClick={() => {
            window.open(yourMaps[c].external_url.replace("{id}", yourMaps[c].id))
          }}>
            <LogoutOutlined />
          </Button>
        </div>
      )
    }



    yourMapsRender.push(
      <Box boxShadow="0 0 25px #82b52a40">
        <Box sx={{ backgroundColor: "secondaryAlpha.900", border: "1px solid primaryAlpha.200", borderRadius: "8px", overflow: "hidden", minH: "100%", minW: "100%" }} key={"your" + yourMaps[c].entropy + yourMaps[c].id}>
          <AspectRatio maxW="300px" ratio={1}>
            <Image style={{ maxWidth: 300 }} src={yourMaps[c].image} />
          </AspectRatio>
          <Box d="flex" flexFlow="column wrap" p={4} color="primaryAlpha.200" fontSize={["md", "lg", "xl"]}>
            <span>
              {yourMaps[c].name}
            </span>
            <a href={mapOpenSeaUrl(yourMaps[c].id)} target="_blank">View on OpenSea</a>
          </Box>
        </Box>
      </Box>
    )
  }


  const stackedMonstersDisplay = yourMonstersBalance && yourMonstersBalance.toNumber() ? (
    <Box sx={{ pos: "relative", maxWidth: 1280, margin: "auto", marginTop: 24, paddingBottom: 50 }}>



      {!monstersLoading ? (
        <>
          <Heading size="xl" sx={{ marginBottom: 8, marginTop: 8 }}>
            {yourMonstersBalance && yourMonstersBalance.toNumber()} {monstersContractName}
          </Heading>

          <StackGrid
            columnWidth={300}
            gutterWidth={16}
            gutterHeight={32}
          >
            {yourMonstersRender}
          </StackGrid>
        </>
      ) : (
        <Box sx={{
          marginTop: 64,
          ".ant-spin-dot-item": {
            bgColor: "primaryAlpha.500",
          }
        }}><Spin size="large" /></Box>)}

    </Box>
  ) : (
    <Box sx={{
      marginTop: 64,
    }}>
      <Text>{"You haven't got any monsters"}</Text>
    </Box>
  )


  const stackedMapsDisplay = yourMapsBalance && yourMapsBalance.toNumber() ? (
    <Box sx={{ pos: "relative", maxWidth: 1280, margin: "auto", marginTop: 24, paddingBottom: 50 }}>
      {!mapsLoading ? (
        <>
          <Heading size="xl" sx={{ marginBottom: 8, marginTop: 8 }}>
            {yourMapsBalance && yourMapsBalance.toNumber()} {mapsContractName}
          </Heading>

          <StackGrid
            columnWidth={300}
            gutterWidth={16}
            gutterHeight={32}
          >
            {yourMapsRender}
          </StackGrid>
        </>
      ) : (
        <Box sx={{
          marginTop: 64,
          ".ant-spin-dot-item": {
            bgColor: "primaryAlpha.500",
          }
        }}><Spin size="large" /></Box>)}


    </Box>
  ) : (
    <Box sx={{
      marginTop: 64,
    }}>
      <Text>{"You haven't got any maps"}</Text>
    </Box>
  )


  //📟 Listen for broadcast events
  //const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(()=>{
    if(DEBUG && mainnetProvider && address && selectedChainId && yourLocalBalance && yourMainnetBalance && readContracts && writeContracts){
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________")
      console.log("🌎 mainnetProvider",mainnetProvider)
      console.log("🏠 localChainId",localChainId)
      console.log("👩‍💼 selected address:",address)
      console.log("🕵🏻‍♂️ selectedChainId:",selectedChainId)
      console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")
      console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")
      console.log("📝 readContracts",readContracts)
      console.log("🔐 writeContracts",writeContracts)
    }
  }, [mainnetProvider, address, selectedChainId, yourLocalBalance, yourMainnetBalance, readContracts, writeContracts])

  const assetsPage = address && userProvider ? (
    <>
      {stackedMonstersDisplay}

      {stackedMapsDisplay}
    </>
  ) : (
    <Box>
      Please login
    </Box>
  );

  let networkDisplay = ""
  if(localChainId && selectedChainId && localChainId != selectedChainId ){
    networkDisplay = (
      <Box style={{ zIndex: 2, position: 'absolute', right: 0, top: 0, padding: 16 }}>
        <Alert
          message={"⚠️ Wrong Network"}
          description={(
            <div>
              You have <b>{NETWORK(selectedChainId).name}</b> selected and you need to be on <b>{NETWORK(localChainId).name}</b>.
            </div>
          )}
          type="error"
          closable={false}
        />
      </Box>
    )
  }else{
    networkDisplay = (
      <Box style={{ zIndex: -1, position: 'absolute', right: 50, top: 0, padding: 16, color: targetNetwork.color, fontSize: 24 }}>
        {targetNetwork.name}
      </Box>
    )
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [setRoute]);

  let faucetHint = ""
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name == "localhost"

  const [ faucetClicked, setFaucetClicked ] = useState( false );
  if(!faucetClicked&&localProvider&&localProvider._network&&localProvider._network.chainId==31337&&yourLocalBalance&&formatEther(yourLocalBalance)<=0){
    faucetHint = (
      <div style={{padding:16}}>
        <Button type={"primary"} onClick={()=>{
          faucetTx({
            to: address,
            value: parseEther("0.01"),
          });
          setFaucetClicked(true)
        }}>
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    )
  }

  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>

        <Box marginTop="100px" sx={{
          ".ant-menu-item a": {
            color: "primaryAlpha.400",
            fontSize: 28,
            "&:hover": {
              color: "primaryAlpha.500",
            }
          },
          ".ant-menu-item-selected a": {
            color: "primaryAlpha.200",
            fontSize: 32
          },
          ".ant-menu-item.ant-menu-item-selected": {
            color: "primaryAlpha.200",
            borderBottom: "2px solid primaryAlpha.200"
          }
        }}>
          <Menu style={{ textAlign: "center", backgroundColor: "transparent", borderColor: "transparent" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
              <Link onClick={() => { setRoute("/") }} to="/">Intro</Link>
            </Menu.Item>
            <Menu.Item key="/my-monsters">
              <Link onClick={() => { setRoute("/my-monsters") }} to="/my-monsters">My Monsters</Link>
            </Menu.Item>
            <Menu.Item key="/my-maps">
              <Link onClick={() => { setRoute("/my-maps") }} to="/my-maps">My Maps</Link>
            </Menu.Item>
          <Menu.Item key="/contract">
              <Link onClick={() => { setRoute("/contract") }} to="/contract">Hunt & Mint</Link>
            </Menu.Item>
            <Menu.Item key="/faq">
              <Link onClick={() => { setRoute("/faq") }} to="/faq">FAQ</Link>
            </Menu.Item>
        </Menu>
        </Box>
        <Switch>
          <Route exact path="/">
            {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}
            <Box d="flex" alignContent="center" justifyContent="space-between" flexFlow="row nowrap" maxW="780px" margin="0 auto" mt="100px" sx={{}}>
              <Box textAlign="left" maxW="55%">
                <Heading>I see your interest is piqued,<br /> curious traveller..</Heading>


                <Text>Ever since Monsters and Maps started appearing across the horizon, there have been murmurs in the crowds - What’s the meaning behind all these?</Text>

                <Text>Well, we’ve overheard some rumours, stories and quests, in taverns and inns. Mint monsters & Maps and dive right in.</Text>
                <HStack mt={5}>
                  <Button type="primary" onClick={() => { window.open("https://discord.gg/XhMVzsQyqw") }}>Join the community</Button>
                  {!web3Modal.cachedProvider && <Button type="primary" onClick={loadWeb3Modal}>Login with MetaMask</Button>}
                </HStack>
              </Box>
            </Box>

          </Route>

          <Route path="/my-monsters">
            {web3Modal.cachedProvider ? stackedMonstersDisplay : (
              <Box sx={{ pos: "relative", maxWidth: 1280, margin: "auto", marginTop: 24, paddingBottom: 50 }}>
                <Button type="primary" onClick={loadWeb3Modal}>Connect</Button>
              </Box>
            )}
          </Route>

          <Route path="/my-maps">
            {web3Modal.cachedProvider ? stackedMapsDisplay : (
              <Box sx={{ pos: "relative", maxWidth: 1280, margin: "auto", marginTop: 24, paddingBottom: 50 }}>
                <Button type="primary" onClick={loadWeb3Modal}>Connect</Button>
              </Box>
            )}
          </Route>

          <Route path="/contract">
            <Box d="flex" alignContent="center" justifyContent="space-between" flexFlow="row nowrap" maxW="1280px" margin="0 auto" mt="100px">
            <Contract
                name="Monsters"
                customContract={monstersContractWrite}
                readContract={monstersContractRead}
              signer={userProvider.getSigner()}
                provider={userProvider}
              address={address}
                blockExplorer={"https://etherscan.io/"}
              />

            <Contract
                name="Maps"
                customContract={mapsContractWrite}
                readContract={mapsContractRead}
              signer={userProvider.getSigner()}
              provider={userProvider}
              address={address}
              blockExplorer={"https://etherscan.io/"}
            />
            </Box>
          </Route>

          <Route path="/faq">
            <Box maxW="50%" margin="0 auto" mt="100px" sx={{}}>
              <Heading>FAQ</Heading>
              <Box>
                <Faq />
              </Box>
            </Box>
          </Route>
        </Switch>
      </BrowserRouter>

      {/* <ThemeSwitch /> */}


      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <Box sx={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 4, zIndex: 1001 }}>
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
      </Box>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <Box style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <HStack p={[4, 4]}>
          <GasGauge gasPrice={gasPrice} />
             <Button
               onClick={() => {
              window.open("https://discord.gg/XhMVzsQyqw");
               }}
               size="large"
            shape="round"
            background="transparent"
             >
               <span style={{ marginRight: 8 }} role="img" aria-label="support">
                 💬
               </span>
            Community
          </Button>
        </HStack>
      </Box>
      <Box style={{ position: "fixed", textAlign: "right", right: 0, bottom: 20, padding: 10 }}>
        <HStack p={[4, 4]}>
          <a href="https://www.raidguild.org/" target="_blank" style={{ maxWidth: "250px" }}>
            <Image src={"/raidguild__logo_pjogts.png"} />
          </a>
        </HStack>
      </Box>
    </div>
  );
}


/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

 window.ethereum && window.ethereum.on('chainChanged', chainId => {
  web3Modal.cachedProvider &&
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

 window.ethereum && window.ethereum.on('accountsChanged', accounts => {
  web3Modal.cachedProvider &&
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

//helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    //console.log(file.path)
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    //console.log(content)
    return content
  }
}

export default App;
