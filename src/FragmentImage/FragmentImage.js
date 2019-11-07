import React, { Component, useState, useEffect, useRef } from 'react';
import EasingFunctions from './EasingFunctions';
import './FragmentImage.scss';


const FRAGMENT_ANIMATION = {
  HORIZONTAL_EASE_IN: 0,
  HORIZONTAL_EASE_OUT: 1,
  VERTICAL_EASE_IN: 2,
  VERTICAL_EASE_OUT: 3,
};

function FragmentImage({imgPath, fragmentCount, padding=1, paddingColor='#442222', fragmentDuration=500, fragmentDelay=200,
                        onAnimationFinished=()=>{}, fragmentAnimation=FRAGMENT_ANIMATION.VERTICAL_EASE_IN,
                        startAnimations}){

  let stopAnimations = useRef(false);

  const initOffsets = [];
  for(let i=0; i < fragmentCount; ++i){
    initOffsets.push(0);
  }

  function genArr(cnt, val){
    const xs = [];
    for(let i=0; i < cnt; ++i){
      xs.push(val);
    }
    return xs;
  }

  let [imgWidth, imgHeight] = [0,0];
  let [cnvsWidth, cnvsHeight] = [1000,1000];

  const canvasRef = useRef(null);
  const imgRef    = useRef(null);
  let frgmntXOffsts  = genArr(fragmentCount, 0);
  let frgmntWidths   = genArr(fragmentCount, 1);
  let frgmntYOffsts  = genArr(fragmentCount, 0);
  let frgmntHeights  = genArr(fragmentCount, 0);

  const ANIM_FRAGMENT_DELAY = fragmentDelay;
  const ANIM_FRAGMENT_DUR = fragmentDuration;
  const DURATION = fragmentDelay * (fragmentCount-1) + fragmentDuration;
  let inFadeIn = true;
  let animFrgmntId = 0;
  let elapsed = 0;
  let lt = new Date().getTime();

  resetParameters();

  function resetTimeMeasures(){
    elapsed = 0;
    lt = new Date().getTime();
  }
  function eval_dt(){
    let ct = new Date().getTime();
    let x = ct - lt;
    lt = ct;
    return x;
  }

  function resetParameters(){
    switch(fragmentAnimation){
      case FRAGMENT_ANIMATION.VERTICAL_EASE_IN:
        frgmntYOffsts  = genArr(fragmentCount, 0);
        frgmntHeights  = genArr(fragmentCount, 0);
        frgmntXOffsts  = genArr(fragmentCount, 0);
        frgmntWidths   = genArr(fragmentCount, 1);
        break;
      case FRAGMENT_ANIMATION.VERTICAL_EASE_OUT:
        frgmntYOffsts  = genArr(fragmentCount, 0);
        frgmntHeights  = genArr(fragmentCount, 0);
        frgmntXOffsts  = genArr(fragmentCount, 0);
        frgmntWidths   = genArr(fragmentCount, 1);
        break;
      case FRAGMENT_ANIMATION.HORIZONTAL_EASE_IN:
        frgmntYOffsts  = genArr(fragmentCount, 0);
        frgmntHeights  = genArr(fragmentCount, 1);
        frgmntXOffsts  = genArr(fragmentCount, 0);
        frgmntWidths   = genArr(fragmentCount, 0);
        break;
      case FRAGMENT_ANIMATION.HORIZONTAL_EASE_OUT:
        frgmntYOffsts  = genArr(fragmentCount, 0);
        frgmntHeights  = genArr(fragmentCount, 1);
        frgmntXOffsts  = genArr(fragmentCount, 0);
        frgmntWidths   = genArr(fragmentCount, 1);
        break;
    }

    resetTimeMeasures();
  }


  //----------ref-getters----------
  function getCanvas(){
    return canvasRef.current;
  }
  function getContext(){
    const cnvs = getCanvas();
    return cnvs && cnvs.getContext("2d");
  }
  function getImage(){
    return imgRef.current;
  }
  //----------ref-getters----------

  //----------paint-functions----------
  function drawFragment({sx, sy, sdx, sdy, tx, ty, tdx, tdy}){
    const ctx = getContext();
    const img = getImage();

    if(stopAnimations.current || !ctx || !img){
      return;
    }

    ctx.drawImage(img, sx, sy, sdx, sdy,
                       tx, ty, tdx, tdy);
  }
  function paintPadding(i, ctx){
    if(stopAnimations.current || !ctx){
      return;
    }
    let fragmentWidth = eval_fragmentWidth();
    let tx = (fragmentWidth + padding) * i;
    ctx.fillRect(tx, 0, padding, cnvsHeight);
  }
  function paintPaddings(){
    const ctx = getContext();
    if(stopAnimations.current || !ctx){
      return;
    }
    ctx.strokeStyle = paddingColor;
    ctx.fillStyle   = paddingColor;
    for(let i=1; i < fragmentCount; ++i){
      paintPadding(i, ctx);
    }
  }
  function eval_fragmentWidth(){
    return (cnvsWidth - padding * (fragmentCount-1))  / fragmentCount;
  }
  function eval_tx(i, fragmentWidth){
    return (fragmentWidth + padding) * i + frgmntXOffsts[i] * fragmentWidth;
  }
  function evalAndDrawFragment(i){
    if(stopAnimations.current){
      return;
    }
    let sdx = imgWidth / fragmentCount;
    let fragmentWidth = eval_fragmentWidth();
    let tdx = fragmentWidth * frgmntWidths[i];
    let sdy = imgHeight;
    // let tdy = cnvsHeight;
    let tdy = frgmntHeights[i] * cnvsHeight;
    let sx = sdx * i;
    let tx = eval_tx(i, fragmentWidth);
    let sy = 0;
    let ty = frgmntYOffsts[i] * cnvsHeight;
    drawFragment({sx, sy, sdx, sdy,
                  tx, ty, tdx, tdy});
  }
  function paintImage(){
    clearCanvas();
    for(let i=0; i < fragmentCount; ++i){
      evalAndDrawFragment(i);
    }
    paintPaddings();

  }
  function clearCanvas(){
    const ctx = getContext();
    if(stopAnimations.current || !ctx){
      return;
    }
    ctx.clearRect(0,0, cnvsWidth, cnvsHeight);
  }
  //----------paint-functions----------

  function animationDone(){
    return elapsed >= DURATION;
  }
  function verticalEaseIn(){
    easeIn_hlpr(frgmntHeights);
  }
  function verticalEaseOut(){
    easeOut_hlpr(frgmntYOffsts);
    frgmntHeights = frgmntYOffsts.map(x=>x);
    frgmntYOffsts = frgmntYOffsts.map(x=>1-x);
  }

  function horizontalEaseIn(){
    easeIn_hlpr(frgmntWidths);
  }
  function horizontalEaseOut(){
    easeOut_hlpr(frgmntXOffsts);
    frgmntWidths  = frgmntXOffsts.map(x=>x);
    frgmntXOffsts = frgmntXOffsts.map(x=>1-x);
  }

  function easeIn_hlpr(tarArr){
    if(stopAnimations.current){
      return;
    }
    for(let i=0; i < tarArr.length; ++i){
      if(elapsed >= DURATION){
        tarArr[i] = 1;
      }else{
        let startTime = ANIM_FRAGMENT_DELAY * i;
        let totalFragmentDur = ANIM_FRAGMENT_DUR === 0 ? DURATION - startTime : ANIM_FRAGMENT_DUR;
        if(elapsed < startTime){
          tarArr[i] = 0;
        }else if(elapsed >= startTime + totalFragmentDur){
          tarArr[i] = 1;
        }else{
          let absFrgmntElpsd = elapsed - startTime;
          let relFrgmntElpsd = absFrgmntElpsd / totalFragmentDur;
          tarArr[i] = EasingFunctions.easeOutQuart(relFrgmntElpsd);// Math.sin( Math.PI / 2 * relFrgmntElpsd);
        }
      }
    }
  }
  function easeOut_hlpr(tarArr){
    if(stopAnimations.current){
      return;
    }
    for(let i=0; i < tarArr.length; ++i){
      if(elapsed >= DURATION){
        tarArr[i] = 0;
      }else{
        let startTime = ANIM_FRAGMENT_DELAY * i;
        let totalFragmentDur = ANIM_FRAGMENT_DUR === 0 ? DURATION - startTime : ANIM_FRAGMENT_DUR;
        if(elapsed < startTime){
          tarArr[i] = 1;
        }else if(elapsed >= startTime + totalFragmentDur){
          tarArr[i] = 0;
        }else{
          let absFrgmntElpsd = elapsed - startTime;
          let relFrgmntElpsd = absFrgmntElpsd / totalFragmentDur;
          tarArr[i] = 1 - EasingFunctions.easeOutCubic(relFrgmntElpsd);// Math.sin( Math.PI / 2 * relFrgmntElpsd);
        }
      }
    }
  }

  function incrementAnimation(){
    if(stopAnimations.current){
      return;
    }
    let dt = eval_dt();
    elapsed += dt;

    switch(fragmentAnimation){
      case FRAGMENT_ANIMATION.VERTICAL_EASE_IN:
        verticalEaseIn();
        break;
      case FRAGMENT_ANIMATION.VERTICAL_EASE_OUT:
        verticalEaseOut();
        break;
      case FRAGMENT_ANIMATION.HORIZONTAL_EASE_IN:
        horizontalEaseIn();
        break;
      case FRAGMENT_ANIMATION.HORIZONTAL_EASE_OUT:
        horizontalEaseOut();
        break;
    }
  }

  function _onAnimationFinished(){
    if(stopAnimations.current){
      return;
    }
    onAnimationFinished();
  }

  function nextAnimationFrame(){
    if(stopAnimations.current){
      return;
    }
    incrementAnimation();
    paintImage();
    if( !animationDone() ){
      window.requestAnimationFrame(nextAnimationFrame);
    }else{
      _onAnimationFinished();
    }
  }
  function startAnimation(){
    if(stopAnimations.current){
      return;
    }
    nextAnimationFrame();
  }


  function setImagePathAndRunAnimation(){
    if(stopAnimations.current){
      return;
    }
    const img = getImage();
    img.onload = ()=>{
      imgWidth = img.width;
      imgHeight = img.height;
      startAnimation();
    };
    img.src = imgPath;
  }

  useEffect(()=>{
    if(stopAnimations.current){
      return;
    }
    if(!startAnimations){
      return;
    }
    setImagePathAndRunAnimation();
  }, [fragmentAnimation, startAnimations]);

  useEffect(()=>{
    return ()=>{
      stopAnimations.current = true;
    }
  }, []);

  return (
    <div className="MainFI">
      <img ref={imgRef}
           className="FakeImageFI"
           src={imgPath}/>
      <canvas ref={canvasRef}
              className="CanvasFI"
              width={cnvsWidth}
              height={cnvsHeight}/>
    </div>
  );
}

