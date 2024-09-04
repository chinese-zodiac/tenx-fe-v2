import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import { memoize } from 'lodash';

const gatewayTools = new IPFSGatewayTools();
const gateways = [
  'https://ipfs.czodiac.com',
  'https://czodiac.mypinata.cloud',
  'https://ipfs.fleek.co',
  'https://cloudflare-ipfs.com',
  'https://gateway.ipfs.io',
];

export const getIpfsUrl = (sourceUrl, cycle = 0) => {
  //console.log('gateway',gateways[cycle%gateways.length])
  return gatewayTools.convertToDesiredGateway(
    sourceUrl,
    gateways[cycle % gateways.length]
  );
};

export const getIpfsJson = memoize(async (sourceUrl) => {
  let s = window.localStorage;
  let item = JSON.parse(s.getItem(sourceUrl));
  if (item != null) return item;

  let cycle = 0;
  let isLoading = true;
  while (isLoading) {
    try {
      let result = await fetch(getIpfsUrl(sourceUrl, cycle));
      item = await result.json();
      isLoading = false;
    } catch {
      cycle++;
    }
  }
  s.setItem(sourceUrl, JSON.stringify(item));
  return item;
});
