import React, { useEffect, useState } from 'react';
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
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    if (text === 0) {
      setIsChecked(true);
    }
  }, [text]);

  const minDate = dayjs().add(1, 'hour');
  const maxDate = dayjs().add(90, 'days');

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    setText(checked ? 0 : dayjs().add(2, 'hour'));
  };

  return (
    <div style={{ position: 'relative', width: 'fit-content', clear: 'both' }}>
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

          <span>
            <DateTimePicker
              className='datetime-box'
              label={
                <span>
                  {label}{' '}
                  <Tooltip title={helpMsg} placement="top">
                    <HelpOutline
                      sx={{
                        marginTop: '1em',
                        fontSize: '1em',
                        marginLeft: '0.5em',
                        cursor: 'help',
                      }}
                    />
                  </Tooltip>
                </span>
              }
              value={text || null}
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
          </span>

        </>
      )}
    </div>
  );
}
