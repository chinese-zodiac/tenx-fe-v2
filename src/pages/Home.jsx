import React, { useEffect, useState } from 'react';
import { useAccount, useBalance, useChainId, useContractRead, useNetwork } from 'wagmi';
import {
  Typography,
  Box,
  Stack,
  keyframes,
  useTheme,
  FormControlLabel,
  Checkbox,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl
} from '@mui/material';
import FooterArea from '../components/layouts/FooterArea';
import ButtonPrimary from '../components/styled/ButtonPrimary';
import { ADDRESS_TENXLAUNCHV2 } from '../constants/addresses';
import { parseEther } from 'viem';
import TenXLaunchV2Abi from '../abi/TenXLaunchV2.json';
import DialogTransaction from '../components/styled/DialogTransaction';
import SliderPercentagePicker from '../components/styled/SliderPercentagePicker';
import TextFieldStyled from '../components/styled/TextFieldStyled';
import TenXTokenList from '../components/elements/TenXTokenList';
import ReactGA from 'react-ga4';
import DatePickerStyled from '../components/styled/DatePickerStyled';
import { getUnixTime } from 'date-fns';
import dayjs from 'dayjs';
import Header from '../components/elements/Header';
import { Container } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import {
  LINK_PRIVACY_POLICY,
  LINK_TELEGRAM,
  LINK_TERMS_OF_USE,
} from '../constants/links';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';
import Markdown from 'react-markdown'
import TenXTokenListPinned from '../components/elements/TenXTokenListPinned';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fontWeight, textAlign } from '@mui/system';
import PrintButton from '../components/elements/PrintButton';

