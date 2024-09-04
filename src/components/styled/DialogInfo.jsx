import { Button, DialogContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import ReactGA from 'react-ga4';

export default function DialogInfo({ btn, children, sx, gaTag }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    ReactGA.event({
      category: 'tenx_action',
      action: 'open_info_dialog_' + gaTag,
      label: 'Opened an info dialog on tenx.cz.cash: ' + gaTag, // optional
    });
    setOpen(true);
  };

  const handleClose = () => {
    ReactGA.event({
      category: 'tenx_action',
      action: 'close_info_dialog_' + gaTag,
      label: 'Opened an info dialog on tenx.cz.cash: ' + gaTag, // optional
    });
    setOpen(false);
  };

  return (
    <>
      {React.cloneElement(btn, {
        onClick: handleClickOpen,
      })}
      <Dialog onClose={handleClose} open={open} sx={sx}>
        <DialogContent
          sx={{
            padding: '1em',
            background: '#f0eeed',
            border: 'solid 4px #9E5635',
            borderRadius: '10px',
            color: 'black',
          }}
        >
          {children}
          <Button
            onClick={handleClose}
            variant="text"
            autoFocus
            sx={{
              backgroundColor: '#9E5635',
              color: '#f0eeed',
              marginTop: '1em',
              marginBottom: '2em',
              fontSize: '1.25em',
              paddingLeft: '1.5em',
              paddingRight: '1.5em',
              '&:hover': {
                backgroundColor: '#9E5635',
              },
            }}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
