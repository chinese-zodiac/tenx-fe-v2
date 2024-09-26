import React, { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Checkbox, FormControlLabel, Tooltip, TextField } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function DatePickerStyled({
  text,
  setText,
  label,
  helpMsg,
}) {
  // State for the checkbox
  const [isChecked, setIsChecked] = useState(false);
  const minDate = dayjs().add(1, 'hour');
  const maxDate = dayjs().add(90, 'days');
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    // Update text based on the checkbox state
    if (checked) {
      setText(0); // Set to 0 when checked
    } else {
      setText(dayjs()); // Set to current date and time when unchecked
    }
  };

  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="Launch it now"
        sx={{ marginTop: '1em' }}
      />
      {!isChecked && (
        <>
          <DateTimePicker
            className='datetime-box'
            label={label}
            value={text}
            minDateTime={minDate}
            maxDateTime={maxDate}
            sx={{
              '&.MuiFormControl-root': {
                backgroundColor: 'transparent',
                border: 'solid 3px #e16b31',
                width: '14em',
              },
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
        </>
      )}

    </div>
  );
}
