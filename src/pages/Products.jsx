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
import ConnectWallet from '../components/elements/ConnectWallet';
import { ADDRESS_TENXLAUNCHVIEWV2, ADDRESS_TENXSETTINGSV2 } from '../constants/addresses';
import TenXLaunchViewV2Abi from '../abi/TenXLaunchViewV2.json';
import DOMPurify from 'dompurify';
import Markdown from 'react-markdown'

import { keccak256, toBytes } from 'viem';

const Products = () => {
  const { index, chainId } = useParams();

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { tenXToken } = useTenXToken(index);

  const date = new Date(tenXToken.launchTimestamp.toString());
  const timestamp = Math.floor(date.getTime() / 1000);
  const [content, setContent] = useState('Loading...');
  const [holdings, setHoldings] = useState('Loading...');
  const [manager, setManager] = useState('Loading...');
  const [exempt, setExempt] = useState('Loading...');
  const [role, setRole] = useState(false);
  const [totalTax, setTotalTax] = useState('Loading...');
  const [totalBurn, setTotalBurn] = useState('Loading...');

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
        const result = await readContract({
          address: tenXToken.tokenAddress,
          abi: TenXTokenV2Abi,
          functionName: 'MANAGER_ROLE',
          chainId: parseInt(chainId),
        });
        setManager(result.toString());
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setContent('Not found');
      }
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
      <div className="maindetails">
        <div className="leftbox">
          <div className="sharebtn">
            <Button variant="contained" color="primary" onClick={handleCopy}>
              Share Product
            </Button><br />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity="success">
                Link copied to clipboard!
              </Alert>
            </Snackbar>
          </div>
          <Box
            as="img"
            src={'https://ipfs.io/ipfs/' + tenXToken.tokenLogoCID}
            sx={{
              width: '5em',
              heigh: '5em',
              backgroundColor: 'white',
              border: 'solid 0.15em white',
              borderRadius: '5em',
            }}
          /><br /><br />
          <li>Description: <span className='discriptionbox'><Markdown>{content}</Markdown></span></li>
          <li> Name: <span>{tenXToken.name}</span></li>
          <li>Symbol: <span>{tenXToken.symbol}</span></li>
          <li>Image CID: <span>{tenXToken.tokenLogoCID} </span></li>

          <li>Price in CZUSD: <span>{tenXToken.price}</span></li>
          <li>Launch timestamp in epoch number: <span>{timestamp}</span></li>
          <li>Launch timestamp in local time: <span>{tenXToken.launchTimestamp.toString()}</span></li>
          <li>Connected wallet’s holdings: <span>{holdings}</span></li>
          <li>Total Supply: <span>{tenXToken.totalSupply}</span></li>
          <li>Total LP Value in CZUSD:<span>{tenXToken.totalLpValue} </span></li>
          <li>Market capitalization:<span>{tenXToken.marketCap}</span></li>
          <li>Token Description CID: <span>{tenXToken.descriptionMarkdownCID} </span></li>
          <li>Total Buy/Sell Taxes: <span>{tenXToken.buyTax + tenXToken.sellTax}</span></li>
          <li>Buy Tax: <span>{tenXToken.buyTax} </span></li>
          <li>Sell Tax: <span>{tenXToken.sellTax} </span></li>
          <li>Buy Burn: <span>{tenXToken.buyBurn}  </span></li>
          <li>Sell Burn: <span>{tenXToken.sellBurn}  </span></li>
          <li>Buy LP Fee: <span>{tenXToken.buyLpFee}  </span></li>
          <li>Sell LP Fee: <span>{tenXToken.sellTax}  </span></li>
          <li>Balance Max: <span>{tenXToken.balanceMax}  </span></li>
          <li>Transaction Max:<span> {tenXToken.transactionSizeMax} </span></li>
          <li>Is Connected Wallet Exempt <span>{exempt} </span></li>
          {role && <li>Set Exempt Wallet: </li>}
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
          <li>Total taxes in tokens/usd: <span>{totalTax}</span></li>
          <li>Total burn in tokens/usd: <span>{totalBurn}</span></li>
          <li>Total lp in tokens/usd: <span>{tenXToken.totalLpValue}</span></li>
          <li>Initial CZUSD grant: <span>{tenXToken.initialSupply}</span></li>
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
        </div>

      </div>

      <FooterArea />
    </div>

  )
}

export default Products   