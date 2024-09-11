import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { readContract } from '@wagmi/core';
import TenXTokenV2Abi from '../abi/TenXTokenV2.json';
import { Box } from '@mui/system';
import useTenXToken from '../hooks/useTenXToken';
import { useAccount, useNetwork } from 'wagmi';
import Header from '../components/elements/Header';
import FooterArea from '../components/layouts/FooterArea';
import ButtonPrimary from '../components/styled/ButtonPrimary';
import { czCashBuyLink } from '../utils/czcashLink';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
const Products = () => {
  const { index } = useParams();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const details = useTenXToken(index);
  console.log({ details })
  const date = new Date(details.tenXToken.launchTimestamp.toString());
  const timestamp = Math.floor(date.getTime() / 1000);

  const [content, setContent] = useState('Loading...');
  const [holdings, setHoldings] = useState('Loading...');
  useEffect(() => {
    const fetchFileContent = async (ipfsLink) => {
      try {
        const response = await fetch(ipfsLink);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        setContent('No data found'); // Update state with error message
      }
    };

    fetchFileContent(details.tenXToken.descriptionMarkdownCID); // Call the async function
  }, []);

  useEffect(() => {
    const getHoldings = async () => {
      try {
        const result = await readContract({
          address: details.tenXToken.tokenAddress,
          abi: TenXTokenV2Abi,
          functionName: 'balanceOf',
          args: [address]
        });
        setHoldings(result.toString());
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setContent('No data found');
      }
    };

    getHoldings(); // Call the async function
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleCopy = async () => {
    try {
      // Use the Clipboard API to write the URL to the clipboard
      await navigator.clipboard.writeText(window.location.href);
      
      // Open Snackbar to provide feedback
      setOpen(true);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <div>
      <Header />
      Image CID: {details.tenXToken.tokenLogoCID.split('/')[4]} edit<br/>
      Image Logo <Box
        as="img"
        src={details.tenXToken.tokenLogoCID}
        sx={{
          width: '5em',
          heigh: '5em',
          backgroundColor: 'white',
          border: 'solid 0.15em white',
          borderRadius: '5em',
        }}
      /><br/>
      Name: {details.tenXToken.name}<br/>
      Symbol: {details.tenXToken.symbol}<br/>
      Price in CZUSD<br/>
      Launch timestamp in epoch number: {timestamp}<br/>
      Launch timestamp in local time: {details.tenXToken.launchTimestamp.toString()}<br/>
      Connected wallet’s holdings: {holdings}<br/>
      <Button variant="contained" color="primary" onClick={handleCopy}>
        Share Product
      </Button><br/>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
      Total Supply<br/>
      Total LP Value in CZUSD<br/>
      Market capitalization<br/>
      Token Description CID: {details.tenXToken.descriptionMarkdownCID.split('/')[4]} edit<br/>
      Token Description:<br/> {content}<br/>
      Total Buy/Sell Taxes: {details.tenXToken.buyTax+details.tenXToken.sellTax}<br/>
      Buy Tax: {details.tenXToken.buyTax} edit<br/>
      Sell Tax: {details.tenXToken.sellTax} edit<br/>
      Buy Burn: {details.tenXToken.buyBurn} edit<br/>
      Sell Burn: {details.tenXToken.sellBurn_} edit<br/>
      Buy LP Fee: {details.tenXToken.buyLpFee} edit<br/>
      Sell LP Fee: {details.tenXToken.sellTax} edit<br/>
      Balance Max: {details.tenXToken.balanceMax} edit<br/>
      Transaction Max: {details.tenXToken.transactionSizeMax} edit<br/>
      Is Connected Wallet Exempt True/false<br/>
      (ONLY SHOW TO MANAGER) Set Exempt Wallet: True/False edit<br/>
      Token contract address: <Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + details.tenXToken.tokenAddress}
      >
        {details.tenXToken.tokenAddress}
      </Typography><br/>
      LP Address: <Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + details.tenXToken.czusdPair}
      >
        {details.tenXToken.czusdPair}
      </Typography><br/>
      Tax Receiver address: <Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + details.tenXToken.taxReceiver}
      >
        {details.tenXToken.taxReceiver}
      </Typography> edit<br/>
      TenX Setting address: <Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + '0xd28c22d8194a33c90d98bCFe331EbfEe9d4fC1C9'}
      >
        0xd28c22d8194a33c90d98bCFe331EbfEe9d4fC1C9
      </Typography><br/>
      Total taxes in tokens/usd: event TenXToken.TaxesCollected<br/>
      Total burn in tokens/usd: event TenXToken.TaxesCollected<br/>
      Total lp in tokens/usd: event TenXToken.TaxesCollected<br/>
      Initial CZUSD grant: 0<br/>
      <ButtonPrimary
        as="a"
        target="_blank"
        href={czCashBuyLink('BNB', details.tenXToken.tokenAddress)}
        sx={{
          width: '100%',
          marginTop: '0em',
          fontSize: '1.5em',
          padding: 0,
          position: 'relative',
          fontWeight: 'bold',
          textTransform: 'none',
          color: '#e16b31',
          borderRadius: '1.5em',
          border: 'solid 2px #e16b31',
          backgroundColor: '#f3f3f3',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          textDecoration: 'none',
          '&:hover': {
            backgroundColor: '#080830',
          },
        }}
      >
        BUY {details.tenXToken.symbol?.substr(0, 7)}
      </ButtonPrimary>
      <FooterArea />
    </div>
  )
}

export default Products   