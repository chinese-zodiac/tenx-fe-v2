import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';
import { memoize } from 'lodash';

export const gatewayTools = new IPFSGatewayTools();
const gateways = [
  'gateway.cz.cash',
  'ipfs.io',
  'flk-ipfs.xyz',
  'dweb.link',
  'gateway.pinata.cloud',
  'w3s.link'
];

export const getIpfsUrl = async (cid) => {
  for (let i = 0; i < gateways.length; i++) {
    const gatewayUrl = gatewayTools.convertToDesiredGateway(cid, gateways[i]);
      const response = await fetch(gatewayUrl);
      if (response.ok) {
        return gatewayUrl;
      }
  }
  return '#';
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