export default function Home() {
  const { chain } = useNetwork();
  const chainId = chain?.id ?? 0;
  const { address, isConnecting, isDisconnected } = useAccount();
  const [name, setName] = useState('ProductX');
  const [symbol, setSymbol] = useState('PRDX');
  const [buyTax, setBuyTax] = useState(25);
  const [sellTax, setSellTax] = useState(50);
  const [buyBurn, setBuyBurn] = useState(10);
  const [sellBurn, setSellBurn] = useState(10);
  const [czusdWad, setCzusdWad] = useState('5000');
  const [tokenLogoCID, setTokenLogoCID] = useState('bafkreihj6w2jbkdq4v5ldqnd4exnzjqels677y3kv32o45c5jyfsbqnl5a');
  const [descriptionMarkdownCID, setDescriptionMarkdownCID] = useState('bafkreicj6kky6yh4dbgsydfngliw7dg66qoshqapykzd4mfezqsvnujnbm');
  const [balanceMax, setBalanceMax] = useState('5000');
  const [transactionSizeMax, setTransactionSizeMax] = useState('1000');
  const [taxReceiver, setTaxReceiver] = useState(address);
  const [buyLpFee, setBuyLpFee] = useState(0);
  const [sellLpFee, setSellLpFee] = useState(0);
  const [launchTimestamp, setLaunchTimestamp] = useState(0);
  const [content, setContent] = useState('Loading...');
  const [isChecked, setIsChecked] = useState(false);
  const [stapro, setStapro] = useState(false);
  const [perPage, setPerPage] = useState(25);  

  const handleExpand = () => {
    setIsChecked(!isChecked);
    /*if (isChecked) {
      setBuyBurn(10);
      setSellBurn(10);
      setCzusdWad('5000');
      setTokenLogoCID('bafkreihj6w2jbkdq4v5ldqnd4exnzjqels677y3kv32o45c5jyfsbqnl5a');
      setDescriptionMarkdownCID('bafkreicj6kky6yh4dbgsydfngliw7dg66qoshqapykzd4mfezqsvnujnbm');
      setBalanceMax('5000');
      setTransactionSizeMax('1000');
      setBuyLpFee(0);
      setSellLpFee(0);
      setLaunchTimestamp(0);
    } else {
      setLaunchTimestamp(0);
    }*/
  };
  const handleChange = (event) => {
    setPerPage(event.target.value);  // Update state when the value is selected
  };

  useEffect(() => {
    if (!taxReceiver) {
      setTaxReceiver(address);
    }
  }, [address]);


  useEffect(() => {
    const fetchFileContent = async (ipfsLink) => {
      try {
        const response = await fetch('https://ipfs.io/ipfs/' + ipfsLink);
        const text = await response.text();
        const sanitizedText = DOMPurify.sanitize(text);
        setContent(sanitizedText);
      } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        setContent('No data found');
      }
    };
    if (isChecked) {
      fetchFileContent(descriptionMarkdownCID);
    }
  }, [descriptionMarkdownCID, isChecked]);
  const theme = useTheme();
  const bp = theme.breakpoints.values;
  const mq = (bp) => `@media (min-width: ${bp}px)`;
  return (
    <>
      <Header />
      <Box 
        sx={{
          backgroundColor:"rgba(0,0,0,0.5)",
          paddingTop:'1em',
          paddingBottom:'1em'
        }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        rowGap={2}
      >
        <TextFieldStyled
          text={name}
          setText={setName}
          maxChar={10}
          width="8em"
          label="Product Name"
          helpMsg="Name for your new product. up to 10 characters."
        />
        <TextFieldStyled
          text={symbol}
          setText={setSymbol}
          maxChar={5}
          width="5.5em"
          label="Code"
          helpMsg="Shortened name for your new product. Up to 5 characters."
        />
        <Box sx={{flexBasis:'100%',height:'0'}}></Box>
        <SliderPercentagePicker
          pct={buyTax}
          setPct={setBuyTax}
          isInvalid={(buyTax != 0 && buyTax+sellTax+buyBurn+sellBurn+buyLpFee+sellLpFee>3000)}
          label="Buy Fee"
          helpMsg="Fee that will be sent to your account every time someone buys your product on cz.cash. Good for revenue. Maximum 9.00%"
        />
        <SliderPercentagePicker
          pct={sellTax}
          isInvalid={(sellTax != 0 && buyTax+sellTax+buyBurn+sellBurn+buyLpFee+sellLpFee>3000)}
          setPct={setSellTax}
          label="Sell Fee"
          helpMsg="Fee that will be sent to your account every time someone sells your product on cz.cash. Good for revenue. Maximum 9.00%"
        />
        <Box sx={{flexBasis:'100%',height:'0'}}></Box>
        <Accordion expanded={isChecked} onChange={handleExpand} slotProps={{ heading: { component: 'h4' } }}
          sx={{
            width:'100%',
            marginLeft:'0px !important',
            marginTop:'0px !important',
            backgroundColor:'transparent',
            boxShadow:'none',
            border:'none',
            textAlign:'center',
            display:'inline-block',
            minHeight:'1em',
            '&::before':{
              background:'transparent',
              display:'none',
              margin:'0px'
            }
          }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              width:'8em',
              marginLeft:'auto',
              marginRight:'auto',
                minHeight:'0 !important',
              color:'rgba(200,200,200,0.69)',
              '& .MuiAccordionSummary-content':{
                margin:'0 !important'
              },
              '& .MuiSvgIcon-root':{
                color:'rgba(200,200,200,0.69)'
              },
            }}
          >
            ADVANCED
          </AccordionSummary>
          <AccordionDetails
          sx={{
            padding:0,
            '& > *':{
              margin:'0.5em !important'
            }
          }}>
              <hr/>
              <><SliderPercentagePicker
                pct={buyBurn}
                setPct={setBuyBurn}
                isInvalid={(buyBurn != 0 && buyTax+sellTax+buyBurn+sellBurn+buyLpFee+sellLpFee>3000)}
                label="Buy Burn"
                helpMsg="Portion of the product that will be destroyed every time someone buys on cz.cash. Good for scarcity. Maximum 9.00%"
              />
              <SliderPercentagePicker
                pct={buyLpFee}
                setPct={setBuyLpFee}
                isInvalid={(buyLpFee != 0 && buyTax+sellTax+buyBurn+sellBurn+buyLpFee+sellLpFee>3000)}
                label="Buy LP Fee"
                helpMsg="Percentage of each buy that will be added to liquidity. Good for increasing price stability and reducing slippage. May greatly increase trading gas costs."
              />
              <Box sx={{flexBasis:'100%',height:'0'}}></Box>
              <SliderPercentagePicker
                pct={sellBurn}
                setPct={setSellBurn}
                isInvalid={(sellBurn != 0 && buyTax+sellTax+buyBurn+sellBurn+buyLpFee+sellLpFee>3000)}
                label="Sell Burn"
                helpMsg="Portion of the product that will be destroyed every time someone sells on cz.cash. Good for scarcity. Maximum 9.00%"
              />
              <SliderPercentagePicker
                pct={sellLpFee}
                setPct={setSellLpFee}
                isInvalid={(sellLpFee != 0 && buyTax+sellTax+buyBurn+sellBurn+buyLpFee+sellLpFee>3000)}
                label="Sell LP Fee"
                helpMsg="Percentage of each sell that will be added to liquidity. Good for increasing price stability and reducing slippage. May greatly increase trading gas costs"
              />
              <Box sx={{flexBasis:'100%',height:'0'}}></Box>
              <TextFieldStyled
                text={czusdWad}
                setText={setCzusdWad}
                maxChar={18}
                isInt={true}
                maxNum={10000}
                minNum={1000}
                width="11em"
                label="CZUSD LP Grant"
                helpMsg="CZUSD portion of the LP grant. The total LP will be worth 2x this amount"
              />
              <TextFieldStyled
                text={balanceMax}
                setText={setBalanceMax}
                maxChar={18}
                isInt={true}
                maxNum={Number(czusdWad)}
                minNum={0}
                width="11em"
                label="Max Balance For Accounts"
                helpMsg="Maximum balance for each account. Accounts cannot receive tokens that would cause them to go over this balance. Must be at least 0.01% of supply. Good for reducing some types of bots and snipers."
              />
              <TextFieldStyled
                text={transactionSizeMax}
                setText={setTransactionSizeMax}
                maxChar={18}
                isInt={true}
                maxNum={Number(czusdWad)}
                minNum={0}
                width="11em"
                label="Max Transaction Size"
                helpMsg="Maximum transaction size. Buys and sells over this amount fail. Must be at least 0.01% of supply. Good for reducing some types of bots and snipers."
              />
              <Box sx={{flexBasis:'100%',height:'0'}}></Box>
              <TextFieldStyled
                text={taxReceiver}
                setText={setTaxReceiver}
                maxChar={42}
                width="25em"
                label="Fee Receiver"
                helpMsg="Account that receives fees from Buy Fee and Sell Fee. Exempt from all fees and burns."
              />
              <Box sx={{flexBasis:'100%',height:'0'}}></Box>
              <DatePickerStyled className='datepicker'
                text={launchTimestamp}
                backgroundColor="#fff"
                setText={setLaunchTimestamp}
                label="Launch Time"
                helpMsg="Optional time for token to open trading. Exempt accounts, such as the taxReceiver wallet, can trade before opening. You can add more exempt accounts after creating this product."
              />
              <hr/>
              <Box sx={{textAlign:'center'}}>
              {tokenLogoCID && (
                <Box
                  as="img"
                  className="productlogo"
                  src={'https://ipfs.io/ipfs/' + tokenLogoCID}
                  sx={{
                    objectFit:'cover',
                    width: '5em',
                    height: '5em',
                    marginLeft:'auto',
                    marginRight:'auto',
                    padding: 0,
                    backgroundColor: 'white',
                    border: 'solid 0.15em white',
                    borderRadius: '5em',
                    '&:hover': {
                      border: 'solid 0.15em grey',
                      backgroundColor: 'grey',
                    },
                    display:'block'
                  }}
                />
              )}

<TextFieldStyled
                text={tokenLogoCID}
                setText={setTokenLogoCID}
                maxChar={70}
                width="33em"
                label="Product Logo(IPFS CID)"
                helpMsg="Shortened name for your new product. Up to 5 characters."
              />
              <Typography sx={{
                marginLeft:'auto',
                marginRight:'auto',
                maxWidth:'50em',
                display:'block',
                color:'#fff',
                ' & a':{
                  color:'#aaf'
                }
              }}>
                <Typography as='span' sx={{fontWeight:'bold', }}>IMAGE INSTRUCTIONS: </Typography>
                Your image must first be pinned to IPFS using a service such as 
                <a target="_blank"  href="https://Pinata.cloud">Pinata.cloud</a>,
                <a target="_blank"  href="https://Fleek.xyz">Fleek.xyz</a>, or
                <a target="_blank"  href="https://www.4everland.org/">4everland.org</a>.
                Once you pin your image, you will need the image's IPFS CID, a unique code for that specific image.
                Copy the CID into the text field above. The 
                logo should display in 5-10 seconds, if it doesnt ask for help. Always feel free to ask for
                help at <a href={LINK_TELEGRAM}>Czodiac's telegram</a>. If theres an issue, don't worry; you can update the image later.
              </Typography>
              </Box>
              <hr/>
              <TextFieldStyled className='productdes'
                text={descriptionMarkdownCID}
                setText={setDescriptionMarkdownCID}
                maxChar={70}
                border='none'
                width="33em"
                label="Product Description IPFS CID(IPFS CID)"
                helpMsg="IPFS CID (hash) of the product’s description in CommonMark. Upload and pin the description .md file first, then copy the IPFS CID here. Acceps MD file in CommonMark format. Must be smaller than 10kb."
              />
              <Box sx={{textAlign:'center'}}>
              
              <Typography sx={{
                marginLeft:'auto',
                marginRight:'auto',
                maxWidth:'50em',
                display:'block',
                color:'#fff',
                ' & a':{
                  color:'#aaf'
                }
              }}>
                <Typography as='span' sx={{fontWeight:'bold'}}>DESCRIPTION INSTRUCTIONS: </Typography>
                You first should create a CommonMark file. Use a tool such as <a target="_blank" href="https://spec.commonmark.org/dingus/#result">spec.commonmark.org/dingus</a>
                to create your file. Save it as a '.md' then pin it to IPFS just like for an image using
                <a target="_blank"  href="https://Web3.storage">Web3.storage</a> or 
                <a target="_blank"  href="https://Pinata.cloud">Pinata.cloud</a>. Once you pin your markdown file, 
                you will need the markdown's IPFS CID. This will be a long string of letters 
                and numbers start with either 'Qm' or 'bafy'. Copy the CID into the text field above. The 
                description text below will change once the file has propagated across the network. Always feel free to ask for
                help at <a href={LINK_TELEGRAM}>Czodiac's telegram</a>. You can always update the text later.
              </Typography></Box>
              {descriptionMarkdownCID &&<Box sx={{
                '&.MuiBox-root':{
                  margin:'0 auto !important',
                },
                borderRadius:'0.5em',
                padding:'0.5em',
                textAlign:'left',
                maxWidth:'960px',
                display:'block',
                backgroundColor:'rgba(255,255,255,0.69)',
                height:'10em',
                overflowY:'scroll',
                border:'solid 3px #fff'
                }}>
              <Markdown>{content}</Markdown>
                <br/><br/><br/><br/>
                
                </Box> }
             
            </>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <br />
      {!!address ?
        (chainId != 56 ?
          (
            <ButtonPrimary
              onClick={() => {
                ReactGA.event({
                  category: 'tenx_action',
                  action: 'click_createnow_btn_1_not_connected',
                  label: 'Click on "create now btn 1" on tenx.cz.cash when not connected',
                });
                toast.error('Connect your BSC (BNB Smart Chain) Wallet first.');
              }}
              sx={{
                width: '9em',
                marginTop: '0.66em',
                marginBottom: '0em',
                fontSize: '1.5em',
                position: 'relative',
                fontWeight: 'bold',
                textTransform: 'none',
                color: '#e16b31',
                borderRadius: '1.5em',
                border: 'solid 5px #e16b31',
                backgroundColor: '#f3f3f3',
                '&:hover': {
                  backgroundColor: '#080830',
                },
              }}
            >
              CREATE NOW <Box as="span">🚀</Box>
            </ButtonPrimary>
          )
          :
          (
            <DialogTransaction
              title={'LAUNCH ' + symbol}
              address={ADDRESS_TENXLAUNCHV2}
              abi={TenXLaunchV2Abi}
              functionName="launchToken"
              args={[
                parseEther(czusdWad), //czusdWad
                name, //name
                symbol, //symbol
                tokenLogoCID, //tokenLogoCID
                descriptionMarkdownCID, //descriptionMarkdownCID
                parseEther(balanceMax), //balanceMax
                parseEther(transactionSizeMax), //transactionSizeMax
                taxReceiver, //taxReceiver
                buyLpFee, //buyLpFee
                buyTax, //buyTax
                buyBurn, //buyBurn
                sellTax, //sellTax
                sellBurn, //sellburn
                sellLpFee, //sellLpFee
                launchTimestamp == 0 ? 0 : getUnixTime(launchTimestamp.$d) //launchTimestamp
              ]}
              toast={toast}
              btn={
                <ButtonPrimary
                  onClick={() => {
                    ReactGA.event({
                      category: 'tenx_action',
                      action: 'click_createnow_btn_1',
                      label: 'Click on "create now btn 1" on tenx.cz.cash', // optional
                    });
                    handleConfirmed();
                  }}
                  sx={{
                    width: '9em',
                    marginTop: '0.66em',
                    marginBottom: '0em',
                    fontSize: '1.5em',
                    position: 'relative',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    color: 'white',
                    borderRadius: '1.5em',
                    border: 'solid 5px #e16b31',
                    background:
                      'radial-gradient(circle, rgba(116,29,131,1) 0%, rgba(149,54,68,1) 75%, rgba(108,10,57,1) 100%);',
                    backgroundSize: '400% 400%',
                    transition: '250ms',
                    animation: `${keyframes`
                  0% {
                      background-position: 0% 0%;
                    }
                    25% {
                      background-position: 66% 33%;
                    }
                    50% {
                      background-position: 0% 100%;
                    }
                    75% {
                      background-position: 33% 66%;
                    }
                    100% {
                      background-position: 0% 0%;
                    }`} 15s infinite ease`,
                    '&:hover': {
                      animationDuration: '1500ms',
                      color: 'pink',
                    },
                    '&:hover > span': {
                      position: 'relative',
                      top: '0px',
                      left: '0px',
                      animation: `${keyframes`
                  0% {
                      top: 0px;
                      left: 0px;
                    }
                    25% {
                      top: -3px;
                      left: -2px;
                    }
                    50% {
                      top: -2px;
                      left: 2px;
                    }
                    75% {
                      top: -2px;
                      left: -2px;
                    }
                    100% {
                      top: 0px;
                      left: 0px;
                    }`} 250ms infinite ease`,
                    },
                  }}
                >
                  CREATE NOW <Box as="span">🚀</Box>
                </ButtonPrimary>
              }
            >
              <Typography sx={{ fontSize: '1.25em', lineHeight: '1em' }}>
                Send the Launch transaction to your wallet that will immediately
                launch your new token with the parameters below. The Launch
                transaction costs approximately 0.015 {chain?.nativeCurrency?.name}. Taxes will be sent to
                the Tax Receiver wallet (by default your connected wallet). All LP is permanently locked.
                <br />
                <br />
                <ul className="homelist">
                  <li>Name: <span>{name}</span></li>
                  <li>Symbol: <span>{symbol}</span></li>
                  <li>Liquidity:<span> $10,000 </span></li>
                  <li>Supply: <span>5,000 {symbol}</span></li>
                  <li>Buy Fee: <span>{(buyTax / 100).toFixed(2)}%</span></li>
                  <li>Buy Burn: <span>{(buyBurn / 100).toFixed(2)}%</span></li>
                  <li>Buy LP Fee: <span>{(buyLpFee / 100).toFixed(2)}%</span></li>
                  <li>Sell Fee: <span>{(sellTax / 100).toFixed(2)}%</span></li>
                  <li>Sell Burn: <span>{(sellBurn / 100).toFixed(2)}%</span></li>
                  <li>Sell LP Fee: <span>{(sellLpFee / 100).toFixed(2)}%</span></li>
                  <li>Tax Receiver: <span>{address.slice(0, 8)}...{address.slice(36)}</span></li>
                </ul>

              </Typography>
            </DialogTransaction>
          )
        ) : (
          <ButtonPrimary
            onClick={() => {
              ReactGA.event({
                category: 'tenx_action',
                action: 'click_createnow_btn_1_not_connected',
                label: 'Click on "create now btn 1" on tenx.cz.cash when not connected',
              });
              toast.error('Connect your BSC (BNB Smart Chain) Wallet first.');
            }}
            sx={{
              width: '9em',
              marginTop: '0.66em',
              marginBottom: '2em',
              fontSize: '1.5em',
              position: 'relative',
              fontWeight: 'bold',
              textTransform: 'none',
              color: '#e16b31',
              borderRadius: '1.5em',
              border: 'solid 5px #e16b31',
              backgroundColor: '#f3f3f3',
              '&:hover': {
                backgroundColor: '#080830',
              },
            }}
          >
            CREATE NOW <Box as="span">🚀</Box>
          </ButtonPrimary>
        )}
      <PrintButton />
      <ToastContainer />
      </Box>
      <>
          <Container className="topheading">
            <Button onClick={() => setStapro(false)}>
              <Typography className="hedding" as="h1" sx={{ fontSize: '2em', color:'white' }}>
                All Launches
              </Typography>
            </Button>

            {/*<Button onClick={() => setStapro(true)}>
              <Typography className="hedding" as="h1" sx={{ fontSize: '2em' }}>
                Starred Products
              </Typography>
            </Button>*/}
          </Container>
          <TenXTokenList className="productbox" perPage={perPage} />
           
      </>
      <>
        
      <FormControl
              sx={{
                display:'block',
                marginTop: '1em',
                marginLeft:'auto',
                marginRight:'auto',
                maxWidth:'10em',
                color:'white'
              }}
            >
              <InputLabel id="perpage-select-label" sx={{ marginBottom: '-1em',color:'white' }}>
                Products per page
              </InputLabel>
              <Select
                labelId="perpage-select-label"
                value={perPage}
                label="Products per page"
                onChange={handleChange}
                sx={{
                  border:'none !important',
                  color:'white',
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={500}>500</MenuItem>
              </Select>
            </FormControl>
        <FooterArea />

      </>

    </>
  );
}