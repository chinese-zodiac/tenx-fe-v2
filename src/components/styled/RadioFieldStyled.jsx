import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { HelpOutline } from '@mui/icons-material';

const StyledContainer = styled('div')({
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '1em',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
});

const StyledFormLabel = styled(FormLabel)({
    marginBottom: '0',
    color: 'rgba(0,0,0,0.6)',
    fontSize: '0.75em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
});

const RadioFieldStyled = ({ selectedValue, setSelectedValue, title, labels, helpMsg }) => {
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <StyledContainer>
            <FormControl component="fieldset">
                <StyledFormLabel>
                    {title}
                    {!!helpMsg && (
                        <Tooltip title={helpMsg}>
                            <HelpOutline
                                sx={{
                                    fontSize: '1em',
                                    cursor: 'help',
                                }}
                            />
                        </Tooltip>
                    )}
                </StyledFormLabel>
                <RadioGroup
                    aria-label="options"
                    name="options"
                    value={selectedValue}
                    onChange={handleChange}
                    row
                >
                    {labels.map((label, index) => (
                        <FormControlLabel key={index} value={index.toString()} control={<Radio />} label={label} />
                    ))}
                </RadioGroup>
            </FormControl>
        </StyledContainer>
    );
};

export default RadioFieldStyled;
