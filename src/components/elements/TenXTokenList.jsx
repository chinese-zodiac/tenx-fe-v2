import React, { useState, useEffect } from 'react';
import { useTenXTokenMulti } from '../../hooks/useTenXToken';
import { useTenXTokenCount } from '../../hooks/useTenXTokenCount';
import TenXToken from '../styled/TenXToken';

export default function TenXTokenList({ start }) {
  const { count, loading, error } = useTenXTokenCount();
  const { tenXTokenArray, loading: multiLoading, error: multiError } = useTenXTokenMulti(start, count);
  const [sortedTokens, setSortedTokens] = useState([]);

  useEffect(() => {
    if (tenXTokenArray) {
      // Sort tokens based on pinned state
      const sorted = [...tenXTokenArray].sort((a, b) => {
        const aPinned = localStorage.getItem(`pinned-${a.tokenAddress}`) === 'true';
        const bPinned = localStorage.getItem(`pinned-${b.tokenAddress}`) === 'true';
        return (bPinned - aPinned) || 0; // Pinned items first
      });
      setSortedTokens(sorted);
    }
  }, [tenXTokenArray]);

  if (loading || multiLoading) return <p>Loading...</p>;
  if (error || multiError) return <p>Error: {error?.message || multiError?.message}</p>;

  return (
    <>
      {sortedTokens.length ? (
        sortedTokens.map(
          (tenXToken) =>
            tenXToken?.tokenAddress && (
              <TenXToken
                key={tenXToken.tokenAddress}
                {...tenXToken}
                onPinnedChange={(tokenAddress, isPinned) => {
                  setSortedTokens(prevTokens => {
                    const updatedTokens = [...prevTokens];
                    const index = updatedTokens.findIndex(token => token.tokenAddress === tokenAddress);
                    if (index !== -1) {
                      updatedTokens[index] = { ...updatedTokens[index], pinned: isPinned };
                      updatedTokens.sort((a, b) => {
                        const aPinned = localStorage.getItem(`pinned-${a.tokenAddress}`) === 'true';
                        const bPinned = localStorage.getItem(`pinned-${b.tokenAddress}`) === 'true';
                        return (bPinned - aPinned) || 0;
                      });
                    }
                    return updatedTokens;
                  });
                }}
              />
            )
        )
      ) : (
        <p>No tokens available</p>
      )}
    </>
  );
}
