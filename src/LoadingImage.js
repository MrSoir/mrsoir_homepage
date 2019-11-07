import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import WaveWaitingBar from './WaveWaitingBar/WaveWaitingBar';
import * as WAITINGBAR from './WaitingBar/WaitingBar';
import './LoadingImage.css';


function LoadingImage(props){

  const mainRef = useRef(null);
  const imgRef = useRef(null);
  const waitingBarRef = useRef(null);

  const [waitingBarStopped, stopWaitingBar] = useState(false);
  const [randomId, setRandomId] = useState(Math.random());

  function evalMainDivSize(){
    let mdc = mainRef.current;
    return [mdc.offsetWidth, mdc.offsetHeight];
  }

  function setWaitingBarDims(){
    const [mdw, mdh] = evalMainDivSize();
    let mwh = Math.min(mdw, mdh) * 0.5;
    const wb = waitingBarRef.current;
    const pixelmwh = `${mwh}px`;
    wb.style.width  = pixelmwh;
    wb.style.height = pixelmwh;
  }

  function hideWaitingBar(){
    const wb = waitingBarRef.current;
    wb.style.opacity = '0';
    setTimeout(()=>{
      wb.style.display = 'none';
    }, 500);

    stopWaitingBar(true);
  }
  function showImage(){
    const ir = imgRef.current;
    ir.style.opacity = '1';
  }

  useEffect(()=>{
    setWaitingBarDims();

    const ir = imgRef.current;
    ir.onload = function(){

      setTimeout(()=>{
        showImage();
        hideWaitingBar();
      }, 500);
    };
    ir.src = props.src;

    return ()=>{
      stopWaitingBar(true);
    };
  }, []);

  const waitingBarRandomType = randomId > 0.5;

  const waitingBarElmnt = waitingBarRandomType
    ? <WaveWaitingBar r={0}
                      g={1}
                      b={0}
                      elementCount={80}
                      stop={waitingBarStopped}
                      roundedEdges={false}
      />
    : <WAITINGBAR.WaitingBar
                innerRadius={0.44}
    						outerRadius={0.5}
    						fading={true}
    						fragmentCount={5}
    						progressSpeed={0.035}
    						scaleSpeed={0.015}
    						fillColor={new WAITINGBAR.Color(80,80,80)}
    						selectedFillColor={new WAITINGBAR.Color(0,180,0)}
    						outerCurved={true}
    						innerCurved={true}
                stop={waitingBarStopped}
      />;

  return (
    <div className="LoadingImageLI"
         ref={mainRef}>
           <img className="ImgLI" ref={imgRef}/>
      <div ref={waitingBarRef}
           className="WaitingBarLI">
        {waitingBarElmnt}
      </div>
    </div>
  );
}

export default LoadingImage;
