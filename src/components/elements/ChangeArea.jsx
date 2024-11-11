import { Stack, Box } from '@mui/system';
import { Typography } from '@mui/material';
import React from 'react';
import ButtonPrimary from '../styled/ButtonPrimary';

const ChangeArea = ({ transactionHash, status, token, index, chainId, blockExplorer }) => {
  return (
    <Stack
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Box id="Transactionbox"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          padding: 3,
          border: '1px solid #ccc',
          borderRadius: '16px',
          minHeight: '200px',
          width: '50%',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom:'1em'
        }}
      >
        <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
          Edit Transaction Receipt
        </Typography>
        Transaction hash:
        <Typography
          as="a"
          color="black"
          target="_blank"
          href={blockExplorer + '/tx/' + transactionHash}
        >{transactionHash}</Typography> <br />
        Status: {status}<br />
        Token: <Typography
          as="a"
          color="black"
          target="_blank"
          href={blockExplorer + '/address/' + token}
        >
          {token}</Typography><br />
      <ButtonPrimary
        as="a"
        target="_blank"
        href={`/#/product/${index}/${chainId}`}
        sx={{
          width: '50%',
          fontSize: '1.3em',
          padding: '10px',
          position: 'relative',
          fontWeight: 'bold',
          textTransform: 'none',
          color: '#e16b31',
          borderRadius: '1.5em',
          border: 'solid 2px #e16b31',
          backgroundColor: '#f3f3f3',
          display: 'block',
          marginTop: '1em',
          marginLeft: 'auto',
          marginRight: 'auto',
          textDecoration: 'none',
          '&:hover': {
            backgroundColor: '#080830',
          },
        }}
      >
        Go to Product details to view changes
      </ButtonPrimary>
      </Box>
    </Stack>
  );
};

export default ChangeArea;