import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

export default function DateTimePickerStyled({
  text,
  setText,
  label,
  helpMsg,
}) {
  // Convert Unix time to Date object for DateTimePicker

  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      <DateTimePicker className='datetime-box'
        label={label}
        value={text}
        sx={{
          '&.MuiFormControl-root': {
            backgroundColor: 'transparent',
            border: 'solid 3px #e16b31',
            width: '14em',
          }              
        }}
        onChange={(newValue) => setText(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'transparent',
                border: '0',
              },
              width: '14em',
            }}
          />
        )}
      />
      <Tooltip title={helpMsg} placement="top">
        <HelpOutline
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            fontSize: '1em',
            marginRight: '-0.5em',
            cursor: 'help',
          }}
        />
      </Tooltip>
    </div>
  );
}
