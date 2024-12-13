import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { readContract, readContracts } from '@wagmi/core';
import TenXLaunchViewV2Abi from '../abi/TenXLaunchViewV2.json';
import TenXTokenV2Abi from '../abi/TenXTokenV2.json';
import { ADDRESS_TENXLAUNCHVIEWV2 } from '../constants/addresses';
import { formatEther } from 'viem';
import { fromUnixTime } from 'date-fns';
import { bsc } from '@wagmi/core/chains'
const STATUS = {
  SUCCESS: 'SUCCESS',
  PROCESSING: 'PROCESSING',
  FAILURE: 'FAILURE',
};

let TENX_TOKEN_ARRAY_STATUS = [];

const useStore = create(
  persist(
    (set, get) => ({
      TenXTokenV2Array: [],
      TenXTokenV2ArrayStatus: [],
      fetchTenXToken: async (_tokenIndex) => {
        if (
          TENX_TOKEN_ARRAY_STATUS[_tokenIndex] === STATUS.SUCCESS ||
          TENX_TOKEN_ARRAY_STATUS[_tokenIndex] === STATUS.PROCESSING
        ) {
          // Do nothing if already processed or processing
          return;
        }

        TENX_TOKEN_ARRAY_STATUS[_tokenIndex] = STATUS.PROCESSING;

        try {
          const res = await readContract({
            address: ADDRESS_TENXLAUNCHVIEWV2,
            abi: TenXLaunchViewV2Abi,
            functionName: 'getTenXTokenDataFromIndex',
            args: [_tokenIndex],
            chainId:bsc.id,
          });

          const newTenXTokenV2 = {
            tokenIndex:_tokenIndex,
            tokenAddress: res[0],
            tokenLogoCID: res[1],
            descriptionMarkdownCID: res[2],
            balanceMax: formatEther(res[3]),
            transactionSizeMax: formatEther(res[4]),
            czusdPair: res[5],
            taxReceiver: res[6],
            czusdGrant: formatEther(res[7]),
            buyTax: res[8],
            buyBurn: res[9],
            buyLpFee: res[10],
            sellTax: res[11],
            sellBurn: res[12],
            sellLpFee: res[13],
            launchTimestamp: fromUnixTime(Number(res[14])),
          };

          const TenXTokenV2Contract = {
            address: newTenXTokenV2.tokenAddress,
            abi: TenXTokenV2Abi,
          };

          const res1 = await readContracts({
            contracts: [
              {
                ...TenXTokenV2Contract,
                functionName: 'name',
                chainId:bsc.id,
              },
              {
                ...TenXTokenV2Contract,
                functionName: 'symbol',
                chainId:bsc.id,
              },
              {
                address: ADDRESS_TENXLAUNCHVIEWV2,
                abi: TenXLaunchViewV2Abi,
                functionName: 'getTenXTokenLpData',
                args: [newTenXTokenV2.tokenAddress,],
                chainId: bsc.id
              }
            ],
            
          });

          newTenXTokenV2.name = res1[0].result;
          newTenXTokenV2.symbol = res1[1].result;
          newTenXTokenV2.initialSupply = formatEther(res1[2].result[0]);
          newTenXTokenV2.totalSupply = formatEther(res1[2].result[1]);
          newTenXTokenV2.tokenLP = formatEther(res1[2].result[2]);
          newTenXTokenV2.czusdLP = formatEther(res1[2].result[3]);
          newTenXTokenV2.price = formatEther(res1[2].result[4]);
          newTenXTokenV2.marketCap = formatEther(res1[2].result[5]);
          newTenXTokenV2.totalLpValue = formatEther(res1[2].result[6]);

          const newTenXTokenV2Array = [...get().TenXTokenV2Array];
          newTenXTokenV2Array[_tokenIndex] = newTenXTokenV2;

          TENX_TOKEN_ARRAY_STATUS[_tokenIndex] = STATUS.SUCCESS;
          set({ TenXTokenV2Array: newTenXTokenV2Array });
        } catch (error) {
          TENX_TOKEN_ARRAY_STATUS[_tokenIndex] = STATUS.FAILURE;
          console.error('Failed to fetch token data:', error);
        }
      },
    }),
    { name: 'tenx-storage-0.1.0' }
  )
);

export default useStore;
