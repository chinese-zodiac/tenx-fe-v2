import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { bsc, bscTestnet } from 'viem/chains';
import { WagmiConfig } from 'wagmi';
import ReactGA from 'react-ga4';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from '@tsparticles/slim';
import { loadImageShape } from '@tsparticles/shape-image';
import { loadAll } from '@tsparticles/all';
import VideoBg from 'reactjs-videobg';

//WAGMI + WALLETCONNECT
if (!import.meta.env.VITE_WALLETCONNECT_CLOUD_ID) {
  throw new Error('You need to provide WALLETCONNECT_CLOUD_ID env variable');
}
const projectId = import.meta.env.VITE_WALLETCONNECT_CLOUD_ID;
// console.log({projectId})
const chains = [bsc, bscTestnet];
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
  const [ init, setInit ] = useState(false);
  const particlesLoaded = (container) => {};
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      await loadImageShape(engine);
      await loadAll(engine);
      //await loadSlim(engine);
      //await loadBasic(engine);
  }).then(() => {
      setInit(true);
  });
    ReactGA.initialize('AW-16657419279');
    ReactGA.send({
      hitType: 'pageview',
      page: '/tenx-cz-cash',
      title: 'tenx.cz.cash homepage',
    });
  }, []);
  return <WagmiConfig config={wagmiConfig}>
    <LocalizationProvider dateAdapter={AdapterDayjs}><>
    <VideoBg videoClass="videoBg" poster="/images/cityscape-bg.png">
    <VideoBg.Source src="/videos/cityscape-bg.mp4" type="video/mp4" />
    </VideoBg>
    { init && <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={{
              background: {
                  color: {
                      value: "#2a0752",
                  },
                  opacity:0.85
              },
              fpsLimit: 60,
              interactivity: {
                  events: {
                      onClick: {
                          enable: false,
                      },
                      onHover: {
                          enable: true,
                          mode: "repulse",
                      },
                      resize: true,
                  },
                  modes: {
                      repulse: {
                          distance: 300,
                          duration: 0.4,
                      },
                  },
              },
              particles: {
                  color: {
                      value: "#ffffff",
                  },
                  links: {
                      enable: false,
                  },
                  move: {
                      direction: "none",
                      enable: true,
                      outModes: {
                          default: "bounce",
                      },
                      random: false,
                      speed: 6,
                      straight: false,
                  },
                  number: {
                      density: {
                          enable: true,
                          area: 800,
                      },
                      value: 80,
                  },
                  opacity: {
                      value:1,
                  },
                  shape: {
                      type: "image",
                      options:{
                        character:{
                          value:"💸",
                        },
                        image:{
                          height:100,
                          width:100,
                          src:"https://gateway.cz.cash/ipfs/bafkreiczk7nox7yizahb2tdwupm6cggef2l7l77x5lcfz5e7sixq4wuk4a"
                        }
                      }
                  },
                  size: {
                      value:{
                        min:1,
                        max:32
                      },
                      random:true,
                      animation:{
                        enable:true,
                        speed:20,
                        sync:false
                      }
                  },
              },
              detectRetina: true,
          }} />}
      {children}
      </></LocalizationProvider></WagmiConfig>;
}

export default App;
