import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/system';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import ReactGA from 'react-ga4';

export default function ConnectWallet(sx) {
  const {
    isOpen: web3ModalIsOpen,
    open: web3ModalOpen,
    close: web3ModalClose,
  } = useWeb3Modal();
  const { open, selectedNetworkId } = useWeb3ModalState();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          display: 'block',
          right: '1em',
        }}
      >
        <Box>
          {!!address ? (
            <>
              <Tooltip title="Open Wallet Settings">
                <Button
                  onClick={() => {
                    ReactGA.event({
                      category: 'tenx_action',
                      action: 'click_account_btn',
                      label: 'Click on "account btn" on tenx.cz.cash', // optional
                    });
                    web3ModalOpen({ view: 'Account' });
                  }}
                  sx={{
                    width: '8em',
                    position: 'relative',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    color: '#e16b31',
                    borderRadius: '1.5em',
                    border: 'solid 5px #e16b31',
                    fontSize: 28,
                    backgroundColor: '#f3f3f3',
                    '&:hover': {
                      backgroundColor: '#080830',
                    },
                  }}
                >
                  <Avatar
                    alt={address}
                    src={makeBlockie(address)}
                    sx={{
                      mr: 1,
                      height: 'auto',
                      width: '0.9em',
                      border: 'solid 3px #e16b31',
                    }}
                  />
                  0x...{address.substring(36)}
                </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Login">
                <Button
                  onClick={() => {
                    ReactGA.event({
                      category: 'tenx_action',
                      action: 'click_connect_wallet_btn',
                      label: 'Click on "connect wallet btn" on tenx.cz.cash', // optional
                    });
                    web3ModalOpen({ view: 'Connect' });
                  }}
                  sx={{
                    width: '8em',
                    position: 'relative',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    color: '#e16b31',
                    borderRadius: '1.5em',
                    border: 'solid 5px #e16b31',
                    fontSize: 28,
                    backgroundColor: '#f3f3f3',
                    '&:hover': {
                      backgroundColor: '#080830',
                    },
                  }}
                >
                  Connect{' '}
                  <Box
                    sx={{
                      display: 'block',
                      position: 'absolute',
                      fontSize: '36px',
                      right: '15px',
                      top: '-0.17em',
                    }}
                  >
                    ›
                  </Box>
                </Button>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
