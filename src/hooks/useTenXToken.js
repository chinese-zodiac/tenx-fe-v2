import useStore from '../store/useStore';

export function useTenXTokenMulti(start, count) {
  const fetchTenXToken = useStore((state) => state.fetchTenXToken);
  for (let i = start; i < count; i++) {
    fetchTenXToken(i);
  }

  const tenXTokenArray = useStore((state) =>
    state.tenXTokenArray.filter(
      (val, index) => index < start + count && index >= start
    )
  );
  console.log(tenXTokenArray);
  return { tenXTokenArray };
}

export default function useTenXToken(index) {
  const fetchTenXToken = useStore((state) => state.fetchTenXToken);
  fetchTenXToken(index);

  const tenXToken = useStore((state) => state.tenXTokenArray[index]);

  return { tenXToken };
}
