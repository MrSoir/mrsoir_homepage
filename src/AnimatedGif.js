import React, { useState, useEffect, useRef } from 'react';
import {WaitingBar} from './WaitingBar/WaitingBar';
import './AnimatedGif.scss';

function AnimatedGif({gifPath, imgPath}){
	const imgRef  = useRef();
	const mainRef = useRef();
	const [imgLoaded, setImgLoaded] = useState(false);
	const [gifLoaded, setGifLoaded] = useState(false);
	const [waitinBarFadedOut, setWaitinBarFadedOut] = useState(false);
	const runGif = useRef(false);

	useEffect(()=>{
		const sttcImg = new Image();
		sttcImg.src = imgPath;
		sttcImg.onload = ()=>{
			setImgLoaded( true );
			if(!gifLoaded){
				setImageSrcPath(imgPath);
			}
		};

		const gifImg = new Image();
		gifImg.src = gifPath;
		gifImg.onload = ()=>{
			setTimeout(()=>{
				setGifLoaded( true );
				if(runGif.current){
					setImageSrcPath(gifPath);
				}
			}, 2000);
		};
	}, []);
	useEffect(()=>{
		document.addEventListener('scroll', onScroll);
		return ()=>{
			document.removeEventListener('scroll', onScroll);
		}
	});

	useEffect(()=>{
		if(imgLoaded && gifLoaded){
			setTimeout(()=>{
				setWaitinBarFadedOut(true);
			}, 1000);
		}
	}, [imgLoaded, gifLoaded]);

	function onScroll(e){
		const md = mainRef.current;
		if(!md)return;

		const bdngRct = md.getBoundingClientRect();
		const b = bdngRct.bottom;

		if( b < (window.screen.height * 0.9) ){
			setRunGif(true);
		}
	}
	function setRunGif(rg){
		runGif.current = rg;
		if(rg && gifLoaded){
			setImageSrcPath(gifPath);
		}
	}

	function setImageSrcPath(path){
		const img = imgRef.current;
		if(img){
			img.src = path;
		}
	}

	const waitingBrCls = 'WaitingBarKUBU' + (imgLoaded && gifLoaded ? ' fadingOut' : '');
    const waitingBar = imgLoaded && gifLoaded && waitinBarFadedOut
        ? ''
        : (
            <div className={waitingBrCls}>
                <WaitingBar
                    fragmentCount={4}
                    outerCurved={true}
    				innerCurved={true}
                />
            </div>
        );

	return (
		<div className="MainANIMGIF"
			 ref={mainRef}>
			<img className="ImgANIMGIF"
				 ref={imgRef}
			/>
			{waitingBar}
		</div>
	);
}

export default AnimatedGif;