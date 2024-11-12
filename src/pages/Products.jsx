import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { readContract } from '@wagmi/core';
import TenXTokenV2Abi from '../abi/TenXTokenV2.json';
import { Box, Stack, styled } from '@mui/system';
import useTenXToken from '../hooks/useTenXToken';
import { useAccount, useNetwork } from 'wagmi';
import Header from '../components/elements/Header';
import FooterArea from '../components/layouts/FooterArea';
import ButtonPrimary from '../components/styled/ButtonPrimary';
import { czCashBuyLink } from '../utils/czcashLink';
import { Typography, Button, Snackbar, Alert, IconButton } from '@mui/material';
import ConnectWallet from '../components/elements/ConnectWallet';
import { ADDRESS_TENXLAUNCHVIEWV2, ADDRESS_TENXSETTINGSV2 } from '../constants/addresses';
import TenXLaunchViewV2Abi from '../abi/TenXLaunchViewV2.json';
import DOMPurify from 'dompurify';
import Markdown from 'react-markdown'

import { keccak256, toBytes } from 'viem';
import { SettingsInputComponent } from '@mui/icons-material';

const Products = () => {
  const { index, chainId } = useParams();

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { tenXToken } = useTenXToken(index);

  const date = new Date(tenXToken.launchTimestamp.toString());
  const timestamp = Math.floor(date.getTime() / 1000);
  const [content, setContent] = useState('Loading...');
  const [holdings, setHoldings] = useState('Loading...');
  const [exempt, setExempt] = useState('Loading...');
  const [role, setRole] = useState(false);
  const [totalTax, setTotalTax] = useState('Loading...');
  const [totalBurn, setTotalBurn] = useState('Loading...');
  const BlueIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor:'cyan',
    border: '2px solid #1976d2',
    borderRadius: '50px',
    color: '#1976d2',
    marginTop: '12px',
    marginRight: '12px',
    fontSize: '15px',
    '&:hover': {
      color: '#1565c0',
      borderColor: '#1565c0',
    },
  }));
  useEffect(() => {
    const fetchFileContent = async (ipfsLink) => {
      try {
        const response = await fetch('https://ipfs.io/ipfs/' + ipfsLink);
        const text = await response.text();
        const sanitizedText = DOMPurify.sanitize(text);
        setContent(sanitizedText);
      } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        setContent('No data found'); // Update state with error message
      }
    };

    fetchFileContent(tenXToken.descriptionMarkdownCID); // Call the async function
  }, []);

  useEffect(() => {
    const getHoldings = async () => {
      try {
        const result = address ? await readContract({
          address: tenXToken.tokenAddress,
          abi: TenXTokenV2Abi,
          functionName: 'balanceOf',
          args: [address]
        }) : 'Not found';

        setHoldings(result.toString());
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setHoldings('Not found');
      }
    };

    const getTaxDetails = async () => {
      try {
        const result = await readContract({
          address: ADDRESS_TENXLAUNCHVIEWV2,
          abi: TenXLaunchViewV2Abi,
          functionName: 'getTenXTokenFees',
          args: [tenXToken.tokenAddress],
          chainId: parseInt(chainId),
        });
        setTotalTax((parseInt(result[0]) / 10 ** 18).toString());
        setTotalBurn((parseInt(result[1]) / 10 ** 18).toString());
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setContent('Not found');
      }
    };
    const getTokenDetails = async () => {
      try {
        const result = address ? await readContract({
          address: tenXToken.tokenAddress,
          abi: TenXTokenV2Abi,
          functionName: 'isExempt',
          chainId: parseInt(chainId),
          args: [address],
        }) :
          false;
        setExempt(result.toString());

      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setContent('Not found');
      }
    };
    const getRole = async () => {
      try {
        const result = address ? await readContract({
          address: tenXToken.tokenAddress,
          abi: TenXTokenV2Abi,
          functionName: 'hasRole',
          args: [keccak256(toBytes('MANAGER_ROLE')), address]
        }) : false;
        setRole(result);
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setRole(false);
      }
    };
    getRole();
    getTokenDetails()
    getTaxDetails();
    getHoldings();
  }, [chain, tenXToken.tokenAddress]);

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
    <div className="detailspage">
      <Header />
      <Box sx={{maxWidth:'960px',marginLeft:'auto',marginRight:'auto','& > *':{marginBottom:'1em'}}}>
          {!!tenXToken ? (<><Box sx={{padding:'1em'}}>
            <Box
              as="img"
              src={'https://ipfs.io/ipfs/' + tenXToken.tokenLogoCID}
              sx={{
                width: '5em',
                heigh: '5em',
                backgroundColor: 'white',
                border: 'solid 0.15em white',
                borderRadius: '5em',
                display:'inline-block',
                marginRight:'1em'
              }}
            />
            <Box sx={{display:'inline-block'}}>
              <Typography as="h1" sx={{fontSize:'2em',lineHeight:'1em'}}>{tenXToken.name}</Typography>
              <Typography as="h2">{tenXToken.symbol}</Typography>
              <Typography sx={{fontSize:'3em',lineHeight:'1em'}} >${Number(tenXToken.price).toFixed(2)}</Typography>
              
            </Box>
          </Box>
          <Stack className="sharebtn" sx={{justifyContent:'center',gap:'1em',flexDirection:'row'}}>
            <ButtonPrimary
                as="a"
                target="_blank"
                href={czCashBuyLink('BNB', tenXToken.tokenAddress)}
                sx={{
                  display:'block',
                  width: '6em',
                  fontSize: '1.5em',
                  padding: 0,
                  position: 'relative',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  color: '#e16b31',
                  borderRadius: '1.5em',
                  border: 'solid 2px #e16b31',
                  backgroundColor: '#f3f3f3',
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: '#080830',
                  },
                }}
              >
                BUY {tenXToken.symbol?.slice(0, 7)}

              </ButtonPrimary>
              <ButtonPrimary sx={{
                    display:'block',
                    width: '6em',
                    fontSize: '1.5em',
                    padding: 0,
                    position: 'relative',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    color: '#e16b31',
                    borderRadius: '1.5em',
                    border: 'solid 2px #e16b31',
                    backgroundColor: '#f3f3f3',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: '#080830',
                    },
                  }} onClick={handleCopy}>
                Share {tenXToken.symbol}
              </ButtonPrimary>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity="success">
                Link copied to clipboard!
              </Alert>
            </Snackbar>
          </Stack>
          <Box className="sharebtn" sx={{display:"inline-block"}}>
            {role && <BlueIconButton
              component="a"
              href={`/#/settings/${chain?.id}/${tenXToken.tokenIndex}`}
            >
              <SettingsInputComponent fontSize='20px' /> &nbsp;
              Edit {tenXToken.symbol}
            </BlueIconButton>}
          </Box>
          <Box className="descriptionbox">
          <Markdown>{content}</Markdown>
          </Box>
          <Box className="descriptionbox">
          <li> Name: <span>{tenXToken.name}{/*  <a className='edit' href='#'>Edit</a>*/}</span></li>
          <li>Symbol: <span>{tenXToken.symbol}</span></li>
          <li>Image CID: <span>{tenXToken.tokenLogoCID} </span></li>

          <li>Price in CZUSD: <span>$ {Number(tenXToken.price).toFixed(2)}</span></li>
          <li>Launch timestamp in epoch number: <span>{timestamp}</span></li>
          <li>Launch timestamp in local time: <span>{tenXToken.launchTimestamp.toString()}</span></li>
          <li>Connected wallet’s holdings: <span>{holdings}</span></li>
          <li>Total Supply: <span>{Number(tenXToken.totalSupply).toFixed(2)}</span></li>
          <li>Total LP Value in CZUSD:<span>$ {Number(tenXToken.totalLpValue).toFixed(2)}</span></li>
          <li>Market capitalization:<span>$ {Number(tenXToken.marketCap).toFixed(2)}</span></li>
          <li>Token Description CID: <span>{tenXToken.descriptionMarkdownCID} </span></li>
          <li>Total Buy/Sell Taxes: <span>{(tenXToken.buyTax + tenXToken.sellTax) / 100} %</span></li>
          <li>Buy Tax: <span>{tenXToken.buyTax / 100} %</span></li>
          <li>Sell Tax: <span>{tenXToken.sellTax / 100} %</span></li>
          <li>Buy Burn: <span>{tenXToken.buyBurn / 100} %</span></li>
          <li>Sell Burn: <span>{tenXToken.sellBurn / 100} %</span></li>
          <li>Buy LP Fee: <span>{tenXToken.buyLpFee / 100} %</span></li>
          <li>Sell LP Fee: <span>{tenXToken.sellLpFee / 100} %</span></li>
          <li>Balance Max: <span>{tenXToken.balanceMax}  </span></li>
          <li>Transaction Max:<span> {tenXToken.transactionSizeMax} </span></li>
          <li>Is Connected Wallet Exempt <span>{exempt?'Yes':'No'} </span></li>
          <li>Token contract address: <span><Typography
            as="a"
            color="black"
            target="_blank"
            href={chain?.blockExplorers?.default?.url + '/address/' + tenXToken.tokenAddress}
          >
            {tenXToken.tokenAddress}
          </Typography></span></li>
          <li>LP Address: <span><Typography
            as="a"
            color="black"
            target="_blank"
            href={chain?.blockExplorers?.default?.url + '/address/' + tenXToken.czusdPair}
          >
            {tenXToken.czusdPair}
          </Typography></span></li>
          <li>Tax Receiver address: <span><Typography
            as="a"
            color="black"
            target="_blank"
            href={chain?.blockExplorers?.default?.url + '/address/' + tenXToken.taxReceiver}
          >
            {tenXToken.taxReceiver}
          </Typography> </span></li>
          <li>TenX Setting address: <span><Typography
            as="a"
            color="black"
            target="_blank"
            href={chain?.blockExplorers?.default?.url + '/address/' + ADDRESS_TENXSETTINGSV2}
          >
            {ADDRESS_TENXSETTINGSV2}
          </Typography></span></li>
          <li>Total taxes in tokens/usd: <span>$ {Number(totalTax).toFixed(2)}</span></li>
          <li>Total burn in tokens/usd: <span>$ {Number(totalBurn).toFixed(2)}</span></li>
          <li>Total lp in tokens/usd: <span>$ {Number(tenXToken.totalLpValue).toFixed(2)}</span></li>
          <li>Initial CZUSD grant: <span>$ {tenXToken.initialSupply}</span></li>
          
          </Box>
          <div className='detailspagebtn'>
            {chain ?
              <ButtonPrimary
                as="a"
                target="_blank"
                href={czCashBuyLink('BNB', tenXToken.tokenAddress)}
                sx={{
                  width: '100%',
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
                BUY {tenXToken.symbol?.slice(0, 7)}

              </ButtonPrimary>
              :
              <ConnectWallet />}
          </div>
          </>) : "LOADING DATA FROM BLOCKCHAIN... Please be patient"}
      </Box>

      <FooterArea />
    </div>

  )
}

export default Products   