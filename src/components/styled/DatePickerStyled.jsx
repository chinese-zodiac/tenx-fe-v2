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

  const popperSx = {
    "& .MuiPaper-root": {
      border: "1px solid black",
      padding: 2,
      marginTop: 1,
      backgroundColor: "rgba(120, 120, 120, 0.2)"
    },
    "& .MuiCalendarPicker-root": {
      backgroundColor: "rgba(45, 85, 255, 0.4)"
    },
    "& .PrivatePickersSlideTransition-root": {},
    "& .MuiPickersDay-dayWithMargin": {
      color: "rgb(229,228,226)",
      backgroundColor: "rgba(50, 136, 153)"
    },
    "& .MuiTabs-root": { backgroundColor: "rgba(120, 120, 120, 0.4)" }
  };
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
        },
        '& .MuiInputBase-root': {
          backgroundColor: 'transparent',
          border: 'none !important',
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
