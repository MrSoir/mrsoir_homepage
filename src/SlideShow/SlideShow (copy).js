import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import meta_info from './info.txt';
import './SlideShow.css';
import '../SlideShow.css';
import {readTextFile} from '../StaticFunctions';
import CurtainButton from '../CurtainButton';

import {SlideShowGL} from '../SlideShowGL/SlideShowGL';


class SlideShow extends Component{
	constructor(args){
		super(args);
					 		  
		this.imgPaths = [];
		
		this.startAnim = this.startAnim.bind(this);
		this.stopAnim = this.stopAnim.bind(this);
		
		this.onImagesLoaded = this.onImagesLoaded.bind(this);
		this.onErrorOccured = this.onErrorOccured.bind(this);
		this.onWebGL_InitError = this.onWebGL_InitError.bind(this);
					 		  
		this.downloadCode = this.downloadCode.bind(this);

//		this.onCanvasResize = this.onCanvasResize.bind(this);

		this.loadingDiv = React.createRef();
		this.loadingMsg = 'loading...';
	}
	componentWillMount(){		
		let txt = readTextFile(meta_info);
		
		let info_lines = txt.split('\n').filter((tn)=>!!tn);
		// first line in info_lines gives the number of images to render for Ballin'GL
		let imgCount = parseInt(info_lines[0].split(' ').filter(s=>!!s).slice(-1)[0]);
		
   	let f = (id)=>{
   		let imgPath = process.env.PUBLIC_URL + '/SlideShow/pics/HippoPreview'  + id + '.png';
   		this.imgPaths.push( imgPath );
   	};
   	for(let i=0; i < imgCount; ++i){
   		f(i);
   	}
   	
//   	window.addEventListener("resize", this.onCanvasResize);
   }
   componentDidMount(){
   }
   componentWillUnmount(){
   	this.stopAnim();
   }
   createSlideShowGL(canvasID){
      this.sldShw  = new SlideShowGL(canvasID);
   	this.sldShw.onImagesLoaded = this.onImagesLoaded;
   	this.sldShw.onWebGL_InitError = this.onImagesLoaded;
		
		if(this.sldShw.supportsWebGL2()){
	   	this.startAnim(canvasID);
	   }else{
	   	this.onWebGL_InitError(canvasID);
	   }
   }
	downloadCode(){
		window.open('https://github.com/MrSoir/SlideShowGL/archive/master.zip', '_blank');
	}
	startAnim(){
		let imgPaths = this.imgPaths;
		let animationDuration = 3*1000;
		let delayDuration = 2000;
		let slMeta = {
			// mandatory:
			imgPaths: imgPaths,
			// optional:
			animationDuration: animationDuration,
			delayDuration: delayDuration,
			backgroundColor: [0,0,0, 0.0],
			animationType: 'Gravity'
		};
		let startedSuccessfully = this.sldShw.startAnimation(slMeta);
		if( !startedSuccessfully ){
			this.onErrorOccured();
		}
	}
	stopAnim(){
		this.sldShw.stopAnimation();
	}
	
	onErrorOccured(){
		const warningNode = document.querySelectorAll('#loadingDivMsg')[0];
		warningNode.innerHTML = 'Sorry, your browser <br/> doesn't seem to like <br/> WebGL 2.0...';
	}
	onWebGL_InitError(){
		const warningNode = document.querySelectorAll('#loadingDivMsg')[0];
		warningNode.innerHTML = 'Sorry, your browser <br/> doesn't support <br/> WebGL 2.0!';
	}
	onImagesLoaded(){
		const loadingDiv = this.loadingDiv.current;
		loadingDiv.style.display = 'none';
		loadingDiv.style.animationPlayState = 'paused';
	}
	render(){
		let installationInfo = <p>
									  		The Program is written in Python3 making it a cross platform application. It runs on Windows, Mac and Linux.
									  		 <br/>
									  		 Just make sure Python3 alonside the famous python-packages Numpy, Scipy and PyQt5 is installed on your system.
									  </p>;
									  
		let info = 	<p id="SlideShowInfo"
							className="ProgramDescription">
							A little while ago I discovered WebGL2.0. It's an amazing framework to render 3D-graphics.
							<br/>
							Because I became bored by the standard CSS-animations, I wrote a little library to calculate and
							render some advanced image transformations. The above demo shows it in action.
							<br/><br/>
							The library ist highly optimized. The demo renders 2^16 = 65.536 polygons every single frame and still achieves the maximum of 60 fps
							that modern browsers support. On a standard latop, the library performs 60 fps up to 2^19 = 524.288 polygons.
							On my 5-year-old laptop the performance started to drop to still reasonable 55 fps rendering 2^20 = 1.048.576 polygons.
							But because you don't gain any benefits by dividing the image into more than 500.000 equally sized polygons (the eyes won't recognize any difference
							at this high level of detail), the library is sufficiently fast even for computationally expensive transformation algorithms.
							<br/><br/>
							With this library you can compute almost any image transformation. You only have
							to write a small part of the GLSL-shader-code that computes the actual transformations.
							The library takes care of all the rest, i.e. loading WebGL2.0 components, attributes and uniforms, 
						    images as textures as well as adding several useful variables and functions that 
							are useful for the caluclations.
							<br/><br/>
							The library is also useful for non-programmers. If you are a web-devoloper, you can easily
							integrate this library into your homepage-project and choose from the already implemented transformation-algorithms.
							It only requires a few lines of code to get things going. For example, the above demo is integrated into this
							homepage (created with react) with just 4 lines of code.
							<br/><br/>
							If you donwload the code there are detailed instructions of how to use the library and how to 
							import it into your projects.
							<br/><br/>
							Of course, this code is free of any license. You are free to modify this code and use it in your projects/homepages!
					  	</p>;
					  	
