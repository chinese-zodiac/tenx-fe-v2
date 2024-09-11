import React from 'react';
import ConnectWallet from './ConnectWallet';
import {
  Typography,
  Box
} from '@mui/material';

import { LINK_TELEGRAM } from '../../constants/links';

const Header = () => {
    return (
        <><ConnectWallet />
            <Box
                as="img"
                src="/logo.png"
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
            </Typography></>
    )
}

export default Header