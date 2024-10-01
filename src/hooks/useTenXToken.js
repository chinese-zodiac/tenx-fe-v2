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