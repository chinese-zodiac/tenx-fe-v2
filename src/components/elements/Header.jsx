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
		<div className="header">
            <div className="container">
             <a href='/'>  
            <Box className="logo"
                as="img"
                src="/logo.png"
                sx={{
                    width: '10em',
                    height: '10em',
                    marginTop: '1em',
                }}
            />
            </a> 
            </div>
		</div>
			</>
    )
}

export default Header