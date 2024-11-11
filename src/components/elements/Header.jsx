import React from 'react';
import ConnectWallet from './ConnectWallet';
import {
  Typography,
  Box
} from '@mui/material';

import { LINK_TELEGRAM, LINK_TENXV2_ASSETSET_1 } from '../../constants/links';

const Header = () => {
    return (
        <>
            <ConnectWallet />
		<Box className="header">
             <Box>
             <a href='/'>
            <Box className="logo"
                as="img"
                src={`${LINK_TENXV2_ASSETSET_1}/logo.png`}
                sx={{
                    width: '4em',
                    height: 'auto',
                    marginTop: '0em',
                    marginRight:'1em'
                }}
            />
            </a>
            
            <Typography as="h1" sx={{fontSize:"2em"}}>
                Take your moonshot, Free.
                </Typography>
                <Typography as="h2" sx={{fontSize:"0.75em"}}>
                Get a $10k liquidity grant, always free and no strings attached.
                </Typography>
                
             </Box>
		</Box>
			</>
    )
}

export default Header