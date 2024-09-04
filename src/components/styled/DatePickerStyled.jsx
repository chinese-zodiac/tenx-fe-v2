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
import { DateTimePicker } from '@mui/x-date-pickers';

export default function DateTimePickerStyled({
  text,
  setText,
  label,
  helpMsg,
}) {

  return (
    <DateTimePicker
      className="datetime-box"
      label={label}
      variant="filled"
      showDaysOutsideCurrentMonth
      
      sx={{
        '&.MuiFormControl-root': {
          backgroundColor: 'transparent',
          border: 'solid 3px #e16b31',
          width: '14em',
        }              
      }}
      value={text}
      onChange={(newValue) => setText(getUnixTime(newValue))}
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
          sx: { "& .MuiSvgIcon-root": { color: "blue" } } 
        }
      }
    />
  );
}
