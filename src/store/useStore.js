import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import { readContract, readContracts } from '@wagmi/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import TenXLaunchViewAbi from '../abi/TenXLaunchView.json';
import TenXTokenAbi from '../abi/TenXToken.json';
import { ADDRESS_TENXLAUNCHVIEW } from '../constants/addresses';
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
      tenXTokenArray: [],
      tenXTokenArrayStatus: [],
      fetchTenXToken: async (_tokenIndex) => {
        if (
          TENX_TOKEN_ARRAY_STATUS[_tokenIndex] == STATUS.SUCCESS ||
          TENX_TOKEN_ARRAY_STATUS[_tokenIndex] == STATUS.PROCESSING
        ) {
          //do nothing
          return;
        }
        TENX_TOKEN_ARRAY_STATUS[_tokenIndex] = STATUS.PROCESSING;

        const res = await readContract({
          address: ADDRESS_TENXLAUNCHVIEW,
          abi: TenXLaunchViewAbi,
          functionName: 'getTenXTokenDataFromIndex',
          args: [_tokenIndex],
        });
        const newTenXToken = {
          tokenAddress: res[0],
          czusdPair: res[1],
          taxReceiver: res[2],
          czusdGrant: formatEther(res[3]),
          buyTax: res[4],
          buyBurn: res[5],
          sellTax: res[6],
          sellBurn: res[7],
        };

        const tenXTokenContract = {
          address: newTenXToken.tokenAddress,
          abi: TenXTokenAbi,
        };

        const resName = await readContracts({
          contracts: [
            {
              ...tenXTokenContract,
              functionName: 'name',
            },
            {
              ...tenXTokenContract,
              functionName: 'symbol',
            },
          ],
        });
        console.log(resName);
        newTenXToken.name = resName[0].result;
        newTenXToken.symbol = resName[1].result;

        const newTenXTokenArray = [...get().tenXTokenArray];
        newTenXTokenArray[_tokenIndex] = newTenXToken;

        TENX_TOKEN_ARRAY_STATUS[_tokenIndex] = STATUS.SUCCESS;
        return set((state) => ({
          tenXTokenArray: newTenXTokenArray,
        }));
      },
    }),
    { name: 'tenx-storage-0.0.1c' }
  )
);

export default useStore;
