import { Box, Container, Stack, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import {
  LINK_DISCORD,
  LINK_PRIVACY_POLICY,
  LINK_TELEGRAM,
  LINK_TERMS_OF_USE,
  LINK_TWITTER,
} from '../../constants/links';
import MenuLinkSocialIcon from '../styled/MenuLinkSocialIcon';
import { ADDRESS_CZUSD, ADDRESS_TENXLAUNCHV2 } from '../../constants/addresses';

export default function FooterArea({ sx }) {
  const theme = useTheme();
  const bp = theme.breakpoints.values;
  const mq = (bp) => `@media (min-width: ${bp}px)`;
  return (
    <>
      <Box
        sx={{
          backgroundColor: '#8a1226',
          color: '#f0eeed',
          padding: '100px 0px',
          margin: '0',
          marginTop: '5em',
          width: '100%',
          ...sx,
        }}
      >
        
        <Grid2 xs={12}>
              <p css={{ fontSize: 14, fontWeight: 400 }}>
                <span className="copyright">© 2023 CZodiac. All rights reserved</span>
                <span className="socialicon">
              
                <MenuLinkSocialIcon
                  href={LINK_TWITTER}
                  src="/images/icons/Twitter-White.svg"
                  alt="Twitter"
                  width={27}
                  height={23}
                />
                <MenuLinkSocialIcon
                  href={LINK_TELEGRAM}
                  src="/images/icons/TG-White.svg"
                  alt="Telegram"
                  width={27}
                  height={23}
                />
                </span>
              </p>
              
            </Grid2>
      </Box>
    </>
  );
}
