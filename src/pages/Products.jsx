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
  const { index, chainId } = useParams();
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
          chainId:'97',
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
    <div Class="detailspage">
      <Header />
      <div class="maindetails">
      <div class="leftbox">
      <li class="sharebtn">
      <Button variant="contained" color="primary" onClick={handleCopy}>
        Share Product
      </Button><br/>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
      </li>
      <Box
        as="img"
        src={details.tenXToken.tokenLogoCID}
        sx={{
          width: '5em',
          heigh: '5em',
          backgroundColor: 'white',
          border: 'solid 0.15em white',
          borderRadius: '5em',
        }}
      /><br/><br/>
     <li> Name: <span>{details.tenXToken.name}</span></li>
     <li>Symbol: <span>{details.tenXToken.symbol}</span></li>
     <li>Image CID: <span>{details.tenXToken.tokenLogoCID.split('/')[4]} edit</span></li>
     <li>Price in CZUSD</li>
     <li>Launch timestamp in epoch number: <span>{timestamp}</span></li>
     <li>Launch timestamp in local time: <span>{details.tenXToken.launchTimestamp.toString()}</span></li>
     <li>Connected wallet’s holdings: <span>{holdings}</span></li>
     <li>Total Supply</li>
      <li>Total LP Value in CZUSD</li>
      <li>Market capitalization</li>
      <li>Token Description CID: <span>{details.tenXToken.descriptionMarkdownCID.split('/')[4]} edit</span></li>
      <li>Token Description:<span> {content} </span></li>
      <li>Total Buy/Sell Taxes: <span>{details.tenXToken.buyTax+details.tenXToken.sellTax}</span></li>
      <li>Buy Tax: <span>{details.tenXToken.buyTax} edit </span></li>
      <li>Sell Tax: <span>{details.tenXToken.sellTax} edit</span></li>
      <li>Buy Burn: <span>{details.tenXToken.buyBurn} edit </span></li>
      <li>Sell Burn: <span>{details.tenXToken.sellBurn_} edit </span></li>
      <li>Buy LP Fee: <span>{details.tenXToken.buyLpFee} edit </span></li>
      <li>Sell LP Fee: <span>{details.tenXToken.sellTax} edit </span></li>
      <li>Balance Max: <span>{details.tenXToken.balanceMax} edit </span></li>
      <li>Transaction Max:<span> {details.tenXToken.transactionSizeMax} edit</span></li>
      <li>Is Connected Wallet Exempt True/false</li>
      <li>(ONLY SHOW TO MANAGER) Set Exempt Wallet: <span>True/False edit</span></li>
      <li>Token contract address: <span><Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + details.tenXToken.tokenAddress}
      >
        {details.tenXToken.tokenAddress}
      </Typography></span></li>
      <li>LP Address: <span><Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + details.tenXToken.czusdPair}
      >
        {details.tenXToken.czusdPair}
      </Typography></span></li>
      <li>Tax Receiver address: <span><Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + details.tenXToken.taxReceiver}
      >
        {details.tenXToken.taxReceiver}
      </Typography> edit</span></li>
      <li>TenX Setting address: <span><Typography
        as="a"
        color="black"
        target="_blank"
        href={chain?.blockExplorers?.default?.url + '/address/' + '0xd28c22d8194a33c90d98bCFe331EbfEe9d4fC1C9'}
      >
        0xd28c22d8194a33c90d98bCFe331EbfEe9d4fC1C9
      </Typography></span></li>
      <li>Total taxes in tokens/usd: <span>event TenXToken.TaxesCollected</span></li>
      <li>Total burn in tokens/usd: <span>event TenXToken.TaxesCollected</span></li>
      <li>Total lp in tokens/usd: <span>event TenXToken.TaxesCollected</span></li>
      <li>Initial CZUSD grant: 0</li>
      <li class='detailspagebtn'>
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
      </li>
      </div>
     
      </div>

      <FooterArea />
    </div>
    
  )
}

export default Products   