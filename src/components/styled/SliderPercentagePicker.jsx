import React, { useState } from 'react';
import { Typography, Box, Slider, Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

export default function SliderPercentagePicker({
  pct,
  setPct,
  label,
  helpMsg,
}) {
  return (
    <>
      <Box
        sx={{ backgroundColor: '#f3f3f3', width: '16em' }}
        className="input-box"
      >
        <Slider
          value={pct}
          onChange={(event) => setPct(event.target.value)}
          size="small"
          min={0}
          max={900}
          step={5}
          sx={{ width: '14em', margin: 0 }}
        />
        <Typography
          sx={{
            textAlign: 'left',
            color: 'black',
            marginTop: '-0.45em',
            marginLeft: '1em',
            marginBottom: '0.5em',
          }}
        >
          {!!helpMsg && (
            <Tooltip title={helpMsg}>
              <HelpOutline
                sx={{
                  color: 'rgba(0,0,0,0.55)',
                  fontSize: '1.05em',
                  cursor: 'help',
                  position: 'relative',
                  top: '0.25em',
                  marginRight: '0.1em',
                }}
              />
            </Tooltip>
          )}
          <Typography
            as="span"
            sx={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.75em' }}
          >
            {label}
          </Typography>

          <Typography
            as="span"
            sx={{
              color: 'rgba(0,0,0,0.87)',
              fontSize: '1em',
              marginLeft: '0.5em',
            }}
          >
            {(pct / 100).toFixed(2)}%
          </Typography>
        </Typography>
      </Box>
    </>
  );
}
