import { Button, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import VideoBg from 'reactjs-videobg';
import { animated,useSpring } from '@react-spring/web';
import useMeasure from 'react-use-measure'
import { useState } from 'react';

const trans = (x, y) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

export default function PrintButton() {
    const[active,setActive] = useState(false);
    const [springs,api] = useSpring(()=>({
        xy:[0,0],
        config:{
            mass:22,
            friction:20,
            tension:200
        }
      }))
      const [ref, { left, top }] = useMeasure()
      console.log(left,top);
      const handleMouseMove = e => {
        if(!active) return;
        runSpring(e.clientX,e.clientY);
      }
      const runSpring = (clientX,clientY) => {
        api.start({ xy: [clientX - left, clientY - top] })
      }
      const handleStart = (e) => {
        setActive(true);
        runSpring(e.clientX,e.clientY);
        setTimeout(()=>setActive(false),2500);
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
        <Box ref={ref} onMouseMove={handleMouseMove}
         sx={{
            display:active ? 'block' : 'none',
            position:'fixed',top:0,left:0,zIndex:10, width:'100vw',height:'100vh',overflow:'hidden',background:'transparent',userSelect:'none',WebkitTouchCallout:'none',cursor:'default'}}>
            <animated.div style={{
                width:'20vw',height:'26vw',background:'red',position:'relative',
                willChange:'transform',
                transform:springs.xy.to(trans)
                }}>
                <VideoBg videoClass="videoBg" wrapperClass="video-print-wrapper">
                <VideoBg.Source src="/videos/print.mp4" type="video/mp4" />

                </VideoBg>
            </animated.div>

        </Box>
    </>);
}
