import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import { readContract, readContracts } from '@wagmi/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import TenXLaunchViewV2Abi from '../abi/TenXLaunchViewV2.json';
import TenXTokenV2Abi from '../abi/TenXTokenV2.json';
import { ADDRESS_TENXLAUNCHVIEWV2 } from '../constants/addresses';
import { getIpfsJson, getIpfsUrl } from '../utils/getIpfsJson';
import { formatEther } from 'viem';

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
          TENX_TOKEN_ARRAY_STATUS[_tokenIndex] == STATUS.SUCCESS || TENX_TOKEN_ARRAY_STATUS[_tokenIndex] == STATUS.PROCESSING
        ) {
          //do nothing
          return;
        }
        TENX_TOKEN_ARRAY_STATUS[_tokenIndex] = STATUS.PROCESSING;
        console.log({address: ADDRESS_TENXLAUNCHVIEWV2,
          abi: TenXLaunchViewV2Abi,
          functionName: 'getTenXTokenDataFromIndex',
          args: [_tokenIndex],})

        const res = await readContract({
          address: ADDRESS_TENXLAUNCHVIEWV2,
          abi: TenXLaunchViewV2Abi,
          functionName: 'getTenXTokenDataFromIndex',
          args: [_tokenIndex],
        });
        const newTenXTokenV2 = {
          tokenAddress: res[0],
          czusdPair: res[1],
          taxReceiver: res[2],
          czusdGrant: formatEther(res[3]),
          buyTax: res[4],
          buyBurn: res[5],
          sellTax: res[6],
          sellBurn: res[7],
        };

        const TenXTokenV2Contract = {
          address: newTenXTokenV2.tokenAddress,
          abi: TenXTokenV2Abi,
        };

        const resName = await readContracts({
          contracts: [
            {
              ...TenXTokenV2Contract,
              functionName: 'name',
            },
            {
              ...TenXTokenV2Contract,
              functionName: 'symbol',
            },
          ],
        });
        console.log({resName});
        newTenXTokenV2.name = resName[0].result;
        newTenXTokenV2.symbol = resName[1].result;

        const newTenXTokenV2Array = [...get().TenXTokenV2Array];
        newTenXTokenV2Array[_tokenIndex] = newTenXTokenV2;

        TENX_TOKEN_ARRAY_STATUS[_tokenIndex] = STATUS.SUCCESS;
        return set((state) => ({
          TenXTokenV2Array: newTenXTokenV2Array,
        }));
      },
    }),
    { name: 'tenx-storage-0.0.1c' }
  )
);

export default useStore;
