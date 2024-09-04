import { useTenXTokenMulti } from '../../hooks/useTenXToken';
import TenXToken from '../styled/TenXToken';

export default function TenXTokenList({ start, count }) {
  const { tenXTokenArray } = useTenXTokenMulti(start, count);
  console.log('tenXTokenArray', tenXTokenArray);
  return (
    <>
      {!!tenXTokenArray &&
        tenXTokenArray.map(
          (tenXToken, index) =>
            tenXToken?.tokenAddress && (
              <TenXToken key={tenXToken?.tokenAddress} {...tenXToken} />
            )
        )}
    </>
  );
}
