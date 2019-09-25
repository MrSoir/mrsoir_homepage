import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import meta_info from './info.txt';
import './SlideShow.css';
import '../SlideShow.css';
import {readTextFile} from '../StaticFunctions';
import CurtainButton from '../CurtainButton';
import * as WAITINGBAR  from '../WaitingBar/WaitingBar';

//import {SlideShowGL} from '../SlideShowGL/SlideShowGL';
//const SlideShowGL = require('slideshowgl');
const SlideShowGL = require('../SlideShowGL');


class SlideShow extends Component{
	constructor(args){
		super(args);
					 		  
		this.imgPaths = [];
		this.images = [];
		this.imgsLoading = 0;
		
		this.startAnim = this.startAnim.bind(this);
		this.stopAnim = this.stopAnim.bind(this);
		this.setAnimationID = this.setAnimationID.bind(this);
		this.compDidMnt = false;
		
		this.loadImages = this.loadImages.bind(this);
		this.loadImage = this.loadImage.bind(this);
		this.imagesLoaded = this.imagesLoaded.bind(this);
		
		this.onImagesLoaded = this.onImagesLoaded.bind(this);
		this.onErrorOccured = this.onErrorOccured.bind(this);
		this.onWebGL_InitError = this.onWebGL_InitError.bind(this);
					 		  
		this.downloadCode = this.downloadCode.bind(this);

//		this.onCanvasResize = this.onCanvasResize.bind(this);

		this.loadingDiv = React.createRef();
		this.loadingMsg = 'loading...';
		
		this.state = {
			selctdAnimID: 'Wave2',
			stopWaitingBar: false
		};
	}
	loadImages(){
		this.imgsLoading = this.imgPaths.length;
		console.log('loadImages -> imgsLoading: ', this.imgsLoading);
		
		this.imgPaths.map((pth, id)=>{
			this.loadImage(id);
		});
	}
	loadImage(id){
		let image = new Image();
		
		let onImgLded = (evnt=>{
			this.images[id] = image;
			this.imgsLoading -= 1;
			console.log('image loaded -> imgsLoading: ', this.imgsLoading);
			if(this.imgsLoading === 0 && 
				this.sldShw && this.sldShw.supportsWebGL2()){

				this.onImagesLoaded();
				if(this.compDidMnt){
					this.startAnim();
				}
			}
		}).bind(this);
		image.addEventListener('load', onImgLded);
		
		image.src = this.imgPaths[id];
	}
	imagesLoaded(){
		return this.imgsLoading === 0;
	}
	componentWillMount(){
		this.animationIDs = SlideShowGL.getAnimationIdentifiers();
   		
		let txt = readTextFile(meta_info);
		
		let info_lines = txt.split('\n').filter((tn)=>!!tn);
		// first line in info_lines gives the number of images to render for Ballin'GL
		let imgCount   = parseInt(info_lines[0].split(' ').filter(s=>!!s).slice(-1)[0]);
		
   	let f = (id)=>{
   		let imgPath = process.env.PUBLIC_URL + '/SlideShow/pics/HippoPreview'  + id + '.jpg';
   		this.imgPaths.push( imgPath );
   	};
   	for(let i=0; i < imgCount; ++i){
   		f(i);
   	}
   	
   	console.log('componentWillMount -> loading images...');
   	this.loadImages();
   	
//   	window.addEventListener("resize", this.onCanvasResize);
   }
   componentDidMount(){ 
   	window.scrollTo(0, 0);
   	
   	this.sldShw  = new SlideShowGL('slideShowCanvas');
//   	this.sldShw.onImagesLoaded = this.onImagesLoaded;
   	this.sldShw.onWebGL_InitError = this.onImagesLoaded;
   	
   	this.compDidMnt = true;
   	console.log('component did mount');
		
		if(this.sldShw.supportsWebGL2()){
			if(this.imagesLoaded()){
				this.startAnim();
			}
	   }else{
	   	this.onWebGL_InitError();
	   }
   }
   componentWillUnmount(){
   	this.stopAnim();
   }
	downloadCode(){
		window.open('https://www.npmjs.com/package/slideshowgl');//'https://github.com/MrSoir/SlideShowGL/archive/master.zip', '_blank');
	}
	startAnim(){
		if( !(this.sldShw && this.sldShw.supportsWebGL2()) ){
			console.log('SlideShow::startAnim -> sldShw not valid or does not support WebGL2 => exiting startAnim!!!');
			return
		}

		let fastAnimation = this.state.selctdAnimID === 'Scale' 			|| 
								  this.state.selctdAnimID === 'Cyclone' 		||
								  this.state.selctdAnimID === 'Flip' 			||
								  this.state.selctdAnimID === 'Tile' 			||
								  this.state.selctdAnimID === 'TileDelayed' 	||
								  this.state.selctdAnimID === 'TileRandom' 	||
								  this.state.selctdAnimID === 'Mirror' 		||
								  this.state.selctdAnimID === 'CenterSplit';
		let smallPolygonSplit = this.state.selctdAnimID === 'Scale' || 
								  		this.state.selctdAnimID === 'Flip' ||
								  		this.state.selctdAnimID === 'Tile' ||
								  		this.state.selctdAnimID === 'TileDelayed' ||
								  		this.state.selctdAnimID === 'TileRandom' ||
								  		this.state.selctdAnimID === 'Mirror';
								  		
		let imgPaths = this.imgPaths;
		let imgs = this.images;
		let animationDuration = 1000 * (fastAnimation ? 3 : 10);
		let delayDuration = 2000;
		let slMeta = {
			// mandatory:
//			imgPaths: imgPaths,
			images: imgs,
			// optional:
			animationDuration: animationDuration,
			delayDuration: delayDuration,
			backgroundColor: [0,0,0, 0.0],
			animationType: this.state.selctdAnimID,
			splitDepth: smallPolygonSplit ? 10 : 16 // 15
		};
		let startedSuccessfully = this.sldShw.startAnimation(slMeta);
		if( !startedSuccessfully ){
			this.onErrorOccured();
		}
	}
	stopAnim(){
		this.sldShw.stopAnimation();
	}
/*	onCanvasResize(){
		console.log('canvas resized!!!');
		sldShw.onCanvasResize();
	}*/
	
