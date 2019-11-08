import React, { useState, useEffect, useRef } from 'react';
import {FragmentAnmiator} from './FragmentImage';
import EasingFunctions from './EasingFunctions';
import * as WAITINGBAR from '../WaitingBar/WaitingBar';
import './FragmentImagePreview.scss';

function LabelComp({text, fontSize, textAlignCenter}){
  let styl = {
    // fontSize: ('' + fontSize + 'px'),
    textAlign: (textAlignCenter ? 'center' : 'left'),
  }
  const clsName = fontSize >= 40 ? 'HeadingLCFIP' : 'DescriptionLCFIP';
  function splitTextToMaxLineWidth(wordsPerLine=5){
    let splt = text.replace(/\s/g, ' ').split(' ').map(x=>x.trim()).filter(x=>x);
    let tar = '';
    for(let i=0; i < splt.length; i+=wordsPerLine){
      tar += splt.slice(i, i+wordsPerLine).join(' ');
      tar += '\n';
    }
    tar = tar.trim();
    return tar;
  }
  // text =css  splitTextToMaxLineWidth();
  return (
    <div style={styl}
         className={clsName}>
      <p>
        {text}
      </p>
    </div>
  );
}
function genLabelComp(label, fontSize, textAlignCenter=true){
  return (<LabelComp text={label} fontSize={fontSize} textAlignCenter={textAlignCenter}/>);
}

function genFadingComponent(component, x=50, y=50, xpx=0, ypx=0, vertFadeIn=false, centralizeX=true, centralizeY=true){
  return {
    component,
    x, y,
    xpx, ypx,
    fadeInOffsX: (vertFadeIn ? 0 : -10),
    fadeInOffsY: (vertFadeIn ? -10 : 0),
    centralizeX, centralizeY,
  };
}

function AnimatedLabel({label, fadeInDelay=0, fadeOutDelay, fadeIn, fadeOut,
                        startAnimations}){
  const labelRef = useRef();
  let stopAnimations = useRef(false);

  function validNumb(x){
    return !(x === undefined || x === null);
  }

  const FADE_IN_OFFS_X = validNumb(label.fadeInOffsX) ? label.fadeInOffsX :   0;
  const FADE_IN_OFFS_Y = validNumb(label.fadeInOffsY) ? label.fadeInOffsY : -10;
  const FADE_OUT_OFFS_X = FADE_IN_OFFS_X * -2;
  const FADE_OUT_OFFS_Y = FADE_IN_OFFS_Y * -2;

  if(fadeOutDelay === undefined || fadeOutDelay === null){
    fadeOutDelay = fadeInDelay;
  }

  function animatePosition(label, sxprct, syprct, exprct, eyprct, xpx, ypx, sop, eop){
    const lbl = labelRef.current;
    if(!lbl || stopAnimations.current){
      return;
    }

    const [centralizeX, centralizeY] = [label.centralizeX, label.centralizeY];

    let totalDuration = 1000;
    let elpsd = 0;
    let st = new Date().getTime();
    function animPos(){
      let ct = new Date().getTime();
      elpsd = ct - st;
      let prgrs = elpsd / totalDuration;
      let easedPrgrs = EasingFunctions.easeOutCubic( prgrs );
      let tx = sxprct + (exprct - sxprct) * easedPrgrs;
      let ty = syprct + (eyprct - syprct) * easedPrgrs;
      let top = sop + (eop - sop) * EasingFunctions.easeOutQuart( prgrs );
      const lftstl = `calc(${tx}% + ${xpx}px)`;
      const topstl = `calc(${ty}% + ${ypx}px)`;
      const trnsfrm = `translate(${centralizeX ? '-50%' : '0'}, ${centralizeY ? '-50%' : '0'})`;
      lbl.style.left = lftstl;
      lbl.style.top  = topstl;
      lbl.style.transform = trnsfrm;
      lbl.style.opacity = '' + top;

    }
    function runAnimPos(){
      const lbl = labelRef.current;
      if(!lbl || stopAnimations.current){
        return;
      }
      animPos();
      if(elpsd < totalDuration){
        requestAnimationFrame(runAnimPos);
      }else{
        lbl.style.left = `calc(${exprct}% + ${xpx}px)`;
        lbl.style.top  = `calc(${eyprct}% + ${ypx}px)`;
        lbl.style.opacity = '' + eop;
      }
    }
    runAnimPos();
  }

  function fadeInAnim(){
    const lbl = labelRef.current;
    if(!lbl || stopAnimations.current){
      return;
    }
    setTimeout(()=>{
      animatePosition(label,
                      label.x + FADE_IN_OFFS_X, label.y + FADE_IN_OFFS_Y,
                      label.x, label.y,
                      label.xpx, label.ypx,
                      0, 1);
    }, fadeInDelay);
  }
  function fadeOutAnim(){
    setTimeout(()=>{
      animatePosition(label,
                      label.x, label.y,
                      label.x + FADE_OUT_OFFS_X, label.y + FADE_OUT_OFFS_Y,
                      label.xpx, label.ypx,
                      1, 0);
    }, fadeOutDelay);
  }

  useEffect(()=>{
    return ()=>{
      stopAnimations.current = true;
    }
  }, []);
  useEffect(()=>{
    if(stopAnimations.current){
      return;
    }
    if(!startAnimations){
      return;
    }
    if(fadeIn){
      fadeInAnim();
    }else if(fadeOut){
      fadeOutAnim();
    }
  }, [fadeIn, fadeOut, startAnimations]);

  return (
    <div className="AnimatedLabelFIP"
         ref={labelRef}>
      {label.component}
    </div>
  );
}

