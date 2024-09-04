import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { bsc } from 'viem/chains';
import { WagmiConfig } from 'wagmi';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

//WAGMI + WALLETCONNECT
if (!import.meta.env.VITE_WALLETCONNECT_CLOUD_ID) {
  throw new Error('You need to provide WALLETCONNECT_CLOUD_ID env variable');
}
const projectId = import.meta.env.VITE_WALLETCONNECT_CLOUD_ID;
const chains = [bsc];
const metadata = {
  name: 'TenX Automated Deployer',
  description:
    "Create your digital product effortlessly with TenX's automated deployer. Enhance community value, leverage digital marketing, and enjoy free marketing with our $10k grant. Activate your global project today!",
  url: 'https://TenX.cz.cash',
  icons: ['https://TenX.cz.cash/images/logo.png'],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

function App({ children }) {
  useEffect(() => {
    ReactGA.initialize('AW-16657419279');
    ReactGA.send({
      hitType: 'pageview',
      page: '/tenx-cz-cash',
      title: 'tenx.cz.cash homepage',
    });
  }, []);
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}

export default App;
