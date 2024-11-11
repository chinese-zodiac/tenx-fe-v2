import { Box, Container, Stack, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import {
  LINK_DISCORD,
  LINK_PRIVACY_POLICY,
  LINK_TELEGRAM,
  LINK_TENXV2_ASSETSET_1,
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
        <Container className="contentbox" sx={{backgroundColor:'black'}}>
          <Grid2
          
            container
            justifyContent="center"
            alignItems="center"
            rowSpacing={3}
            columnSpacing={3}
            maxWidth={1440}
          >

            <Grid2 className="box1" >
              <Grid2 xs={12}>
                <h1>IMPORTANT: We are about fun, not profit. Do not invest.</h1>
                <h2>YOU WILL LOSE MONEY (but gain fun!)</h2>
              </Grid2>
              <Grid2 xs={12}>
                <p>CZODIAC is a community of innovators, creators, coders, and artists building experiments with new
                   technologies. Anyone can contribute technology, apps, media, or other 
                   content to this community. While our members always do our best to abide 
                   by the Terms of Use set out below, its important that you understand that
                   there's no central organization or "official" source that can police the 
                   community. Anyone claiming to speak officially on behalf of czodiac
                   is not authorized to do so and should be disregarded. Also, as outlined
                   in more details in the Terms of Use, this community is for experimentation 
                   and fun, not profit. That means dapps frequently get hacked, have economic design flaws,
                   or are even expensive jokes. So don't come here to invest, come here to play, experiment, and have fun.</p>
                   <br/><br/>
                </Grid2>
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
                  <br />
                  <br />
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
        <br/>
        <br/>
              
              <MenuLinkSocialIcon
                href={LINK_TWITTER}
                src={`${LINK_TENXV2_ASSETSET_1}/images/icons/Twitter-White.svg`}
                alt="Twitter"
                width={27}
                height={23}
              />
              <MenuLinkSocialIcon
                href={LINK_TELEGRAM}
                src={`${LINK_TENXV2_ASSETSET_1}/images/icons/TG-White.svg`}
                alt="Telegram"
                width={27}
                height={23}
              />
        <br/>
        <br/>
        <Grid2 xs={12}>
              <p css={{ fontSize: 14, fontWeight: 400 }}>
                <span className="copyright">© 2023 CZodiac. All rights reserved</span>
                <span className="socialicon">
                </span>
              </p>
              
            </Grid2>
      </Box>
    </>
  );
}
