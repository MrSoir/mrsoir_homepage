import React, { useState, useEffect, useRef } from 'react';
import {WaitingBar} from '../WaitingBar/WaitingBar';
import './Carousel.scss';


const CANVAS_WIDTH  = 1000;
const CANVAS_HEIGHT = 1000;

function ImageSelector({onClicked, selected}){
    const cls = 'ImageSelectorCRSL' + (selected ? ' selected' : '');
    return (
        <div className={cls}
             onClick={onClicked}>
            
        </div>
    )
}

function CarouselCanvas({
    imgPaths, 
    stopAnimation,
    onLoaded,
    onSelectedImgIdChanged,
    delay=2000, animDur=1000
}){
    const [curImgId, setCurImgId] = useState(0);
    const curImgIdFlt = useRef(0);
    const canvasRef = useRef();
    const imgRefs = useRef([]);
    const imgsLoaded = useRef(false);
    const curAnimId = useRef(0);
    const prvImgRect = useRef();
    const curImgRect = useRef();
    const nxtImgRect = useRef();
    const inUserInitiatedAnim = useRef(false);
    const inAutoAnim = useRef(false);
    const killAnimation = useRef(false);

    useEffect(()=>{
        Promise.all( imgPaths.map(ip=>genImagePromise(ip)) )
            .then(()=>{
                // setTimeout(()=>{ // timeout for testing
                    imgsLoaded.current = true;
                    onLoaded && onLoaded();
                    _drawImgs();
                    if( !stopAnimation ){
                        startRotationAnimation();
                    }
                // }, 5000);
            }).catch(err=>{
                console.error('loading images failed: ', err);
            });

        prvImgRect.current = genRect();
        curImgRect.current = genRect();
        nxtImgRect.current = genRect();

        return ()=>{
            killAnimation.current = true;
        };
    }, []);
    useEffect(()=>{
        _drawImgs();
        if(onSelectedImgIdChanged){
            onSelectedImgIdChanged(curImgId);
        }
    }, [curImgId]);
    useEffect(()=>{
        if( !stopAnimation ){
            startRotationAnimation();
        }
    }, [stopAnimation]);
    useEffect(()=>{
        const canvas = getCanvas();
        if(!canvas)return;

        canvas.addEventListener('click', onCanvasClicked);
        return ()=>{
            canvas.removeEventListener('click', onCanvasClicked);
        }
    })

    // function relPosToAbsPos(pos){
    //     const canvas = getCanvas();
    //     return {
    //         x: pos.x * canvas.width,
    //         y: pos.y * canvas.height,
    //         w: pos.w * canvas.width,
    //         h: pos.h * canvas.height
    //     };
    // }
    function posClicked({x,y}, pos, tag){
        const xs = pos.x - pos.w * 0.5;
        const ys = pos.y - pos.h * 0.5;
        const xe = xs + pos.w;
        const ye = ys + pos.h;
        
        return x >= xs && x <= xe
            && y >= ys && y <= ye;
    }
    function onCanvasClicked(e){
        const canvas = getCanvas();
        if(!canvas)return;
        const relMousePos = {
            x: e.offsetX / canvas.offsetWidth,
            y: e.offsetY / canvas.offsetHeight
        };
        checkIfImageWasClicked( relMousePos );
    }
    function checkIfImageWasClicked({x,y}){
        if( posClicked({x,y}, curImgRect.current, 'cur') ){
            onJumpToNextImageClicked();
        }else if( posClicked({x,y}, nxtImgRect.current, 'nxt') ){
            onJumpToNextImageClicked();
        }else if( posClicked({x,y}, prvImgRect.current, 'prv') ){
            onJumpToPrevImageClicked();
        }
    }

    function genRect({x=0, y=0, w=0, h=0}={}){
        return {x,y,w,h};
    }

    function genImagePromise(pth){
        return new Promise((resolve, reject)=>{
            const img = new Image();
            img.src = pth;
            img.onload = ()=>{
                imgRefs.current.push( img );
                resolve();
            }
        });
    }

    function getContext(){
        const cnvs = getCanvas();
        if(!cnvs)return null;
        return cnvs.getContext("2d");
    }
    function getCanvas(){
        return canvasRef.current;
    }
    function clearCanvas(){
        const ctx = getContext();
        const cnvs = getCanvas();
        if(!ctx || !cnvs)return;
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
    }
    function getImage(id){
        const img = (imgRefs.current)[id];
        if(!img){
            console.error('getImage: ', img, imgRefs.current);
        }
        return img;
    }
    function drawCenteredImage({id, pos}){
        const ctx = getContext();
        const cnvs = getCanvas();
        if(!ctx || !cnvs)return;

        const img = getImage(id);

        const x = pos.x - pos.w * 0.5;
        const y = pos.y - pos.h * 0.5;
        const w = pos.w;
        const h = pos.h;
        const cnvsWdth = cnvs.width;
        const cnvsHght = cnvs.height;
    
        ctx.drawImage(  img, 
                        x * cnvsWdth, y * cnvsHght, 
                        w * cnvsWdth, h * cnvsHght);
    }

    function startRotationAnimation(){
        if( inAutoAnim.current || !imgsLoaded.current )return;
        inAutoAnim.current = true;

        setTimeout(_startRotationAnimationHlpr, delay);
    }
    function _startRotationAnimationHlpr(){
        if( stopAnimation || killAnimation.current )return;
        if( !inUserInitiatedAnim.current ){
            jumpToNextImage();
        }
        setTimeout(_startRotationAnimationHlpr, delay);
    }

    function getPrevId(curId){
        let prevId = curId - 1;
        return prevId < 0 ? imgPaths.length - 1 : prevId;
    }
    function getNextId(curId){
        return (curId + 1) % imgPaths.length;
    }

    function quadraticBezier(p0, p1, p2, t){
        const t2   = t*t;
        const t_   = (1-t);

        const tt_2 = t_ ** 2;
        const tt_  = t_ * t;
        
        let x = t_ * (t_ * p0.x + t * p1.x) + t * (t_ * p0.x + t * p2.x);
        let y = t_ * (t_ * p0.y + t * p1.y) + t * (t_ * p0.y + t * p2.y);

        return {x,y};
    }

    function evalLinearTarPos(pStart, pEnd, prgrs){
        return {
            x: pStart.x + (pEnd.x - pStart.x) * prgrs,
            y: pStart.y + (pEnd.y - pStart.y) * prgrs,
            w: pStart.w + (pEnd.w - pStart.w) * prgrs,
            h: pStart.h + (pEnd.h - pStart.h) * prgrs,
        }
    }
    function evalQuadBezTarPos(p0, p1, p2, prgrs){
        const brnst = quadraticBezier(p0, p1, p2, prgrs);
        return {
            x: brnst.x,
            y: brnst.y,
            w: p0.w + (p2.w - p0.w) * prgrs,
            h: p0.h + (p2.h - p0.h) * prgrs,
        }
    }
    function validateImgId(id){
        if(id < 0){
            return imgRefs.current.length + id;
        }
        return id % imgRefs.current.length;
    }

    function _drawImgs(){
        if(!imgsLoaded.current)return;


        const curIdFlt = validateImgId( curImgIdFlt.current );
        const curId = Math.floor( curIdFlt );
        const prgrs = curIdFlt - curId;
        
        const nxtId    = getNextId(curId);
        const nxtNxtId = getNextId(nxtId);
        const prvId    = getPrevId(curId);

        const bfctr = 0.7;
        const sfctr = 0.2;

        const sw = sfctr;
        const sh = sw;
        const bw = bfctr;
        const bh = bw;

        const p0 = {
            x: 0.5,
            y: 0.5,
            w: 0,
            h: 0
        };
        const p1 = {
            x: 0.9,
            y: 0.45,
            w: sw,
            h: sh
        }
        const p2 = {
            x: 1.4,
            y: 0.55,
            w: bw,
            h: bh
        }
        const p3 = {
            x: 0.5,
            y: 0.5,
            w: bw,
            h: bh
        }
        const p4 = {
            x: -0.60,
            y: 0.85,
            w: bw,
            h: bh
        }
        const p5 = {
            x: 0.1,
            y: 0.55,
            w: sw,
            h: sh
        }

        const imgAndPoss = [];

        const curPos = {
            id: curId,  
            pos: evalQuadBezTarPos(p3, p4, p5, prgrs)
        };
        const nxtPos = {
            id: nxtId,  
            pos: evalQuadBezTarPos(p1, p2, p3, prgrs)
        };
        const nxtNxtPos = {
            id: nxtNxtId,  
            pos: evalLinearTarPos(p0, p1, prgrs)
        };
        const prvPos = {
            id: prvId,  
            pos: evalLinearTarPos(p5, p0, prgrs)
        };

        prvImgRect.current = prvPos.pos;
        curImgRect.current = curPos.pos;
        nxtImgRect.current = nxtPos.pos;

        imgAndPoss.push( nxtNxtPos );
        imgAndPoss.push( nxtPos );
        imgAndPoss.push( curPos );
        imgAndPoss.push( prvPos );
        
        imgAndPoss.sort((ip0, ip1)=>{
            const w0 = ip0.pos.w;
            const w1 = ip1.pos.w;
            if(w0 > w1){
                return 1;
            }else if (w0 < w1){
                return -1;
            }
            return 0;
        });
        imgAndPoss.forEach(ip=>drawCenteredImage(ip));
    }
    function jumpToImage(id){
        return animFromCurTo(id);
    }
    function jumpToNextImage(){
        const curIdFlr = validateImgId( Math.ceil( curImgIdFlt.current ) );
        const nxtId = getNextId(curIdFlr);
        return animFromCurTo(nxtId);
    }
    function jumpToPrevImage(){
        const curIdFlr = validateImgId( Math.floor( curImgIdFlt.current ) );
        const nxtId = getPrevId(curIdFlr);
        return animFromCurTo(nxtId);
    }
    function animFromCurTo(endImgId){
        return new Promise((resolve, reject)=>{
            curAnimId.current++;
            const animId = curAnimId.current;

            const startImgId = curImgIdFlt.current;

            let stepsInOrder = endImgId - startImgId;
            let stepsRev = (imgRefs.current.length - Math.abs( stepsInOrder )) * (stepsInOrder < 0 ? 1 : -1);
            let steps = Math.abs(stepsInOrder) > Math.abs(stepsRev)
                ? stepsRev
                : stepsInOrder;

            const st = (new Date()).getTime();

            function execAnim(){
                if(curAnimId.current !== animId)return resolve();

                clearCanvas();

                const ct = (new Date()).getTime();
                const dt = ct - st;

                if(dt > animDur){
                    setCurImgIdRef( startImgId + steps );
                    _drawImgs();
                    return resolve();
                }
                const prgrs = dt / animDur;
                setCurImgIdRef( startImgId + steps *  prgrs );
                _drawImgs();

                requestAnimationFrame(execAnim);
            }
            execAnim();
        });
    }
    function setCurImgIdRef(val){
        curImgIdFlt.current = validateImgId( val );
        const curImgIdFlr = validateImgId( Math.floor( val ) );
        setCurImgId(curImgIdFlr);
    }
    async function onJumpToNextImageClicked(){
        return await jumpToUserSelectionImage( jumpToNextImage );
    }
    async function onJumpToPrevImageClicked(){
        return await jumpToUserSelectionImage( jumpToPrevImage );
    }
    async function onImageSelectorClicked(id){
        return await jumpToUserSelectionImage( ()=>jumpToImage(id) );
    }
    async function jumpToUserSelectionImage( jumpToFunc ){
        inUserInitiatedAnim.current = true;
        const animId = curAnimId.current + 1;
        await jumpToFunc();
        setTimeout(()=>{
            if(animId === curAnimId.current){
                inUserInitiatedAnim.current = false;
            }
        }, delay);
    }
  
    return (
        <div className="MainCRSL">
            <canvas className="CanvasCRSL"
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
            />
            <div className="ImageSelectionCRSL">
                {imgPaths.map((ip, id)=>{
                    return (
                        <ImageSelector 
                            onClicked={()=>onImageSelectorClicked(id)}
                            selected={id === curImgId}
                            key={id}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function Carousel({
    imgPaths, 
    imgRatio = {
        w: 4,
        h: 3
    }, 
    delay,
    animDur,
    onLoaded, stopAnimation, onSelectedImgIdChanged
}){
    const [loaded, setLoaded] = useState(false);
    const carouselRef = useRef();

    useEffect(()=>{
        window.addEventListener('resize', onWindowResized);
        onWindowResized();
        return ()=>{
            window.removeEventListener('resize', onWindowResized);
        }
    }, []);

    function onWindowResized(){
        const crsl = carouselRef.current;
        if(!crsl)return;
        const hght = crsl.offsetWidth / imgRatio.w * imgRatio.h;
        crsl.style.height = `${hght}px`;        
    }
    function _onLoaded(){
        setLoaded(true);
        if(onLoaded){
            onLoaded();
        }
    }

    const waitingBar = loaded
        ? ''
        : (
            <div className="WaitingBarCRSL">
                <WaitingBar
                    fragmentCount={4}
                    outerCurved={true}
    				innerCurved={true}
                    fading={true}
                />
            </div>
        );
    
    const crslDivCls = 'CarousuelCanvasDiv' + (loaded ? ' loaded' : '');

    return (
        <div className="CntrCRSL"
                ref={carouselRef}>
            <div className={crslDivCls}>
                <CarouselCanvas
                    imgPaths={imgPaths}
                    stopAnimation={stopAnimation}
                    onLoaded={_onLoaded}
                    imgRatio={imgRatio}
                    delay={delay}
                    animDur={animDur}
                    onSelectedImgIdChanged={onSelectedImgIdChanged}
                />
            </div>
            {waitingBar}
        </div>
    );
}

export default Carousel;
