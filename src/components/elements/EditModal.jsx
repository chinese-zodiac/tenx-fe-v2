import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import TenXTokenV2Abi from '../../abi/TenXTokenV2.json';
import ReactGA from 'react-ga4';
const EditModal = ({ fun, tokenAddress, label, previous, isModalOpen, setIsModalOpen, onSuccess }) => {
    const [value, setValue] = useState(previous);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { config } = usePrepareContractWrite({
        abi: TenXTokenV2Abi,
        address: tokenAddress,
        functionName: fun,
        args: [value],
    });
    console.log({config})
    const { data, error, isError, isLoading, isSuccess, writeAsync } = useContractWrite();
    console.log({useContractWrite:useContractWrite()})

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            ReactGA.event({
                category: 'tenx_action',
                action: 'send_tx_attempt_edit_' + label,
                label:
                    'Attempting a transaction on tenx.cz.cash: ' +
                    label,
            });
            console.log({tokenAddress})
            await writeAsync({
                abi: TenXTokenV2Abi,
                address: tokenAddress,
                functionName: fun,
                args: [value],
            });
            ReactGA.event({
                category: 'tenx_action',
                action: 'send_tx_success_' + label,
                label:
                    'Sucessfully sent a transaction on tenx.cz.cash: ' +
                    label,
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Contract call failed:', error);
            setErrorMessage('Failed to execute contract call.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" component="h2">
                    {label}
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label={label}
                    value={value}
                    onChange={handleChange}
                />
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditModal;
