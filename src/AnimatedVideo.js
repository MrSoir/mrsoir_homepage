import React, { useState, useEffect, useRef } from 'react';
import {WaitingBar} from './WaitingBar/WaitingBar';
import './AnimatedVideo.scss';

function AnimatedVideo({videoPath, imgPath}){
	const imgRef   = useRef();
	const videoRef = useRef();
	const videoSrcRef = useRef();
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

		console.log('vidoePath: ', videoPath);

		const video    = videoRef.current;
		const videoSrc = videoSrcRef.current;
		if(!video || !videoSrc)return;
		videoSrc.src = videoPath;
		video.onloadstart = ()=>{
			setTimeout(()=>{
				setVideoLoaded( true );
				showVideo();
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
		if(imgLoaded && videoLoaded){
			setTimeout(()=>{
				setWaitinBarFadedOut(true);
			}, 1000);
		}
	}, [imgLoaded, videoLoaded]);

	function onScroll(e){
		const md = mainRef.current;
		if(!md)return;

		const bdngRct = md.getBoundingClientRect();
		const b = bdngRct.bottom;

		if( b < (window.screen.height * 0.8) ){
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
				<source 
					ref={videoSrcRef}
					type="video/mp4"
				/>
			</video>
			{waitingBar}
		</div>
	);
}

export default AnimatedVideo;