	onErrorOccured(){
		const warningNode = document.querySelectorAll('#loadingDivMsgSS')[0];
		warningNode.innerHTML = `Sorry, your browser <br/> doesn't seem to like <br/> WebGL2...`;
	}
	onWebGL_InitError(){
		const warningNode = document.querySelectorAll('#loadingDivMsgSS')[0];
		warningNode.innerHTML = `Sorry, your browser <br/> doesn't support <br/> WebGL2!`;
	}
	onImagesLoaded(){
		const loadingDiv = this.loadingDiv.current;
		loadingDiv.style.display = 'none';
		loadingDiv.style.animationPlayState = 'paused';
		this.setState({stopWaitingBar: true});
	}
	setAnimationID(animID){
		let state = this.state;
		if(state.selctdAnimID != animID){
			state.selctdAnimID = animID;
			this.setState(state);
			this.sldShw.onStoppingAnimation = (()=>{
				this.sldShw.onStoppingAnimation = undefined;
				this.startAnim();
			}).bind(this);
			this.sldShw.stopAnimation();
		}
		
	}
	render(){
		let installationInfo = <p>
									  		The Program is written in Python3 making it a cross platform application. It runs on Windows, Mac and Linux.
									  		 <br/>
									  		 Just make sure Python3 alonside the famous python-packages Numpy, Scipy and PyQt5 is installed on your system.
									  </p>;
									  
		let info = 	<p id="SlideShowInfo"
							className="ProgramDescription">
							A little while ago I discovered WebGL2. It's an amazing framework for rendering 3D-graphics.
							<br/>
							Because the standard CSS-animations are quite limited, I wrote a little library to calculate and
							render some advanced image transformations. The above demo demonstrates it's capabilities.
							<br/><br/>
							The library ist highly optimized. The demo renders 2^16 = 65,536 polygons every single frame and still achieves the maximum of 60 fps
							that modern browsers support (on mobile devices only 2^13 = 8,192 are rendered, some old smartphones seem to struggle with larger Javascript-arrays).
							On a standard latop the library performs 60 fps up to 2^19 = 524,288 polygons.
							On my 5-year-old laptop the performance started to drop to still reasonable 55 fps while rendering 2^20 = 1,048,576 polygons. But this is rather a 
							theoretcial limit. Splitting the image into more than 1 million polygons is somewhat pointless because the eye won't recognize any difference at that high level of detail.
							So the library is sufficiently fast even for computationally expensive transformation algorithms.
							<br/><br/>
							With this library you can compute almost any image transformation. You only have
							to write a small part of the GLSL-shader-code that computes the actual transformations.
							The library takes care of all the rest, i.e. loading WebGL2 components, attributes, uniforms and
						    images as textures. I've also implemented several functions in the GLSL-shader-code that make some of the most common 3D-calculations easier 
						   (e.g. computing rotation matrices using quaternions).
							<br/><br/>
							The library is also useful for non-programmers. If you are a web-devoloper, you can easily
							embed this library in your website and choose from the already implemented transformation algorithms.
							It requires only few lines of code. The above demo is embedded in this
							website (created with the awesome React.js-framework) with just 4 lines of code.
							<br/><br/>
							This code is free of any license. You are free to modify this code and use it in your projects/homepages!
							I published the library as a npm-package. Detailed instructions on how to install and use SlideShowGL can be found here:
					  	</p>;

		return (
			<div id="SlideShow">
				<div className="ProgramHeading">
					SlideShow
				</div>
				
				<div className="AnimationKeyHeading PlainTextSize">
					Select an animation:
					<div className="AnimationKeyButtons PlainTextSize">
						{this.animationIDs.sort().map(animID=>{
							let clsNme = "AnimKeyBtn" + (animID === this.state.selctdAnimID ? " AnimKeyBtnSelected" : "");
							return <div className={clsNme}
											key={animID}
											onClick={()=>{this.setAnimationID(animID);}}>
										{animID}
									 </div>
						})}
					</div>
				</div>
				<br/>
				
				<div id="canvasDiv">
					<div id="loadingDivSS" ref={this.loadingDiv}>
						<div id="WaitingBarDivSS">
							<WAITINGBAR.WaitingBar
					      	innerRadius={200}
					      	outerRadius={230}
					      	stop={this.state.stopWaitingBar}
					      />
				      </div>
						{/*<div id="loadingDivMsgSS">
							{this.loadingMsg}
						</div>*/}
					</div>
					<canvas id="slideShowCanvas"/>
				</div>
				
				<div id="CredentialsDiv"
					  className="PlainTextSize">
					<div id="ImageCredentialsHeading"
							className="PlainTextSize">
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
									text="SlideShowGL npm-package"
									onClick={this.downloadCode}/>
									
				<div className="invisibleVertSep"/>
			</div>
		);
	}
}

export default withRouter(SlideShow);