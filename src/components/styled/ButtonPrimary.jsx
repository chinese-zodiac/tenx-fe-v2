import { Button, useTheme } from '@mui/material';

export default function ButtonPrimary(props) {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      target="_blank"
      rel="noreferrer"
      disableElevation={true}
      {...props}
    >
      {props?.children}
    </Button>
  );
}
