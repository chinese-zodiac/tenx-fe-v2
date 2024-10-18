import React, { useState, useEffect } from 'react';
import { useTenXTokenMulti } from '../../hooks/useTenXToken';
import { useTenXTokenCount } from '../../hooks/useTenXTokenCount';
import TenXToken from '../styled/TenXToken';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

export default function TenXTokenList({perPage}) {
  const { count, loading, error } = useTenXTokenCount();
  perPage = Math.max(perPage,count);
  const [page, setPage] = useState(0);
  const { tenXTokenArray, loading: multiLoading, error: multiError } = useTenXTokenMulti(page * perPage, perPage, perPage);
  const [sortedTokens, setSortedTokens] = useState([]);
  const sortTokens = (tokens) => {
    return [...tokens].sort((a, b) => {
      const aPinned = localStorage.getItem(`pinned-${a.tokenIndex}`) === 'true';
      const bPinned = localStorage.getItem(`pinned-${b.tokenIndex}`) === 'true';
      return (bPinned - aPinned) // Pinned items first
    });
  };

  useEffect(() => {
    if (tenXTokenArray) {
      setSortedTokens(sortTokens(tenXTokenArray));
    }
  }, [page, perPage, tenXTokenArray]);

  const handlePinnedChange = (tokenIndex, isPinned) => {
    localStorage.setItem(`pinned-${tokenIndex}`, isPinned); // Save the pinned state in local storage
    setSortedTokens(prevTokens => {
      const updatedTokens = prevTokens.map(token =>
        token.tokenIndex === tokenIndex ? { ...token, pinned: isPinned } : token
      );
      return sortTokens(updatedTokens);
    });
  };

  if (loading || multiLoading) return <p>Loading...</p>;
  if (error || multiError) return <p>Error: {error?.message || multiError?.message}</p>;

  return (
    <>
      {sortedTokens.length > 0 ? (
        <>
          {sortedTokens.map((tenXToken) =>
            tenXToken?.tokenAddress && (
              <TenXToken
                key={tenXToken.tokenAddress}
                {...tenXToken}
                onPinnedChange={handlePinnedChange}
              />
            )
          )}
          <Box as="div" className='clearfix'>
            {page > 0 && (
              <Button
                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
              >
                Previous
              </Button>
            )}
            {!((page + 1) * perPage >= count) && (
              <Button
                onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(count / perPage)))}
              >
                Next
              </Button>
            )}
          </Box>
        </>
      ) : (
        <p>No tokens available</p>
      )}
    </>
  );
}
