import React, { useState, useEffect, useRef } from 'react';
import {FragmentAnmiator} from './FragmentImage';
import EasingFunctions from './EasingFunctions';
import './FragmentImagePreview.scss';

function LabelComp({text, fontSize, textAlignCenter}){
  let styl = {
    fontSize: ('' + fontSize + 'px'),
    textAlign: (textAlignCenter ? 'center' : 'left'),
  }
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
  text = splitTextToMaxLineWidth();
  return (
    <div style={styl}>
      <pre>
        {text}
      </pre>
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

function AnimatedLabel({label, fadeInDelay=0, fadeOutDelay, fadeIn, fadeOut}){
  const labelRef = useRef();
  let stopAnimations = false;

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
    if(!lbl || stopAnimations){
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
      if(!lbl || stopAnimations){
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
    if(!lbl || stopAnimations){
      return;
    }
    const [x,y] = [label.x, label.y];
    setTimeout(()=>{
      animatePosition(label,
                      label.x + FADE_IN_OFFS_X, label.y + FADE_IN_OFFS_Y,
                      label.x, label.y,
                      label.xpx, label.ypx,
                      0, 1);
    }, fadeInDelay);
  }
  function fadeOutAnim(){
    const [x,y] = [label.x, label.y];
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
      stopAnimations = true;
    }
  }, []);
  useEffect(()=>{
    if(stopAnimations){
      return;
    }
    if(fadeIn){
      fadeInAnim();
    }else if(fadeOut){
      fadeOutAnim();
    }
  }, [fadeIn, fadeOut]);

  return (
    <div className="AnimatedLabelFIP"
         ref={labelRef}>
      {label.component}
    </div>
  );
}

function PositionedPreviewLabels({imgLabels, previewId,
                                  fadeIn, fadeOut}){
  const FADE_IN_DELAY  = 500;
  const FADE_OUT_DELAY = 250;
  let cumulFadeInDelay = 0;
  let cumulFadeOutDelay = imgLabels ? FADE_OUT_DELAY * (imgLabels.length-1) : 0;

  const labelDivs = imgLabels && imgLabels.length > previewId && imgLabels[previewId]
        ? imgLabels[previewId].map((label)=>{
            cumulFadeInDelay  += FADE_IN_DELAY;
            cumulFadeOutDelay -= FADE_OUT_DELAY;
            return (
              <AnimatedLabel label={label}
                             fadeInDelay={cumulFadeInDelay}
                             fadeOutDelay={cumulFadeOutDelay}
                             fadeIn={fadeIn}
                             fadeOut={fadeOut}
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
function FragmentImagePreview({imgPaths, imgLabels}){
  const [previewId, setPreviewId] = useState(0);
  const [labelFadeInOut, setLabelFadeInOut] = useState([false, false]);
  const [initialized, setInitialized] = useState(false);

  useEffect(()=>{
    setInitialized(true);
  }, []);

  function incrementPreviewId(){
    if(initialized){
      setPreviewId( (previewId + 1) % imgLabels.length );
    }
  }

  const imageTimeoutDuration = 5000;

  return (
    <div className="MainFIP">
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
        />
      </div>
      <div className="FragmentAnimatorFIP">
        <PositionedPreviewLabels imgLabels={imgLabels}
                                 previewId={previewId}
                                 fadeIn ={labelFadeInOut[0]}
                                 fadeOut={labelFadeInOut[1]}
        />
      </div>
    </div>
  );
}

export {FragmentImagePreview, genFadingComponent, LabelComp, genLabelComp};
