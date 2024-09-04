import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useDebounce } from 'usehooks-ts';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import DialogConfirm from './DialogConfirm';
import ReactGA from 'react-ga4';

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
}) {
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
  const { data, error, isError, isLoading, isSuccess, write } =
    useContractWrite({ ...config, onSuccess });
  const txHash = data?.hash ?? '';

  const handleClickOpen = () => {
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

  const handleConfirmed = () => {
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
    write();

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
                href={'https://bscscan.com/tx/' + txHash}
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
