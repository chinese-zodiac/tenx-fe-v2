import React, { useState } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import ConnectWallet from '../components/elements/ConnectWallet';
import {
  Typography,
  Box,
  Stack,
  TextField,
  Slider,
  keyframes,
} from '@mui/material';
import FooterArea from '../components/layouts/FooterArea';
import { LINK_TELEGRAM } from '../constants/links';
import ButtonPrimary from '../components/styled/ButtonPrimary';
import { ADDRESS_TENXLAUNCHV2, ADDRESS_ZERO } from '../constants/addresses';
import { parseEther } from 'viem';
import TenXLaunchV2Abi from '../abi/TenXLaunchV2.json';
import DialogTransaction from '../components/styled/DialogTransaction';
import TenXToken from '../components/styled/TenXToken';
import useTenXToken from '../hooks/useTenXToken';
import SliderPercentagePicker from '../components/styled/SliderPercentagePicker';
import TextFieldStyled from '../components/styled/TextFieldStyled';
import TenXTokenList from '../components/elements/TenXTokenList';
import ReactGA from 'react-ga4';
import DatePickerStyled from '../components/styled/DatePickerStyled';

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const [name, setName] = useState('ProductX');
  const [symbol, setSymbol] = useState('PRDX');
  const [buyTax, setBuyTax] = useState(25);
  const [buyBurn, setBuyBurn] = useState(25);
  const [sellTax, setSellTax] = useState(275);
  const [sellBurn, setSellBurn] = useState(175);
  const [czusdWad, setCzusdWad] = useState('5000');
  const [tokenLogoCID, setTokenLogoCID] = useState('bafkreihj6w2jbkdq4v5ldqnd4exnzjqels677y3kv32o45c5jyfsbqnl5a');
  const [descriptionMarkdownCID, setDescriptionMarkdownCID] = useState('bafkreicj6kky6yh4dbgsydfngliw7dg66qoshqapykzd4mfezqsvnujnbm');
  const [balanceMax, setBalanceMax] = useState('5000');
  const [transactionSizeMax, setTransactionSizeMax] = useState('1000');
  const [taxReceiver, setTaxReceiver] = useState(address);
  const [buyLpFee, setBuyLpFee] = useState(0);
  const [sellLpFee, setSellLpFee] = useState(0);
  const [launchTimestamp, setLaunchTimestamp] = useState();

  console.log({launchTimestamp});

  return (
    <>
      <ConnectWallet />
      <Box
        as="img"
        src="./logo.png"
        sx={{
          width: '10em',
          height: '10em',
          marginTop: '1em',
        }}
      />
      <Typography as="h1" sx={{ fontSize: '2em' }}>
        Create Your Digital Product in Seconds.
      </Typography>

      <Typography
        as="p"
        sx={{
          maxWidth: '360px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '1em',
          lineHeight: '1.2em',
        }}
      >
        Unlock Community Value, Digital Marketing,
        <br />
        Free Marketing, and $10,000 Business Grants
        <br />
        <br />
        Ask Questions On Telegram:
        <br />
        <Typography
          as="a"
          href={LINK_TELEGRAM}
          target="_blank"
          rel="noreferrer"
          sx={{ color: '#f0eeed' }}
        >
          {LINK_TELEGRAM}
        </Typography>
      </Typography>
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
          pct={buyBurn}
          setPct={setBuyBurn}
          label="Buy Burn"
          helpMsg="Portion of the product that will be destroyed every time someone buys on cz.cash. Good for scarcity. Maximum 9.00%"
        />
        <SliderPercentagePicker
          pct={sellTax}
          setPct={setSellTax}
          label="Sell Fee"
          helpMsg="Fee that will be sent to your account every time someone sells your product on cz.cash. Good for revenue. Maximum 9.00%"
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
          text={tokenLogoCID}
          setText={setTokenLogoCID}
          maxChar={70}
          width="36em"
          label="Product Logo(IPFS CID)"
          helpMsg="Shortened name for your new product. Up to 5 characters."
        />
        <TextFieldStyled
          text={descriptionMarkdownCID}
          setText={setDescriptionMarkdownCID}
          maxChar={70}
          width="36em"
          label="Product Description IPFS CID(IPFS CID)"
          helpMsg="IPFS CID (hash) of the product’s description in CommonMark. Upload and
pin the description .md file first, then copy the IPFS CID here. Acceps MD file in
CommonMark format. Must be smaller than 10kb."
        />
        <TextFieldStyled
          text={balanceMax}
          setText={setBalanceMax}
          maxChar={18}
          width="11em"
          label="Max Balance For Accounts"
          helpMsg="Maximum balance for each account. Accounts cannot receive tokens that
would cause them to go over this balance. Must be at least 0.01% of supply. Good
for reducing some types of bots and snipers."
        />
        <TextFieldStyled
          text={transactionSizeMax}
          setText={setTransactionSizeMax}
          maxChar={18}
          width="11em"
          label="Max Transaction Size"
          helpMsg="Maximum transaction size. Buys and sells over this amount fail. Must be at
least 0.01% of supply. Good for reducing some types of bots and snipers."
        />
        <TextFieldStyled
          text={taxReceiver}
          setText={setTaxReceiver}
          maxChar={42}
          width="25em"
          label="Fee Receiver"
          helpMsg="Account that receives fees from Buy Fee and Sell Fee. Exempt from all fees
and burns."
        />
        <SliderPercentagePicker
          pct={buyLpFee}
          setPct={setBuyLpFee}
          label="Buy LP Fee"
          helpMsg="Percentage of each buy that will be added to liquidity. Good for increasing
price stability and reducing slippage. May greatly increase trading gas costs."
        />
        <SliderPercentagePicker
          pct={sellLpFee}
          setPct={setSellLpFee}
          label="Sell LP Fee"
          helpMsg="Percentage of each sell that will be added to liquidity. Good for increasing
price stability and reducing slippage. May greatly increase trading gas costs"
        />
        <DatePickerStyled
          text={launchTimestamp}
          setText={setLaunchTimestamp}
          label="Launch Time"
          helpMsg="Optional time for token to open trading. Exempt accounts, such as the
taxReceiver wallet, can trade before opening. You can add more exempt accounts
after creating this product."
        />
      </Stack>
      <br />
      {!!address ? (
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
            launchTimestamp //launchTimestamp
          ]}
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
            transaction costs approximately 0.015 BNB. Taxes will be sent to
            your currently connected wallet.
            <br />
            <br />
            Name: {name}
            <br />
            Symbol: {symbol}
            <br />
            Liquidity: $10,000
            <br />
            Supply: 5,000 {symbol}
            <br />
            Buy Fee: {(buyTax / 100).toFixed(2)}%<br />
            Buy Burn: {(buyBurn / 100).toFixed(2)}%<br />
            Sell Fee: {(sellTax / 100).toFixed(2)}%<br />
            Sell Burn: {(sellBurn / 100).toFixed(2)}%
            <br />
            <br />
            Tax Receiver: {address.substring(0, 8)}...{address.substring(36)}
          </Typography>
        </DialogTransaction>
      ) : (
        <ButtonPrimary
          onClick={() => {
            ReactGA.event({
              category: 'tenx_action',
              action: 'click_createnow_btn_1_not_connected',
              label:
                'Click on "create now btn 1" on tenx.cz.cash when not connected', // optional
            });
            alert('Connect your BSC (BNB Smart Chain) Wallet first.');
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
          CREATE NOW 🚀
        </ButtonPrimary>
      )}

      <br />
      <br />
      <br />
      <br />
      <br />
      <Typography as="h1" sx={{ fontSize: '2em' }}>
        TenX Products
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        flexWrap="wrap"
        rowGap={1}
      >
        <TenXTokenList start={0} />
      </Stack>
      <FooterArea />
    </>
  );
}