function FragmentAnmiator({imgPaths,
                           onImageStartsEasingIn=()=>{}, onImageEasedIn=()=>{},
                           onImageStartsEasingOut=()=>{}, onImageEasedOut=()=>{},
                           imageTimeoutDuration=2000,
                           fragmentDuration=800,
                           interAnimDelay=10,
                           fragmentDelay=150,
                           indiatorFadeOutDuration=300,
                           fragmentCount=7,
                           startAnimations
                          }){
  const [pathCntr, setPathCntr] = useState(0);
  const [imgPath, setImgPath] = useState( getNextPath() );
  const [fadeInToggle, setFadeInToggle] = useState(true);
  const [fragmentAnimation, setFragmentAnimation] = useState( FRAGMENT_ANIMATION.VERTICAL_EASE_IN );
  const [initialized, setInitialized] = useState(false);
  const indicatorRef = useRef();

  let stopAnimations = useRef(false);

  function evalTotalAnimationDuration(){
    return (fragmentDelay + interAnimDelay) * (fragmentCount - 1) + fragmentDuration;
  }
  function evalTotalImageDisplayTime(){
    return evalTotalAnimationDuration() + imageTimeoutDuration;
  }

  function incrementPathCntr(){
    setPathCntr( pathCntr + 1 );
  }
  function getNextPath(){
    return imgPaths[ (pathCntr % imgPaths.length) ];
  }

  function setNextPath(){
    setImgPath( getNextPath() );
  }

  function toggleFadeIn(){
    setFadeInToggle( !fadeInToggle );
  }
  function fadeIndiatorOut(){
    let elpsd = 0;
    const totalDuration = indiatorFadeOutDuration;
    let st = new Date().getTime();
    const indctr = indicatorRef.current;
    if(!indctr || stopAnimations.current){
      return;
    }
    indctr.style.opacity = '1';

    function fadeOut(){
      let ct = new Date().getTime();
      elpsd = ct - st;
      const prgrs = elpsd / totalDuration;
      indctr.style.opacity = '' + (1-prgrs);
    }

    function runFadeOutAnim(){
      fadeOut();
      if(elpsd < totalDuration){
        window.requestAnimationFrame(runFadeOutAnim);
      }else{
        indctr.style.width = '0%';
        indctr.style.opacity = '1';
      }
    }
    runFadeOutAnim();
  }
  function startInidatorAnimation(){
    const indctr = indicatorRef.current;
    if(!indctr || stopAnimations.current){
      return;
    }

    let elpsd = 0;
    const totalDuration = evalTotalImageDisplayTime();
    let st = new Date().getTime();
    indctr.style.opacity = '1';
    function nextIndicatorAnim(){
      let ct = new Date().getTime();
      elpsd = ct - st;
      const prgrs = elpsd / totalDuration;
      indctr.style.width = '' + (prgrs * 100) + '%';
    }

    function runIndicatorProgressAnim(){
      nextIndicatorAnim();
      if(elpsd < totalDuration){
        window.requestAnimationFrame(runIndicatorProgressAnim);
      }else{
        fadeIndiatorOut();
      }
    }
    runIndicatorProgressAnim();
  }
  function nextImage(){
    const indctr = indicatorRef.current;
    if(!indctr || stopAnimations.current){
      return;
    }
    indctr.style.width = '0%';
    startInidatorAnimation();
    incrementPathCntr();
  }
  function setNextFragmentAnimation(){
    switch(fragmentAnimation){
      case FRAGMENT_ANIMATION.VERTICAL_EASE_IN:
        onImageStartsEasingIn();
        setFragmentAnimation( FRAGMENT_ANIMATION.VERTICAL_EASE_OUT );
        break;
      case FRAGMENT_ANIMATION.VERTICAL_EASE_OUT:
        nextImage();
        setFragmentAnimation( FRAGMENT_ANIMATION.HORIZONTAL_EASE_IN );
        break;
      case FRAGMENT_ANIMATION.HORIZONTAL_EASE_IN:
        onImageStartsEasingIn();
        setFragmentAnimation( FRAGMENT_ANIMATION.HORIZONTAL_EASE_OUT );
        break;
      case FRAGMENT_ANIMATION.HORIZONTAL_EASE_OUT:
        nextImage();
        setFragmentAnimation( FRAGMENT_ANIMATION.VERTICAL_EASE_IN );
        break;
    }
  }

  useEffect(()=>{
    return ()=>{
      stopAnimations.current = true;
    }
  }, []);
  useEffect(()=>{
    if(stopAnimations.current || !startAnimations){
      return;
    }
    setNextPath();
  }, [pathCntr]);
  useEffect(()=>{
    if(stopAnimations.current){
      return;
    }
    if(!startAnimations){
      return;
    }
    if(initialized){
      setNextFragmentAnimation();
    }else{
      startInidatorAnimation();
      setInitialized(true);
    }
  }, [fadeInToggle, startAnimations]);

  return (
    <div className="FragmentAnmiator">
      <div className="FragmentImageIndicator"
           ref={indicatorRef}>
      </div>
      <FragmentImage imgPath={imgPath}
                     fragmentCount={fragmentCount}
                     fragmentDuration={fragmentDuration}
                     fragmentDelay={fragmentDelay}
                     fragmentAnimation={fragmentAnimation}
                     onAnimationFinished={()=>{
                       if(fadeInToggle){
                         onImageEasedIn();
                         setTimeout(()=>{
                           onImageStartsEasingOut();
                           toggleFadeIn();
                         }, imageTimeoutDuration);
                       }else{
                         onImageEasedOut();
                         setTimeout(toggleFadeIn, interAnimDelay);
                       }
                     }}
                     startAnimations={startAnimations}
      />
    </div>
  );
}

export {FragmentAnmiator, FragmentImage, FRAGMENT_ANIMATION};
