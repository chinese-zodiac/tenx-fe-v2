import { useTheme } from '@mui/material';

export default function MenuLinkSocialIcon({
  href,
  src,
  alt,
  width,
  height,
  css,
}) {
  const theme = useTheme();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      css={{
        paddingTop: '8px',
        paddingBottom: '1px',
        '&:hover': {
          paddingTop: '8px',
          paddingBottom: '1px',
          opacity: '0.5',
        },
        ...css,
      }}
    >
      <img src={src} alt={alt} width={width} height={height} />
    </a>
  );
}