		return (
			<div id="SlideShow">
				<div className="Heading">
					SlideShow
				</div>
				
				
				<div id="canvasDiv">
					<div id="loadingDiv" ref={this.loadingDiv}>
						<div id="loadingDivMsg">
							{this.loadingMsg}
						</div>
					</div>
					<canvas id="slideShowCanvas0"/>
				</div>
				
				<div id="canvasDiv">
					<div id="loadingDiv" ref={this.loadingDiv}>
						<div id="loadingDivMsg">
							{this.loadingMsg}
						</div>
					</div>
					<canvas id="slideShowCanvas1"/>
				</div>
				
				<div id="CredentialsDiv">
					<div id="ImageCredentialsHeading">
						Images from
					</div>
					<div id="ImageCredentials">
						<a className="ImageCredentialTag"
							href="https://unsplash.com/@pawel_czerwinski?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" 
							target="_blank">
							Paweł Czerwiński
						</a>
						<div className="ImageCredentialInset"/>
						<a className="ImageCredentialTag"
							href="https://unsplash.com/@lkverwoerd?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
							target="_blank">
							Lisette Verwoerd
						</a>
						<div className="ImageCredentialInset"/>
						<a className="ImageCredentialTag"
							href="https://unsplash.com/@the_bracketeer?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
							target="_blank">
							Hendrik Cornelissen
						</a>
						<div className="ImageCredentialInset"/>
						<a className="ImageCredentialTag"
							href="https://unsplash.com/@coffeebluv?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
							target="_blank">
							Michael Rodock
						</a>
						<div className="ImageCredentialInset"/>
						<a className="ImageCredentialTag"
							href="https://unsplash.com/@hebo79?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
							target="_blank">
							Henning Borgersen
						</a>
						<div className="ImageCredentialInset"/>
						<a className="ImageCredentialTag"
							href="https://unsplash.com/@huchenme?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
							target="_blank">
							Chen Hu
						</a>
					</div>
				</div>
				
				{/*<div className="SmallSeparator"/>*/}
				
				<div id="SliderShowCodeInfo">
					{info}
				</div>
				
				<CurtainButton id="DownloadCode"
									text="Download Code"
									onClick={this.downloadCode}/>
									
				<div className="invisibleVertSep"/>
			</div>
		);
	}
}

class CanvasDiv extends Component{
	constructor(args){
		super(args);
		
		
	}
	startAnim(){
		let imgPaths = this.imgPaths;
		let animationDuration = 3*1000;
		let delayDuration = 2000;
		let slMeta = {
			// mandatory:
			imgPaths: imgPaths,
			// optional:
			animationDuration: animationDuration,
			delayDuration: delayDuration,
			backgroundColor: [0,0,0, 0.0],
			animationType: 'Gravity'
		};
		let startedSuccessfully = this.sldShw.startAnimation(slMeta);
		if( !startedSuccessfully ){
			this.onErrorOccured();
		}
	}
	stopAnim(){
		this.sldShw.stopAnimation();
	}
	
	onErrorOccured(){
		const warningNode = document.querySelectorAll('#loadingDivMsg')[0];
		warningNode.innerHTML = 'Sorry, your browser <br/> doesn't seem to like <br/> WebGL 2.0...';
	}
	onWebGL_InitError(){
		const warningNode = document.querySelectorAll('#loadingDivMsg')[0];
		warningNode.innerHTML = 'Sorry, your browser <br/> doesn't support <br/> WebGL 2.0!';
	}
	onImagesLoaded(){
		const loadingDiv = this.loadingDiv.current;
		loadingDiv.style.display = 'none';
		loadingDiv.style.animationPlayState = 'paused';
	}
}

export default withRouter(SlideShow);
