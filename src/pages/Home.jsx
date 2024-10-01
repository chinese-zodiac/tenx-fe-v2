import React, { useEffect, useState } from 'react';
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi';
import {
  Typography,
  Box,
  Stack,
  keyframes,
  useTheme,
  FormControlLabel,
  Checkbox
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
  LINK_TERMS_OF_USE,
} from '../constants/links';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';
import Markdown from 'react-markdown'
import { getIpfsUrl } from '../utils/getIpfsJson';
import TenXTokenListPinned from '../components/elements/TenXTokenListPinned';

export default function Home() {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();

  const [name, setName] = useState('ProductX');
  const [symbol, setSymbol] = useState('PRDX');
  const [buyTax, setBuyTax] = useState(25);
  const [sellTax, setSellTax] = useState(275);
  const [buyBurn, setBuyBurn] = useState(25);
  const [sellBurn, setSellBurn] = useState(175);
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

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (checked) {
      setBuyBurn(25);
      setSellBurn(175);
      setCzusdWad('5000');
      setTokenLogoCID('bafkreihj6w2jbkdq4v5ldqnd4exnzjqels677y3kv32o45c5jyfsbqnl5a');
      setDescriptionMarkdownCID('bafkreicj6kky6yh4dbgsydfngliw7dg66qoshqapykzd4mfezqsvnujnbm');
      setBalanceMax('5000');
      setTransactionSizeMax('1000');
      setTaxReceiver(address);
      setBuyLpFee(0);
      setSellLpFee(0);
      setLaunchTimestamp(0);
    } else {
      setLaunchTimestamp(dayjs());
    }
  };
  useEffect(() => {
    const fetchFileContent = async (ipfsLink) => {
      try {
        ipfsLink = await getIpfsUrl('ipfs.io/ipfs/' + ipfsLink);
        const response = await fetch('https://' + ipfsLink);
        const text = await response.text();
        const sanitizedText = DOMPurify.sanitize(text);
        setContent(sanitizedText);
      } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        setContent('No data found'); // Update state with error message
      }
    };
    if (!isChecked) {
      fetchFileContent(descriptionMarkdownCID); // Call the async function
    }
  }, [descriptionMarkdownCID]);

  // console.log({
  //   czusdWad:parseEther(czusdWad), 
  //   name, 
  //   symbol, 
  //   tokenLogoCID, 
  //   descriptionMarkdownCID, 
  //   balanceMax:parseEther(balanceMax), 
  //   transactionSizeMax:parseEther(transactionSizeMax), 
  //   taxReceiver, 
  //   buyLpFee, 
  //   buyTax, 
  //   buyBurn,
  //   sellTax, 
  //   sellBurn, 
  //   sellLpFee, 
  //   launchTimestamp:getUnixTime(launchTimestamp.$d) 
  // });
  const theme = useTheme();
  const bp = theme.breakpoints.values;
  const mq = (bp) => `@media (min-width: ${bp}px)`;
  return (
    <>
      <Header />
      <br />
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
          width="5em"
          label="Code"
          helpMsg="Shortened name for your new product. Up to 5 characters."
        />
        <SliderPercentagePicker
          pct={buyTax}
          setPct={setBuyTax}
          label="Buy Fee"
          helpMsg="Fee that will be sent to your account every time someone buys your product on cz.cash. Good for revenue. Maximum 9.00%"
        />
        <SliderPercentagePicker
          pct={sellTax}
          setPct={setSellTax}
          label="Sell Fee"
          helpMsg="Fee that will be sent to your account every time someone sells your product on cz.cash. Good for revenue. Maximum 9.00%"
        />

        <FormControlLabel className='editsetting'
          control={
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
              color="primary"
            />
          }
          label="Edit advanced Settings"
          sx={{ marginTop: '1em' }}
        />

        {isChecked && <><SliderPercentagePicker
          pct={buyBurn}
          setPct={setBuyBurn}
          label="Buy Burn"
          helpMsg="Portion of the product that will be destroyed every time someone buys on cz.cash. Good for scarcity. Maximum 9.00%"
        />
          <SliderPercentagePicker
            pct={buyLpFee}
            setPct={setBuyLpFee}
            label="Buy LP Fee"
            helpMsg="Percentage of each buy that will be added to liquidity. Good for increasing price stability and reducing slippage. May greatly increase trading gas costs."
          />
          <SliderPercentagePicker
            pct={sellLpFee}
            setPct={setSellLpFee}
            label="Sell LP Fee"
            helpMsg="Percentage of each sell that will be added to liquidity. Good for increasing price stability and reducing slippage. May greatly increase trading gas costs"
          />

          <SliderPercentagePicker
            pct={sellBurn}
            setPct={setSellBurn}
            label="Sell Burn"
            helpMsg="Portion of the product that will be destroyed every time someone sells on cz.cash. Good for scarcity. Maximum 9.00%"
          />
          <TextFieldStyled
            text={czusdWad}
            setText={setCzusdWad}
            maxChar={18}
            width="11em"
            label="CZUSD LP Grant"
            helpMsg="CZUSD portion of the LP grant. The total LP will be worth 2x this amount"
          />
          <TextFieldStyled
            text={balanceMax}
            setText={setBalanceMax}
            maxChar={18}
            width="11em"
            label="Max Balance For Accounts"
            helpMsg="Maximum balance for each account. Accounts cannot receive tokens that would cause them to go over this balance. Must be at least 0.01% of supply. Good for reducing some types of bots and snipers."
          />
          <TextFieldStyled
            text={transactionSizeMax}
            setText={setTransactionSizeMax}
            maxChar={18}
            width="11em"
            label="Max Transaction Size"
            helpMsg="Maximum transaction size. Buys and sells over this amount fail. Must be at least 0.01% of supply. Good for reducing some types of bots and snipers."
          />
          <TextFieldStyled
            text={taxReceiver}
            setText={setTaxReceiver}
            maxChar={42}
            width="25em"
            label="Fee Receiver"
            helpMsg="Account that receives fees from Buy Fee and Sell Fee. Exempt from all fees and burns."
          />
          <TextFieldStyled
            text={tokenLogoCID}
            setText={setTokenLogoCID}
            maxChar={70}
            width="36em"
            label="Product Logo(IPFS CID)"
            helpMsg="Shortened name for your new product. Up to 5 characters."
          />
          {tokenLogoCID && (
            <Box
              as="img"
              src={'https://' + getIpfsUrl('ipfs.io/ipfs/' + tokenLogoCID)}
              sx={{
                width: '3.5em',
                height: '3.5em',
                margin: 0,
                marginLeft: '0.5em',
                padding: 0,
                backgroundColor: 'white',
                border: 'solid 0.15em white',
                borderRadius: '5em',
                '&:hover': {
                  border: 'solid 0.15em grey',
                  backgroundColor: 'grey',
                },
              }}
            />
          )}

          <TextFieldStyled
            text={descriptionMarkdownCID}
            setText={setDescriptionMarkdownCID}
            maxChar={70}
            width="36em"
            label="Product Description IPFS CID(IPFS CID)"
            helpMsg="IPFS CID (hash) of the product’s description in CommonMark. Upload and pin the description .md file first, then copy the IPFS CID here. Acceps MD file in CommonMark format. Must be smaller than 10kb."
          />

          <DatePickerStyled className='datepicker'
            text={launchTimestamp}
            backgroundColor="#fff"
            setText={setLaunchTimestamp}
            label="Launch Time"
            helpMsg="Optional time for token to open trading. Exempt accounts, such as the taxReceiver wallet, can trade before opening. You can add more exempt accounts after creating this product."
          />


          {descriptionMarkdownCID &&
            <div className="descriptionbox">
              <h2>Your description content:-</h2>
              <Markdown>{content}</Markdown></div>
          }
        </>}

      </Stack>
      <br />
      {!!address ?
        (chain.id == 97 ?
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
                    }`} 50ms infinite ease`,
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
                your currently connected wallet.
                <br />
                <br />
                <ul className="homelist">
                  <li>Name: <span>{name}</span></li>
                  <li>Symbol: <span>{symbol}</span></li>
                  <li>Liquidity:<span> $10,000 </span></li>
                  <li>Supply: <span>5,000 {symbol}</span></li>
                  <li>Buy Fee: <span>{(buyTax / 100).toFixed(2)}%</span></li>
                  <li>Buy Burn: <span>{(buyBurn / 100).toFixed(2)}%</span></li>
                  <li>Sell Fee: <span>{(sellTax / 100).toFixed(2)}%</span></li>
                  <li>Sell Burn: <span>{(sellBurn / 100).toFixed(2)}%</span></li>
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
      <ToastContainer />
      <>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          rowGap={1}
        >
          <Typography className="hedding" as="h1" sx={{ fontSize: '2em' }}>
            TenX Products
          </Typography>
          <TenXTokenList className="productbox"/>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          rowGap={1}
        >
          <Typography className="hedding" as="h1" sx={{ fontSize: '2em' }}>
            Starred Products
          </Typography>
          <TenXTokenListPinned/>
        </Stack>

      </>
      <>
        <Container className="contentbox">
          <Grid2
            container
            justifyContent="center"
            alignItems="center"
            rowSpacing={3}
            columnSpacing={3}
            maxWidth={1440}
          >
            <Grid2
              xs={12}
              sm={8}
              css={{
                [mq(bp.xs)]: { textAlign: 'center' },
                [mq(bp.sm)]: { textAlign: 'right' },
              }}
            >
              <Stack
                direction="row"
                spacing={4}
                alignItems="center"
                justifyContent="flex-end"
              >

                {/*<MenuLinkSocialIcon
                  href={LINK_DISCORD}
                  src="./images/icons/Discord-Blue-Light.svg"
                  alt="Discord"
                  width={27}
                  height={23}
                />*/}
              </Stack>
            </Grid2>

            <Grid2 className="Instructions">
              <Grid2 xs={12}>
                <h1>Instructions:</h1>
                <ul>
                  <li><Box as="a" color="white" target="_blank" href={'https://docs.ipfs.tech/quickstart/publish/#pinning-services'}>How to genrate a mark down file</Box></li>
                  <li><Box as="a" color="white" target="_blank" href={'https://commonmark.org/help/'}>How to create an IPFS Link for Token logo and Token Description</Box></li>
                </ul>
              </Grid2>
            </Grid2>


            <Grid2 className="box1">
              <Grid2 xs={12}>
                <h1>Terms of Use</h1>
              </Grid2>
              <Grid2 xs={12}>
                <p>
                  By accessing any CZODIAC website, including but not limited to
                  CZODIAC's applications and services, and engaging in any
                  activities related to the CZODIAC ecosystem, including buying,
                  selling, trading, holding CZODIAC products, or participating in
                  the CZODIAC community, users acknowledge that they have read,
                  understood, and agreed to be bound by the terms and conditions
                  set forth in CZODIAC's Terms of Use. The Terms of Use, available
                  at{' '}
                  <a css={{ color: 'antiquewhite' }} href={LINK_TERMS_OF_USE}>
                    {LINK_TERMS_OF_USE}
                  </a>
                  , constitute a legally binding agreement between users and
                  CZODIAC, and users should review them carefully before engaging
                  in any activities related to the CZODIAC ecosystem. If users do
                  not agree to the terms and conditions set forth in the Terms of
                  Use, they should not access or use CZODIAC's websites, dapps,
                  products, or other offerings. By using any CZODIAC website,
                  users represent and warrant that they have the legal capacity to
                  enter into a binding agreement with CZODIAC and that they comply
                  with all applicable laws and regulations.
                  <br />
                  <br />
                  <a css={{ color: 'antiquewhite' }} href={LINK_TERMS_OF_USE}>
                    LINK TO TERMS OF USE
                  </a>
                </p>
              </Grid2>
            </Grid2>
            <Grid2 className="box1">
              <Grid2 xs={12}>
                <h1>Privacy Policy</h1>
              </Grid2>
              <Grid2 xs={12}>
                <p>
                  At CZODIAC, we are committed to protecting the privacy and
                  personal information of our users. We encourage you to read our
                  Privacy Policy, which can be found at{' '}
                  <a css={{ color: 'antiquewhite' }} href={LINK_PRIVACY_POLICY}>
                    {LINK_PRIVACY_POLICY}
                  </a>
                  . This policy outlines the types of personal information that
                  CZODIAC may collect, the purposes for which this information is
                  used, and the steps taken to ensure the security and
                  confidentiality of your personal data. By using CZODIAC's
                  websites or services, you acknowledge that you have read and
                  understood our Privacy Policy and consent to the collection,
                  use, and disclosure of your personal information as described
                  therein. If you have any questions or concerns about our privacy
                  practices, please contact us at team@czodiac.com.
                  <br />
                  <br />
                  <a css={{ color: 'antiquewhite' }} href={LINK_PRIVACY_POLICY}>
                    LINK TO PRIVACY POLICY
                  </a>
                </p>
              </Grid2>
            </Grid2>


          </Grid2>
        </Container>
        <FooterArea />

      </>

    </>
  );
}