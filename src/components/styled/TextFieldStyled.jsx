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
  maxNum,
  minNum,
  isInt
}) {
  return (
    <TextField
      className="input-box"
      label={label}
      variant="filled"
      sx={{
        '&.MuiFormControl-root': {
          backgroundColor: 'transparent',
          border: `solid 3px ${isInt && (Number(text)>maxNum || Number(text)<minNum) ? 'red' : '#bc7552'}`,
          width: { width },
          maxWidth:'90%'
        },
        '& .MuiInputBase-root': {
          backgroundColor: 'transparent',
        },
        '& .MuiFilledInput-root': {
          background: 'transparent',
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
        let newText = event.target.value.slice(0, maxChar);
        if(isInt) {
          newText = newText.replace(/\D/g,'');
        }
        if(maxNum) {
          const num = Number(newText);
          if(newText > maxNum*10) {
            newText = maxNum.toString();
          }
        }
        if(minNum) {
          const num = Number(newText);
          if(newText < minNum/10) {
            newText = minNum.toString();
          }
        }
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
