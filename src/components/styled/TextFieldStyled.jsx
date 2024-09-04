import React, { useState } from 'react';
import {
  Typography,
  Box,
  Slider,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  HelpOutline,
  QuestionMarkOutlined,
  QuestionMarkRounded,
} from '@mui/icons-material';

export default function TextFieldStyled({
  text,
  setText,
  maxChar,
  width,
  label,
  helpMsg,
}) {
  return (
    <TextField
      className="input-box"
      label={label}
      variant="filled"
      sx={{
        '&.MuiFormControl-root': {
          backgroundColor: 'transparent',
          border: 'solid 3px #e16b31',
          width: { width },
        },
        '& .MuiInputBase-root': {
          backgroundColor: 'transparent',
        },
        '& .MuiInputBase-root::before': {
          border: 'none !important',
        },
        '& .MuiFilledInput-root': {
          background: 'transparent',
          border: 'none !important',
        },
        '& .MuiInputBase-root::before': {
          border: 'none !important',
        },
        '& .MuiInputBase-root::after': {
          border: 'none !important',
        },

        '& .MuiInputBase-root::before': {
          border: 'none !important',
          height: '0.1em',
          backgroundColor: 'black',
          bottom: '0.5em',
          left: '1.75em',
          right: '0.75em',
        },
        '& .MuiInputBase-root > .MuiInputBase-input': {
          borderBottom: 'none !important',
        },
      }}
      value={text}
      onChange={(event) => {
        const newText = event.target.value.substr(0, maxChar);
        setText(newText);
      }}
      InputProps={
        !!helpMsg && {
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title={helpMsg}>
                <HelpOutline
                  sx={{
                    fontSize: '1em',
                    marginRight: '-0.5em',
                    cursor: 'help',
                  }}
                />
              </Tooltip>
            </InputAdornment>
          ),
        }
      }
    />
  );
}