function PositionedPreviewLabels({imgLabels, previewId,
                                  fadeIn, fadeOut,
                                  startAnimations}){
  const FADE_IN_DELAY  = 500;
  const FADE_OUT_DELAY = 250;
  let cumulFadeInDelay = 0;
  let cumulFadeOutDelay = imgLabels ? FADE_OUT_DELAY * (imgLabels.length-1) : 0;

  const labelDivs = imgLabels && imgLabels.length > previewId && imgLabels[previewId]
        ? imgLabels[previewId].map((label, id)=>{
            cumulFadeInDelay  += FADE_IN_DELAY;
            cumulFadeOutDelay -= FADE_OUT_DELAY;
            return (
              <AnimatedLabel key={id}
                             label={label}
                             fadeInDelay={cumulFadeInDelay}
                             fadeOutDelay={cumulFadeOutDelay}
                             fadeIn={fadeIn}
                             fadeOut={fadeOut}
                             startAnimations={startAnimations}
              />
            );
          })
        : '';
  return (
    <div className="PositionedPreviewLabelsFIP">
        {labelDivs}
    </div>
  );
}
function FragmentImagePreview({imgPaths, imgLabels, onPreviewClicked}){
  function genArr(n, val){
    const arr = [];
    for(let i=0; i < n; ++i){
      arr.push( val );
    }
    return arr;
  }
  const [previewId, setPreviewId] = useState(0);
  const [labelFadeInOut, setLabelFadeInOut] = useState([false, false]);
  const [initialized, setInitialized] = useState(false);
  const [firstPrevIdIncrmntIntercepted, setFirstPrevIdIncrmntIntercepted] = useState(false);
  const loadedImages = useRef(genArr(imgPaths.length, false));
  const [newImageLoaded, setNewImageLoaded] = useState(-1);
  const [waitingBarStopped, setWaitingBarStopped] = useState(false);

  const mainRef = useRef();
  const waitingBarRef= useRef();


  function evalMainDivSize(){
    let mdc = mainRef.current;
    return [mdc.offsetWidth, mdc.offsetHeight];
  }

  function setWaitingBarDims(){
    const [mdw, mdh] = evalMainDivSize();
    let mwh = Math.min(300, Math.min(mdw, mdh) * 0.5);
    const wb = waitingBarRef.current;
    const pixelmwh = `${mwh}px`;
    wb.style.width  = pixelmwh;
    wb.style.height = pixelmwh;
    wb.style.opacity = 1;
  }

  function onFirstFewImagesLoaded(){
    setWaitingBarStopped(true);
    setInitialized(true);
  }

  function loadImages(){
    imgPaths.forEach((ip, id)=>{
      const img = new Image();
      img.onload = ()=>{
        loadedImages.current[id] = true;
        setNewImageLoaded( id );
      };
      img.src = ip;
    });
  }

  useEffect(()=>{
    setWaitingBarDims();
    loadImages();
  }, []);

  useEffect(()=>{
    if(loadedImages.current[0] && loadedImages.current[1]){
      onFirstFewImagesLoaded();
    }
  }, [newImageLoaded]);
  useEffect(()=>{
    if(waitingBarStopped){
      const wb = waitingBarRef.current;
      wb.style.opacity = 0;
    }
  }, [waitingBarStopped]);
  useEffect(()=>{
  }, [previewId]);

  function incrementPreviewId(){
    if(initialized){
      if(firstPrevIdIncrmntIntercepted){
        const nxtPrevId = (previewId + 1) % imgLabels.length;
        setPreviewId( nxtPrevId );
      }else{
        setFirstPrevIdIncrmntIntercepted(true);
      }
    }
  }

  function _onPreviewClicked(){
    if(onPreviewClicked){
      onPreviewClicked(previewId);
    }
  }

  const imageTimeoutDuration = 5000;

  const waitingBarElmnt = <WAITINGBAR.WaitingBar
              innerRadius={0.45}
              outerRadius={0.5}
              fading={true}
              fragmentCount={5}
              progressSpeed={0.035}
              scaleSpeed={0.0075}
              fillColor={new WAITINGBAR.Color(80,80,80)}
              selectedFillColor={new WAITINGBAR.Color(0,180,0)}
              outerCurved={true}
              innerCurved={true}
              stop={waitingBarStopped}
    />;

  return (
    <div className="MainFIP"
         ref={mainRef}
         onClick={_onPreviewClicked}>

      <div className="PreviewFIP">
        <FragmentAnmiator imgPaths={imgPaths}
                          imageTimeoutDuration={imageTimeoutDuration}
                          onImageEasedIn={()=>{
                            incrementPreviewId();
                            setLabelFadeInOut( [true, false] );
                            setTimeout(()=>{
                              setLabelFadeInOut( [false, true] );
                            }, imageTimeoutDuration - 250);
                          }}
                          startAnimations={initialized}
        />
      </div>
      <div className="FragmentAnimatorFIP">
        <PositionedPreviewLabels imgLabels={imgLabels}
                                 previewId={previewId}
                                 fadeIn ={labelFadeInOut[0]}
                                 fadeOut={labelFadeInOut[1]}
                                 startAnimations={initialized}
        />
      </div>
      <div ref={waitingBarRef}
           className="WaitingBarFIP">
        {waitingBarElmnt}
      </div>
    </div>
  );
}

export {FragmentImagePreview, genFadingComponent, LabelComp, genLabelComp};
