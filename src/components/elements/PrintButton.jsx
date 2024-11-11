import { Button, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import VideoBg from 'reactjs-videobg';
import { animated,useSpring } from '@react-spring/web';
import useMeasure from 'react-use-measure'
import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadImageShape } from '@tsparticles/shape-image';
import { loadEmittersPlugin } from '@tsparticles/plugin-emitters';
import { loadAll } from '@tsparticles/all';
import { LINK_TENXV2_ASSETSET_1 } from '../../constants/links';

const trans = (x, y) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

export default function PrintButton() {

    /////////////
    //PARTICLES
    /////////////
    const [initParticles,setInitParticles] = useState(false);
    const particlesLoaded = (container) => {
      //particles loaded
    }
    useEffect(() => {
      initParticlesEngine(async (engine) => {
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadAll(engine);
        await loadImageShape(engine);
        await loadEmittersPlugin(engine);
        await loadAll(engine);
        //await loadSlim(engine);
        //await loadBasic(engine);
    }).then(() => {
      setInitParticles(true);
    });
    }, []);


    /////////////
    //ANIMATION
    /////////////
    const[active,setActive] = useState(false);
    const[wrapperOpacity,setWrapperOpacity] = useState(1);
    const [springs,api] = useSpring(()=>({
        xy:[0,0],
        config:{
            mass:22,
            friction:20,
            tension:200
        }
      }))
      const [ref, { left, top, width, height }] = useMeasure()
      console.log(left,top);
      const handleMouseMove = e => {
        if(!active) return;
        runSpring(e.clientX,e.clientY);
      }
      const runSpring = (clientX,clientY) => {
        const dX = clientX - left;
        const dY = clientY - top;
        api.start({ xy: [clientX - left, clientY - top] })
      }
      const handleStart = (e) => {
        setActive(true);
        runSpring(e.clientX,e.clientY);
        setWrapperOpacity(1);
      }
      const handleStop = (e) =>{
        setWrapperOpacity(0)
        setTimeout(()=>{console.log("timeouttrigger"),setActive(false)},1000);
      }

    
    return (<>
        <Button
        onClick={handleStart}
        variant="contained"
        target="_blank"
        rel="noreferrer"
        disableElevation={true}
        sx={{
        display:'block',
        width: '15em',
        marginTop: '2em',
        marginBottom: '1em',
        marginLeft:'auto',
        marginRight:'auto',
        fontSize: '1em',
        position: 'relative',
        fontWeight: 'bold',
        textTransform: 'none',
        color: '#1c0642',
        borderRadius: '1.5em',
        border: 'solid 5px #1c0642',
        padding:'0 1em',
        backgroundColor: '#d59880',
        '&:hover': {
            backgroundColor: '#080830',
            color:'white'
        },
        }}
        >
            Your moonshot will do this...
        </Button>
        <Box ref={ref} onMouseMove={handleMouseMove} onClick={handleStop}
         sx={{
            display:active ? 'block' : 'none',
            transition:'opacity 1s',
            opacity:wrapperOpacity,
            position:'fixed',top:0,left:0,zIndex:10, width:'100vw',height:'100vh',overflow:'hidden',background:'transparent',userSelect:'none',WebkitTouchCallout:'none',cursor:'default'}}>
            <animated.div style={{
                width:'20vw',height:'26vw',padding:'100vw',position:'relative',background:'transparent',
                willChange:'transform',
                transform:springs.xy.to(trans)
                }}>
                  <Box sx={{width:'100%',height:'100%',position:'relative'}}>
                <VideoBg videoClass="videoBg" wrapperClass="video-print-wrapper">
                <VideoBg.Source src={`${LINK_TENXV2_ASSETSET_1}/videos/print.mp4`} type="video/mp4" />
                </VideoBg>
                </Box>
            </animated.div>
            { !!active && !!initParticles && <Particles
            id="tsparticles-print"
            particlesLoaded={particlesLoaded}
            options={{
              background: {
                  color: {
                      value: "transparent",
                  },
                  opacity:0
              },
              emitters:{
                position:{
                  x:50,
                  y:100
                },
                rate:{
                  quantity:5,
                  delay:0.15
                }
              },
              fpsLimit: 60,
              particles: {
                  move: {
                      direction: 'top',
                      enable: true,
                      gravity:{
                        enable:true,
                        
                      },
                      decay:0.02,
                      outModes: {
                          top:'none',
                          default: "destroy",
                      },
                      speed:{
                        min:10,
                        max:40
                      }
                  },
                  number: {
                      value: 0,
                  },
                  opacity: {
                      value:1,
                  },
                  shape: {
                      type: "image",
                      options:{
                        image:{
                          height:100,
                          width:100,
                          src:"https://gateway.cz.cash/ipfs/bafkreiczk7nox7yizahb2tdwupm6cggef2l7l77x5lcfz5e7sixq4wuk4a"
                        }
                      }
                  },
                  size: {
                      value:{
                        min:8,
                        max:48
                      },
                      random:true,
                      animation:{
                        enable:true,
                        speed:100,
                        sync:false
                      }
                  },
              },
              detectRetina: true,
          }} />}
        </Box>
    </>);
}
