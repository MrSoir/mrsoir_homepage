import React, { useState, useEffect, useRef } from 'react';
import {WaitingBar} from './WaitingBar/WaitingBar';
import './AnimatedVideo.scss';

function AnimatedVideo({videoPaths, imgPath}){
	const imgRef   = useRef();
	const videoRef = useRef();
	const mainRef  = useRef();
	const [imgLoaded, setImgLoaded] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [waitinBarFadedOut, setWaitinBarFadedOut] = useState(false);
	const videoPlaying = useRef();

	useEffect(()=>{
		const sttcImg = new Image();
		sttcImg.src = imgPath;
		sttcImg.onload = ()=>{
			setImgLoaded( true );
			if(!videoLoaded){
				setImageSrcPath(imgPath);
			}
		};
	}, []);
	useEffect(()=>{
		if(imgLoaded && videoLoaded){
			setWaitinBarFadedOut(true);
		}
	}, [imgLoaded, videoLoaded]);
	useEffect(()=>{
		document.addEventListener('scroll', onScroll);

		const video    = videoRef.current;
		if(video){
			video.addEventListener('loadeddata', onVideoDataLoaded);
		}
		return ()=>{
			if(video){
				video.removeEventListener('loadeddata', onVideoDataLoaded);
			}
			document.removeEventListener('scroll', onScroll);
		}
	});

	function onVideoDataLoaded(){
		const video = videoRef.current;
		if(!video)return;

		if(video.readyState >= 2){
			setVideoLoaded( true );
			showVideo();
		}
	}

	function onScroll(e){
		const md = mainRef.current;
		if(!md)return;

		const bdngRct = md.getBoundingClientRect();
		const b = bdngRct.bottom;

		if( b < (window.screen.height * 0.9) ){
			if( !videoPlaying.current ){
				playVideo(true);
			}
		}
	}
	async function playVideo(rg){
		const video = videoRef.current;
		if(video){
			try{
				await video.play();
				video.loop = true;
				videoPlaying.current = true;
			}catch(err){
			}
		}
	}

	function setImageSrcPath(path){
		const img = imgRef.current;
		if(img){
			img.src = path;
		}
	}
	function showVideo(){
		const video = videoRef.current;
		if(video){
			video.style.opacity = 1;
			// playVideo();

			const img = imgRef.current;
			if(img){
				img.style.opacity = 0;
			}
		}
	}

	const waitingBrCls = 'WaitingBarKUBU' + (imgLoaded && videoLoaded ? ' fadingOut' : '');
    const waitingBar = imgLoaded && videoLoaded && waitinBarFadedOut
        ? ''
        : (
            <div className={waitingBrCls}>
                <WaitingBar
                    fragmentCount={4}
                    outerCurved={true}
    				innerCurved={true}
					fading={true}
                />
            </div>
        );

	return (
		<div className="MainANIMVIDEO"
			 ref={mainRef}>
			
			<img className="ImgANIMVIDEO"
				 ref={imgRef}
		 	/>
			<video className="VideoANIMVIDEO"
				   ref={videoRef}
				   width="320" height="176"
			>
				{videoPaths.map((vp, id)=>{
					return (
						<source
							key={id}
							type={`video/${vp.type}`}
							src={vp.path}
						/>
					)
				})}
			</video>
			{waitingBar}
		</div>
	);
}

export default AnimatedVideo;