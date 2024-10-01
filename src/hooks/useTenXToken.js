import { useEffect } from 'react';
import useStore from '../store/useStore';

export function useTenXTokenMulti(start, count) {
  const fetchTenXToken = useStore((state) => state.fetchTenXToken);
  
  for (let i = start; i < start + count; i++) {
    fetchTenXToken(i);
  }

  const tenXTokenArray = useStore((state) => 
    (state.TenXTokenV2Array || []).filter(
      (val, index) => index >= start && index < start + count
    )
  );

  // console.log({ tenXTokenArray });
  return { tenXTokenArray };
}

export default function useTenXToken(index) {
  const fetchTenXToken = useStore((state) => state.fetchTenXToken);
  fetchTenXToken(index);

  const tenXToken = useStore((state) => state.TenXTokenV2Array?.[index]);

  return { tenXToken };
}

const getPinnedIndices = () => {
  const pinnedIndices = [];
  // Iterate through local storage keys
  Object.keys(localStorage).forEach(key => {
    // Check if the key is a pinned token
    if (key.startsWith('pinned-') && localStorage.getItem(key) === 'true') {
      const index = parseInt(key.split('-')[1]); // Extract the index from the key
      pinnedIndices.push(index);
    }
  });
  return pinnedIndices;
};

export function useTenXTokenPinnedMulti() {
  const pinned = getPinnedIndices(); // Get all pinned indices
  const fetchTenXToken = useStore((state) => state.fetchTenXToken);


    pinned.forEach((index) => {
      const tenXToken = useStore((state) => state.TenXTokenV2Array?.[index]);
      if (!tenXToken) {
        fetchTenXToken(index);
      }
    });


  const tenXTokenArray = useStore((state) => state.TenXTokenV2Array || []);

  return {
    tenXTokenArray2: pinned.map(index => tenXTokenArray[index]).filter(Boolean),
  };
}