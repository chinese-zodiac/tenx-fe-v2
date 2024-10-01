import { Box, Checkbox, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { LINK_BSCSCAN, LINK_GECKOTERMINAL } from '../../constants/links';
import ButtonPrimary from './ButtonPrimary';
import { czCashBuyLink } from '../../utils/czcashLink';
import { useAccount, useNetwork } from 'wagmi';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import TenXTokenV2Abi from '../../abi/TenXTokenV2.json';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/system';
import DOMPurify from 'dompurify';
import { keccak256, toBytes } from 'viem';
import { ADDRESS_TENXLAUNCHVIEWV2 } from '../../constants/addresses';
import TenXLaunchViewV2Abi from '../../abi/TenXLaunchViewV2.json';
import { getIpfsUrl } from '../../utils/getIpfsJson';
import { bscTestnet } from 'viem/chains';
const StarCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#e16b31',
  '&:checked': {
    color: '#e16b31',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 32, // Adjust the size of the star icon
  },
}));

// Star icon component
const StarIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill="currentColor"
    />
  </svg>
);
const BlueIconButton = styled(IconButton)(({ theme }) => ({
  color: '#1976d2', // Blue color
  '&:hover': {
    color: '#1565c0', // Darker blue color on hover
  },
}));

export default function TenXToken({
  tokenAddress,
  czusdPair,
  buyTax,
  buyBurn,
  sellTax,
  sellBurn,
  name,
  symbol,
  tokenLogoCID,
  launchTimestamp,
  descriptionMarkdownCID,
  tokenIndex
}) {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const [content, setContent] = useState('Loading...');
  const [holdings, setHoldings] = useState('Loading...');
  const [role, setRole] = useState(false);
  const [checked, setChecked] = useState(false);
  const [price, setPrice] = useState('Loading...');
  const [marketCap, setMarketCap] = useState('Loading...');

  useEffect(() => {
    const storedPinnedState = localStorage.getItem(`pinned-${tokenIndex}`);
    if (storedPinnedState !== null) {
      setChecked(JSON.parse(storedPinnedState));
    }
  }, []);

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
  
    // Store the pinned state in localStorage
    localStorage.setItem(`pinned-${tokenIndex}`, isChecked);
  
    if (onPinnedChange) {
      onPinnedChange(tokenIndex, isChecked);
    }
  };

  const theme = useTheme();

  useEffect(() => {
    const fetchFileContent = async (ipfsLink) => {
      try {
        ipfsLink = await getIpfsUrl('ipfs.io/ipfs/' + ipfsLink);
        const response = await fetch('https://' + ipfsLink);
        const text = await response.text(); // Convert the response to text
        const sanitizedText = DOMPurify.sanitize(text); // Sanitize the content
        const lines = sanitizedText.split('\n').slice(0, 3).join('\n');
        setContent(lines); // Update state with the fetched content
      } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        setContent('No data found'); // Update state with error message
      }
    };

    fetchFileContent(descriptionMarkdownCID); // Call the async function
  }, [tokenAddress]);

  useEffect(() => {
    const getHoldings = async () => {
      try {
        const result = address ? await readContract({
          address: tokenAddress,
          abi: TenXTokenV2Abi,
          functionName: 'balanceOf',
          args: [address],
          chainId: bscTestnet.id
        }) : 0;
        setHoldings(result.toString());
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setHoldings('No data found');
      }
    };
    const getRole = async () => {
      try {
        const result = address ? await readContract({
          address: tokenAddress,
          abi: TenXTokenV2Abi,
          functionName: 'hasRole',
          args: [keccak256(toBytes('MANAGER_ROLE')), address],
          chainId: bscTestnet.id
        }) : false;
        setRole(result);
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setRole(false);
      }
    };
    const getLpDetails = async () => {
      try {
        const result = await readContract({
          address: ADDRESS_TENXLAUNCHVIEWV2,
          abi: TenXLaunchViewV2Abi,
          functionName: 'getTenXTokenLpData',
          args: [tokenAddress],
          chainId: bscTestnet.id
        });
        // setInitialGrant((parseInt(result[0]) / 10 ** 18).toString());
        // setTotalSupply((parseInt(result[1]) / 10 ** 18).toString());
        setPrice((parseInt(result[4]) / 10 ** 18).toString());
        setMarketCap((parseInt(result[4]) / 10 ** 18).toString());
        // setTotalLpValue((parseInt(result[6]) / 10 ** 18).toString());
      } catch (error) {
        console.error('Error fetching Holdings:', error);
        setContent('Not found');
      }
    };
    getLpDetails()
    getRole();
    getHoldings(); // Call the async function
  }, [tokenAddress, address]);


  const getAge = (birthDate) => {
    const birthDay = dayjs(birthDate);
    // Current date and time
    const now = dayjs();
    // Check if birthDate is in the future
    if (birthDay.isAfter(now)) {
      return 'Yet to be launched';
    }
    const days = now.diff(birthDate, 'days');
    const hours = now.diff(birthDate, 'hours') % 24;
    const minutes = now.diff(birthDate, 'minutes') % 60;
    // console.log({ birthDate, today: dayjs().$d, diff: `${days} days, ${hours} hours, and ${minutes} minutes` })
    return `${days} days, ${hours} hours, and ${minutes} minutes`;
  };
  return (
    <Box
      sx={{
        padding: '0.5em',
        display: 'inline-block',
        fontSize: '0.89em',
        position: 'relative',
        borderRadius: '1.5em',
        border: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#080830',
          opacity: '0.25',
          borderRadius: '1.5em',
          zIndex: -1,
        }}
      />

      <Box
        as="img"
        src={'https://' + getIpfsUrl('ipfs.io/ipfs/' + tokenLogoCID)}
        sx={{
          width: '5em',
          heigh: '5em',
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
      <Box
        direction="row"
        spacing={1}
        sx={{
          display: 'inline-block',
          width: '15em',
          textAlign: 'left',
          paddingLeft: '0.5em',
        }}
      >
        <Typography
          sx={{ lineHeight: '1.81em', fontSize: '2em' }}
        ><span>{`${name?.slice(0, 8)} (${symbol?.slice(0, 4)})`}</span></Typography>
        <Box
          as="a"
          target="_blank"
          href={`${LINK_BSCSCAN}/token/${tokenAddress}`}
          sx={{
            margin: 0,
            padding: 0,
          }}
        >
          <Box
            as="img"
            src="./images/icons/bscscan.svg"
            sx={{
              width: '2em',
              heigh: '2em',
              margin: 0,
              marginLeft: '0.5em',
              padding: 0,
              backgroundColor: 'white',
              border: 'solid 0.15em white',
              borderRadius: '2em',
              '&:hover': {
                border: 'solid 0.15em grey',
                backgroundColor: 'grey',
              },
            }}
          />
        </Box>
        <Box
          as="a"
          target="_blank"
          href={`${LINK_GECKOTERMINAL}/bsc/pools/${czusdPair}`}
          sx={{
            margin: 0,
            padding: 0,
            height: '1.2em',
            width: '1.2em',
          }}
        >
          <Box
            as="img"
            src="./images/icons/chart.svg"
            sx={{
              width: '2em',
              heigh: '2em',
              margin: 0,
              padding: 0,
              backgroundColor: 'white',
              border: 'solid 0.15em white',
              borderRadius: '2em',
              marginLeft: '1em',
              '&:hover': {
                border: 'solid 0.15em grey',
                backgroundColor: 'grey',
              },
            }}
            alt="Token Logo"
          />
        </Box>
      </Box>
      {role && <BlueIconButton
        component="a"
        href={`/settings/${tokenIndex}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <SettingsIcon />
      </BlueIconButton>}
      <StarCheckbox
        icon={<StarIcon />}
        checkedIcon={<StarIcon />}
        checked={checked}
        onChange={handleChange}
      />

      <Typography>
        <ul className="homelist">
          <li> Buy Fee/Burn: <span>{(buyTax / 100).toFixed(2)}% /{' '}
            {(buyBurn / 100).toFixed(2)}
            %</span></li>
          <li>Sell Fee/Burn: <span>{(sellTax / 100).toFixed(2)}% /{' '}
            {(sellBurn / 100).toFixed(2)}%</span>
          </li>
          <li>Market capitalization: <span>{marketCap}</span></li>
          <li>Price in CUSD: <span>{price}</span></li>
          <li>Age: <span>{getAge(launchTimestamp)}</span></li>
          <li>Launch Time: <span>{dayjs(launchTimestamp).format('YYYY-MM-DD HH:mm:ss')}</span></li>
          <li>Your holdings: <span>{holdings}</span></li>
          <li> Description: <span>{content}</span></li>
        </ul>
      </Typography>
      <ButtonPrimary
        as="a"
        target="_blank"
        href={czCashBuyLink('BNB', tokenAddress)}
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
        BUY {symbol?.slice(0, 7)}
      </ButtonPrimary>
      <ButtonPrimary
        as="a"
        target="_self"
        href={`/product/${tokenIndex}/${chain ? chain.id : 97}`}
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
        Learn More
      </ButtonPrimary>
    </Box>
  );
}
