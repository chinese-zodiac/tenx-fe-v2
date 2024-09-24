import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { readContract, getConfig } from '@wagmi/core';
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
import { parseAbiItem } from 'viem'
import { ADDRESS_TENXLAUNCHVIEWV2, ADDRESS_TENXSETTINGSV2 } from '../constants/addresses';
import TenXLaunchViewV2Abi from '../abi/TenXLaunchViewV2.json';
import DOMPurify from 'dompurify';
const Products = () => {
  const { index, chainId } = useParams();

  const { address } = useAccount();
  const { chain } = useNetwork();
  const details = useTenXToken(index);

  const date = new Date(details.tenXToken.launchTimestamp.toString());
  const timestamp = Math.floor(date.getTime() / 1000);

  const [content, setContent] = useState('Loading...');
  const [holdings, setHoldings] = useState('Loading...');
  const [totalSupply, setTotalSupply] = useState('Loading...');
  const [initialGrant, setInitialGrant] = useState('Loading...');
  const [price, setPrice] = useState('Loading...');
  const [marketCap, setMarketCap] = useState('Loading...');
  const [totalLpValue, setTotalLpValue] = useState('Loading...');
  const [manager, setManager] = useState('Loading...');
  const [exempt, setExempt] = useState('Loading...');
  const [role, setRole] = useState(false);

  const config = getConfig();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const latestBlock = await config.publicClient.getBlockNumber();
        const fromBlock = 43529178n;
        const maxBlocksPerQuery = 50000n;
        let logs = [];

        // Fetch logs in chunks
        for (let startBlock = fromBlock; startBlock <= latestBlock; startBlock += maxBlocksPerQuery) {
          const endBlock = startBlock + maxBlocksPerQuery - 1n <= latestBlock ? startBlock + maxBlocksPerQuery - 1n : latestBlock;
          const chunkLogs = await config.publicClient.getLogs({
            address: details.tenXToken.tokenAddress,
            event: parseAbiItem('event TaxesCollected(uint256 taxWad, uint256 burnWad, uint256 lpWad)'),
            fromBlock: startBlock,
            toBlock: endBlock
          });
          logs = logs.concat(chunkLogs);
        }
        console.log('Logs:', logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchEvents();
  }, [details.tenXToken.tokenAddress, config]);


  useEffect(() => {
    const fetchFileContent = async (ipfsLink) => {
      try {
        const response = await fetch(ipfsLink);
        const text = await response.text();
        const sanitizedText = DOMPurify.sanitize(text);
        setContent(sanitizedText);
      } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        setContent('No data found'); // Update state with error message
      }
    };

    fetchFileContent(details.tenXToken.descriptionMarkdownCID); // Call the async function
  }, [details]);

  useEffect(() => {
    const getHoldings = async () => {
      try {
        const result = address ? await readContract({
          address: details.tenXToken.tokenAddress,
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

    const getLpDetails = async () => {
      try {
        const result = await readContract({
          address: ADDRESS_TENXLAUNCHVIEWV2,
          abi: TenXLaunchViewV2Abi,
          functionName: 'getTenXTokenLpData',
          args: [details.tenXToken.tokenAddress],
          chainId: parseInt(chainId),
        });
        setInitialGrant((parseInt(result[0]) / 10 ** 18).toString());
        setTotalSupply((parseInt(result[1]) / 10 ** 18).toString());
        setPrice((parseInt(result[4]) / 10 ** 18).toString());
        setMarketCap((parseInt(result[4]) / 10 ** 18).toString());
        setTotalLpValue((parseInt(result[6]) / 10 ** 18).toString());
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setContent('Not found');
      }
    };

    const getTokenDetails = async () => {
      try {
        const result = await readContract({
          address: details.tenXToken.tokenAddress,
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
          address: details.tenXToken.tokenAddress,
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
          address: tokenAddress,
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
    getLpDetails();
    getHoldings();
  }, [chain, details.tenXToken.tokenAddress]);

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
          <li className="sharebtn">
            <Button variant="contained" color="primary" onClick={handleCopy}>
              Share Product
            </Button><br />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity="success">
                Link copied to clipboard!
              </Alert>
            </Snackbar>
          </li>
          DOMPurify.sanitize(<Box
            as="img"
            src={details.tenXToken.tokenLogoCID}
            sx={{
              width: '5em',
              heigh: '5em',
              backgroundColor: 'white',
              border: 'solid 0.15em white',
              borderRadius: '5em',
            }}
          />)<br /><br />
          <li>About the token: <span className='discriptionbox'> {content} </span></li>
          <li> Name: <span>{details.tenXToken.name}</span></li>
          <li>Symbol: <span>{details.tenXToken.symbol}</span></li>
          <li>Image CID: <span>{details.tenXToken.tokenLogoCID.split('/')[4]} </span></li>

          <li>Price in CZUSD: <span>{price}</span></li>
          <li>Launch timestamp in epoch number: <span>{timestamp}</span></li>
          <li>Launch timestamp in local time: <span>{details.tenXToken.launchTimestamp.toString()}</span></li>
          <li>Connected wallet’s holdings: <span>{holdings}</span></li>
          <li>Total Supply: <span>{totalSupply}</span></li>
          <li>Total LP Value in CZUSD:<span>{totalLpValue} </span></li>
          <li>Market capitalization:<span>{marketCap}</span></li>
          <li>Token Description CID: <span>{details.tenXToken.descriptionMarkdownCID.split('/')[4]} </span></li>
          <li>Total Buy/Sell Taxes: <span>{details.tenXToken.buyTax + details.tenXToken.sellTax}</span></li>
          <li>Buy Tax: <span>{details.tenXToken.buyTax} </span></li>
          <li>Sell Tax: <span>{details.tenXToken.sellTax} </span></li>
          <li>Buy Burn: <span>{details.tenXToken.buyBurn}  </span></li>
          <li>Sell Burn: <span>{details.tenXToken.sellBurn}  </span></li>
          <li>Buy LP Fee: <span>{details.tenXToken.buyLpFee}  </span></li>
          <li>Sell LP Fee: <span>{details.tenXToken.sellTax}  </span></li>
          <li>Balance Max: <span>{details.tenXToken.balanceMax}  </span></li>
          <li>Transaction Max:<span> {details.tenXToken.transactionSizeMax} </span></li>
          <li>Is Connected Wallet Exempt <span>{exempt} </span></li>
          {role && <li>Set Exempt Wallet: </li>}
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
          </Typography> </span></li>
          <li>TenX Setting address: <span><Typography
            as="a"
            color="black"
            target="_blank"
            href={chain?.blockExplorers?.default?.url + '/address/' + ADDRESS_TENXSETTINGSV2}
          >
            {ADDRESS_TENXSETTINGSV2}
          </Typography></span></li>
          <li>Total taxes in tokens/usd: <span>event TenXToken.TaxesCollected</span></li>
          <li>Total burn in tokens/usd: <span>event TenXToken.TaxesCollected</span></li>
          <li>Total lp in tokens/usd: <span>event TenXToken.TaxesCollected</span></li>
          <li>Initial CZUSD grant: <span>{initialGrant}</span></li>
          <li className='detailspagebtn'>
            {chain ?
              <ButtonPrimary
                as="a"
                target="_blank"
                href={czCashBuyLink('BNB', details.tenXToken.tokenAddress)}
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
                BUY {details.tenXToken.symbol?.slice(0, 7)}

              </ButtonPrimary>
              :
              <ConnectWallet />}
          </li>
        </div>

      </div>

      <FooterArea />
    </div>

  )
}

export default Products   