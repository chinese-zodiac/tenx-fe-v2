import { Box, Stack, Typography, useTheme } from '@mui/material';
import { LINK_BSCSCAN, LINK_GECKOTERMINAL } from '../../constants/links';
import ButtonPrimary from './ButtonPrimary';
import ButtonImageLink from './ButtonImageLink';
import { czCashBuyLink } from '../../utils/czcashLink';
import { useAccount } from 'wagmi';
import ReactGA from 'react-ga4';

export default function TenXToken({
  tokenAddress,
  czusdPair,
  taxReceiver,
  czusdGrant,
  buyTax,
  buyBurn,
  sellTax,
  sellBurn,
  name,
  symbol,
}) {
  const { address, isConnecting, isDisconnected } = useAccount();
  const theme = useTheme();
  return (
    <Box
      sx={{
        padding: '0.5em',
        display: 'inline-block',
        fontSize: '0.89em',
        position: 'relative',
        borderRadius: '1.5em',
        border:
          !!address && taxReceiver == address ? 'solid 3px #ef915b' : 'none',
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
        src={`./images/tenxtokens/${tokenAddress}.png`}
        sx={{
          width: '5em',
          heigh: '5em',
          display: 'inline-block',
          position: 'relative',
          top: '0.25em',
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
        >{`${name?.substr(0, 8)} (${symbol?.substr(0, 4)})`}</Typography>
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
          />
        </Box>
      </Box>
      <Typography>
        Buy Fee/Burn: {(buyTax / 100).toFixed(2)}% /{' '}
        {(buyBurn / 100).toFixed(2)}
        %<br />
        Sell Fee/Burn: {(sellTax / 100).toFixed(2)}% /{' '}
        {(sellBurn / 100).toFixed(2)}%
      </Typography>
      <ButtonPrimary
        as="a"
        target="_blank"
        href={czCashBuyLink('BNB', tokenAddress)}
        focusRipple
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
        BUY {symbol?.substr(0, 7)}
      </ButtonPrimary>
    </Box>
  );
}
