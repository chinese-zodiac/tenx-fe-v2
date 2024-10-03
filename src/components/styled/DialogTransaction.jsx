import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useDebounce } from 'usehooks-ts';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import DialogConfirm from './DialogConfirm';
import ReactGA from 'react-ga4';
import { useNetwork } from 'wagmi';
import { parseEther } from 'viem';
import { readContract } from '@wagmi/core';
import { ADDRESS_TENXBLACKLISTV2 } from '../../constants/addresses';
import badWords from '../../constants/badWords';
import TenXBlacklistV2Abi from '../../abi/TenXBlacklistV2.json';
import { Filter } from 'bad-words'
import { gatewayTools } from '../../utils/getIpfsJson';
import { bscTestnet } from 'viem/chains';

export default function DialogTransaction({
  btn,
  children,
  title,
  sx,
  address,
  abi,
  functionName,
  args,
  onSuccess,
  value,
  gas,
  toast,
}) {
  const { chain } = useNetwork();
  const filter = new Filter();
  filter.addWords(...badWords)
  const [open, setOpen] = React.useState(false);
  const [openTxStatus, setOpenTxStatus] = React.useState(false);
  const debouncedAddress = useDebounce(address);
  const debouncedFunctionName = useDebounce(functionName);
  const debouncedArgs = useDebounce(args);
  const debouncedValue = useDebounce(value);
  const debouncedGas = useDebounce(gas);
  const { config } = usePrepareContractWrite({
    abi,
    address: debouncedAddress,
    functionName: debouncedFunctionName,
    args: debouncedArgs,
    gas: debouncedGas,
    value: debouncedValue,
  });
  const { data, error, isError, isLoading, isSuccess, writeAsync } = useContractWrite({ ...config, onSuccess });


  const txHash = data?.hash ?? '';

  const handleClickOpen = async () => {
    if (debouncedArgs[1].length < 3) {
      toast.error('Name should have atleast 3 characters');
      return;
    }
    else if (debouncedArgs[2].length < 1) {
      toast.error('Symbol should have atleast 1 character');
      return;
    }
    else if (debouncedArgs[0] < parseEther('5000')) {
      toast.error('CZUSD LP Grant must be greater than 5000.');
      return;
    }
    else if (debouncedArgs[0] > parseEther('10000')) {
      toast.error('CZUSD LP Grant must be less than 10000.');
      return;
    }
    else if (debouncedArgs[5] > debouncedArgs[0]) {
      toast.error('Max Balance For Accounts must be lesser than CZUSD LP Grant.');
      return;
    }
    else if (debouncedArgs[6] > debouncedArgs[0]) {
      toast.error('Max Transaction Size must be lesser than CZUSD LP Grant.');
      return;
    }
    else if (debouncedArgs[5] < debouncedArgs[0] / BigInt(100)) {
      toast.error('Max Balance For Accounts must be lesser than CZUSD LP Grant.');
      return;
    }
    else if (debouncedArgs[6] < debouncedArgs[0] / BigInt(100)) {
      toast.error('Max Transaction Size must be lesser than CZUSD LP Grant.');
      return;
    }


    try {
      const result = await readContract({
        address: ADDRESS_TENXBLACKLISTV2,
        abi: TenXBlacklistV2Abi,
        functionName: 'isAccountBlacklisted',
        args: [debouncedArgs[7]],
        chainId:bscTestnet.id,
      });

      if (result) {
        toast.error('The address is blacklisted.');
        return;
      }
    } catch (err) {
      toast.error('Invalid fee receiver address.');
      return;
    }

    if (debouncedArgs[14] != 0 && debouncedArgs[14] < Math.floor(Date.now() / 1000) + (30 * 60)) {
      console.log(debouncedArgs[14])
      toast.error('Invalid launch time as it must be at least 30 minutes in the future.');
      return;
    }

    if (debouncedArgs[3]) {
      try {
        if(!gatewayTools.containsCID('ipfs.io/'+ debouncedArgs[3]).containsCid){
          toast.error('The CID does not point to a valid image for logo.');
          return;
        }
        const response = await fetch('https://ipfs.io/ipfs/' + debouncedArgs[3]);
        const contentType = response.headers.get('content-type');


        if (!contentType || !contentType.startsWith('image/')) {
          toast.error('The CID does not point to a valid image for logo.');
          return;
        }
      } catch (err) {
        toast.error('Invalid IPFS CID for image.');
        return;
      }
    }

    if (debouncedArgs[4]) {
      try {
        if(!gatewayTools.containsCID('ipfs.io/'+ debouncedArgs[4]).containsCid){
          toast.error('The CID does not point to a valid image for logo.');
          return;
        }
        const response = await fetch('https://ipfs.io/ipfs/' + debouncedArgs[4]);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('text/')) {
          toast.error('The CID does not point to a valid text file for description.');
          return;
        }
      } catch (err) {
        toast.error('Invalid IPFS CID for description.');
        return;
      }
    }

    if ((debouncedArgs[8] + debouncedArgs[9] + debouncedArgs[10] + debouncedArgs[11] + debouncedArgs[12] + debouncedArgs[13])> 3000) {
      console.log(debouncedArgs[8] + debouncedArgs[9] + debouncedArgs[10] + debouncedArgs[11] + debouncedArgs[12] + debouncedArgs[13])
      toast.error('Total fees too high.');
      return;
    }

    // Warnings
    if (filter.isProfane(debouncedArgs[1])) {
      toast.error('Profane words may cause your account or token to be blacklisted. Please give a different name');

    }
    if (filter.isProfane(debouncedArgs[2])) {
      toast.error('Profane words may cause your account or token to be blacklisted.  Please give a different Symbol');

    }
    if (debouncedArgs[9] > 100) {
      toast.warn('May cause some buys and sells to fail, as Buy Fees is over 1%.', {
        position: "top-left"
      });
    }

    ReactGA.event({
      category: 'tenx_action',
      action: 'open_tx_dialog_' + title,
      label:
        'Opened a transaction dialog on tenx.cz.cash: ' +
        title +
        ' | address: ' +
        address, // optional
    });
    setOpen(true);
  };

  const handleClose = () => {
    ReactGA.event({
      category: 'tenx_action',
      action: 'close_tx_dialog_' + title,
      label:
        'Closed a transaction dialog on tenx.cz.cash: ' +
        title +
        ' | address: ' +
        address, // optional
    });
    setOpen(false);
  };

  const handleCloseTxStatus = () => {
    ReactGA.event({
      category: 'tenx_action',
      action: 'close_tx_status_' + title,
      label:
        'Closed tx status on tenx.cz.cash: ' + title + ' | address: ' + address, // optional
    });

    setOpenTxStatus(false);
  };

  const handleConfirmed = async () => {
    ReactGA.event({
      category: 'tenx_action',
      action: 'send_tx_attempt_' + title,
      label:
        'Attempting a transaction on tenx.cz.cash: ' +
        title +
        ' | address: ' +
        address, // optional
    });
    //send tx
    await writeAsync();

    ReactGA.event({
      category: 'tenx_action',
      action: 'send_tx_success_' + title,
      label:
        'Sucessfully sent a transaction on tenx.cz.cash: ' +
        title +
        ' | address: ' +
        address, // optional
    });
    //open watch tx dialog
    handleClose();
    setOpenTxStatus(true);
  };

  return (
    <>
      {React.cloneElement(btn, {
        onClick: handleClickOpen,
      })}
      <DialogConfirm
        sx={sx}
        handleConfirmed={handleConfirmed}
        open={open}
        setOpen={setOpen}
      >
        <Typography
          as="h1"
          sx={{
            color: '#7c120a',
            fontSize: '2em',
            lineHeight: '1em',
            marginBottom: '0.5em',
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ lineHeight: '1.2em' }}>{children}</Typography>
      </DialogConfirm>
      <Dialog onClose={handleClose} open={openTxStatus} sx={sx}>
        <DialogContent
          sx={{
            padding: '1em',
            background: '#f0eeed',
            border: 'solid 4px #e16b31',
            borderRadius: '10px',
            color: 'black',
          }}
        >
          <Typography
            as="h1"
            sx={{
              color: '#e16b31',
              fontWeight: 'bold',
              fontSize: '2em',
              lineHeight: '1em',
              marginBottom: '0.5em',
            }}
          >
            {title}
          </Typography>
          {!!isLoading && 'Check your wallet and confirm the transaction...'}
          {!!isSuccess && (
            <>
              <Typography>TX INFO:</Typography>
              <Typography
                as="a"
                color="black"
                target="_blank"
                href={chain?.blockExplorers?.default?.url + '/tx/' + txHash}
              >
                {txHash.slice(0, 5) + '...' + txHash.slice(-3)}
              </Typography>

              <Box
                sx={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CountdownCircleTimer
                  isPlaying
                  duration={9}
                  colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                  colorsTime={[9, 6, 3, 0]}
                  onComplete={() => ({ shouldRepeat: false })}
                >
                  {({ remainingTime }) => {
                    if (remainingTime === 0) {
                      return (
                        <>
                          TX
                          <br />
                          COMPLETE!
                        </>
                      );
                    } else {
                      return (
                        <Box>
                          TX Processing:
                          <br />
                          {remainingTime}
                          <br />
                          Seconds
                        </Box>
                      );
                    }
                  }}
                </CountdownCircleTimer>
              </Box>
            </>
          )}

          {!!isError && (
            <>
              <Typography>ERROR:</Typography>
              {error?.message}
            </>
          )}
          <br />
          <br />
          {!isSuccess && (
            <Button
              onClick={handleConfirmed}
              variant="text"
              autoFocus
              sx={{
                backgroundColor: '#e16b31',
                borderRadius: '1em',
                border: 'solid 1px #f0eeed',
                color: '#f0eeed',
                display: 'inline-block',
                fontSize: '0.75em',
                width: '8em',
                padding: '0.4em 0.25em',
                lineHeight: '1.2em',
                margin: 0,
                marginRight: '1em',
                marginTop: '0.66em',
                '&:hover': {
                  backgroundColor: '#080830',
                },
              }}
            >
              <Typography sx={{ fontSize: '2em', lineHeight: '1em' }}>
                RETRY
              </Typography>
            </Button>
          )}
          <Button
            onClick={() => {
              handleCloseTxStatus();
            }}
            variant="text"
            autoFocus
            sx={{
              backgroundColor: '#e16b31',
              borderRadius: '1em',
              border: 'solid 1px #f0eeed',
              color: '#f0eeed',
              display: 'inline-block',
              fontSize: '0.75em',
              width: '8em',
              padding: '0.4em 0.25em',
              lineHeight: '1.2em',
              margin: 0,
              marginRight: '1em',
              marginTop: '0.66em',
              '&:hover': {
                backgroundColor: '#080830',
              },
            }}
          >
            <Typography sx={{ fontSize: '2em', lineHeight: '1em' }}>
              EXIT
            </Typography>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
