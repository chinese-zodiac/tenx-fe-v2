import { useTenXTokenMulti } from '../../hooks/useTenXToken';
import { useTenXTokenCount } from '../../hooks/useTenXTokenCount';
import TenXToken from '../styled/TenXToken';

export default function TenXTokenList({ start }) {
  const { count, loading, error } = useTenXTokenCount();
  const { tenXTokenArray, loading: multiLoading, error: multiError } = useTenXTokenMulti(start, count);
  console.log({tenXTokenArray})

  if (loading || multiLoading) return <p>Loading...</p>;
  if (error || multiError) return <p>Error: {error?.message || multiError?.message}</p>;

  return (
    <>
      {tenXTokenArray?.length ? (
        tenXTokenArray.map(
          (tenXToken) =>
            tenXToken?.tokenAddress && (
              <TenXToken key={tenXToken.tokenAddress} {...tenXToken} />
            )
        )
      ) : (
        <p>No tokens available</p>
      )}
    </>
  );
}
