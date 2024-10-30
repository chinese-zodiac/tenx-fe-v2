import React from 'react';
import { useTenXTokenPinnedMulti } from '../../hooks/useTenXToken';
import { useTenXTokenCount } from '../../hooks/useTenXTokenCount';
import TenXToken from '../styled/TenXToken';


export default function TenXTokenListPinned() {
  const { count, loading, error } = useTenXTokenCount();

  const { tenXTokenArray2, loading: multiLoading, error: multiError } = useTenXTokenPinnedMulti();


  const handlePinnedChange = (tokenIndex, isPinned) => {
    localStorage.setItem(`pinned-${tokenIndex}`, isPinned);
  };

  if (loading || multiLoading) return <p>Loading...</p>;
  if (error || multiError) return <p>Error: {error?.message || multiError?.message}</p>;

  return (
    <>
      {tenXTokenArray2.length > 0 ? (
          tenXTokenArray2.map((tenXToken) =>
            tenXToken?.tokenAddress && (
              <TenXToken
                key={tenXToken.tokenAddress}
                {...tenXToken}
                onPinnedChange={handlePinnedChange}
              />
            )
          )
      ) : (
        <p>No tokens pinned. If you have pinned any token and it is not shown please reload.</p>
      )}
    </>
  );
}
