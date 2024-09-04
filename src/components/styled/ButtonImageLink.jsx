import { useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box } from '@mui/system';
import ButtonPrimary from './ButtonPrimary';

export default function ButtonImageLink({ sx, href, img, text }) {
  const theme = useTheme();
  return (
    <ButtonPrimary
      variant="contained"
      href={href}
      sx={{
        backgroundColor: '#9E5635',
        borderRadius: 0,
        width: '15em',
        padding: '0.4em 0.25em',
        lineHeight: '1em',
        display: 'inline-block',
        cursor: 'pointer',
        textDecoration: 'none',
        fontSize: { xs: '0.45em', sm: '0.45em' },
        marginTop: '1em',
        ...sx,
      }}
    >
      <Grid2 container>
        <Grid2 xs={2}>
          <Box
            sx={{
              backgroundImage: "url('" + img + "')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              height: '90%',
              width: '90%',
              margin: '5%',
            }}
          ></Box>
        </Grid2>
        <Grid2 xs={10}>{text}</Grid2>
      </Grid2>
    </ButtonPrimary>
  );
}
