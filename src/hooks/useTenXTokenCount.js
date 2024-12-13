import { useState, useEffect } from 'react';
import TenXLaunchV2Abi from '../abi/TenXLaunchV2.json';
import { ADDRESS_TENXLAUNCHV2 } from '../constants/addresses';
import { readContract } from '@wagmi/core';
import { bsc } from 'viem/chains';


export function useTenXTokenCount() {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await readContract({
                    address: ADDRESS_TENXLAUNCHV2,
                    abi: TenXLaunchV2Abi,
                    functionName: 'launchedTokensCount',
                    chainId:bsc.id,
                });
                setCount(result.toString());
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return { count, loading, error };
}
