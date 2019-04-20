"use strict";

// plain-html:
//import './gl-matrix-min.js';
// react:
import * as glMatrix from 'gl-matrix';
import {GlFunctionsInstantiator} from './glFunctions.js';
/*import {parseOBJ} 		from './obj_parser.js';
import {planeOBJstr} 	from './meshes/plane.js';*/
import WaveAnimation 	from './WaveAnimation.js';
import FlipAnimation 	from './FlipAnimation.js';
import ShiftAnimation 	from './ShiftAnimation.js';
import ScaleAnimation   from './ScaleAnimation.js';
import FreakAnimation   from './FreakAnimation.js';
import CycloneAnimation from './CycloneAnimation.js';
import RandomAnimation  from './RandomAnimation.js';
import GravityAnimation from './GravityAnimation.js';
import TriangleSplitter from './TriangleSplitter.js';


//-----------------------------------------------------------------

//var planeOBJ = parseOBJ(planeOBJstr);

var ANIMATIONS = new Map();
function _fillAnims(){
	ANIMATIONS.set('Wave',  WaveAnimation);
	ANIMATIONS.set('Flip',  FlipAnimation);
//	ANIMATIONS.set('Shift',  ShiftAnimation);
	ANIMATIONS.set('Scale',  ScaleAnimation);
	ANIMATIONS.set('Wave2',  FreakAnimation);
	ANIMATIONS.set('Cyclone',  CycloneAnimation);
//	ANIMATIONS.set('Random',  RandomAnimation);
	ANIMATIONS.set('Gravity',  GravityAnimation);
}
_fillAnims();

//-----------------------------------------------------------------

var vertexShaderSource = `#version 300 es
	precision mediump float;
	
	//-------constants-----------
	
	const float PI  = 3.1415926535897932384626433832795;
	const float TAU = 6.2831853071795864769252867665590;
	
	//-------attributes-----------
	
	layout (location = 0) in vec3 pos;
	layout (location = 1) in vec2 texcoord;
	
	layout (location = 5) in vec3 polygonXYZAverage;
	layout (location = 6) in vec3 randoms;
	
	//-------uniforms-----------
	
	uniform mat4 modelView;
	uniform mat4 perspective;
	
	uniform float progress;
	
	uniform vec2 imgRatio;
	
	//-------out-variables-------
	
	out vec2 f_texcoord;
	out float f_trnsfrmPrgrs;
	
	//-------some useful functions-------
	
	// rotateX, rotateY, rotateZ: OpenGL/WebGL uses columns-first vectors
	// -> results in transposed matrices in contrast to the usual row-first notation:
	
	mat4 scaleMat4(vec3 scaleVec){
		mat4 m = mat4(1.0);
		m[0][0] = scaleVec.x;
		m[1][1] = scaleVec.y;
		m[2][2] = scaleVec.z;
		return m;
	}
	mat4 translateMat4(vec3 translVec){
		mat4 m = mat4(1.0);
		m[3][0] = translVec.x;
		m[3][1] = translVec.y;
		m[3][2] = translVec.z;
		return m;
	}
		
	mat4 rotateX(float rad){
		mat4 m = mat4(1.0);
		float c = cos(rad);
		float s = sin(rad);
		m[1][1] =  c;
		m[2][1] = -s;
		m[1][2] =  s;
		m[2][2] =  c;
		return m;
	}
	mat4 rotateY(float rad){
		mat4 m = mat4(1.0);
		float c = cos(rad);
		float s = sin(rad);		
		m[0][0] =  c;
		m[2][0] =  s;
		m[0][2] = -s;
		m[2][2] =  c;
		return m;
	}
	mat4 rotateZ(float rad){
		mat4 m = mat4(1.0);
		float c = cos(rad);
		float s = sin(rad);
		m[0][0] =  c;
		m[1][0] = -s;
		m[0][1] =  s;
		m[1][1] =  c;
		return m;
	}
	
	vec4 getQuaternion(vec3 ax, float rad){
		float radHalf = rad * 0.5;
		float rhs = sin(radHalf);
		float rhc = cos(radHalf);
		vec4 q = vec4(rhc, ax.x * rhs, ax.y * rhs, ax.z * rhs);
		return q;
	}
	mat4 rotationAroundAxis(vec3 ax, float rad){
		// rotationAroundAxis using qaternions: http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm (great website!!!)
		// m[i][j] is already transposed (OpenGL/WebGL: column-first notation!)
		vec4 q = getQuaternion(ax, rad);
		mat4 m = mat4(1.0);
		float qw = q[0];
		float qx = q[1];
		float qy = q[2];
		float qz = q[3];
		float qxx = qx*qx;
		float qyy = qy*qy;
		float qzz = qz*qz;
		m[0][0] = 1.0 - 2.0 * qyy - 2.0 * qzz;
		m[1][0] = 2.0 * qx * qy - 2.0 * qz * qw;
		m[2][0] = 2.0 * qx * qz + 2.0 * qy * qw;
		m[0][1] = 2.0 * qx * qy + 2.0 * qz * qw;
		m[1][1] = 1.0 - 2.0 * qxx - 2.0 * qzz;
		m[2][1] = 2.0 * qy * qz - 2.0 * qx * qw;
		m[0][2] = 2.0 * qx * qz - 2.0 * qy * qw;
		m[1][2] = 2.0 * qy * qz + 2.0 * qx * qw;
		m[2][2] = 1.0 - 2.0 * qxx - 2.0 * qyy;
		return m;
	}
`;

var fragmentShaderSource = `#version 300 es
	precision mediump float;
	
	in vec2 f_texcoord;
	in float f_trnsfrmPrgrs;
	
	uniform sampler2D u_texture0;
	uniform sampler2D u_texture1;
	
	out vec4 outColor;
	
	void main() {
		vec4 txt0 = texture(u_texture0, f_texcoord);
		vec4 txt1 = texture(u_texture1, f_texcoord);
		
		vec4 txt;
		if(f_trnsfrmPrgrs >= 1.0){
			txt = txt1;
		}else if(f_trnsfrmPrgrs <= 0.0){
			txt = txt0;
		}else{
			txt = txt1 * f_trnsfrmPrgrs + txt0 * (1.0 - f_trnsfrmPrgrs);
		}

		outColor = txt;
	}
`;

//-----------------------------------------------------------------

class SlideShowGL{

	constructor(canvasID, splitDepth=15){		
		this.pictureData = {
			progress: 0.0,
			vertices:      [],//planeOBJ.vertices,
			normals:       [],//planeOBJ.normals,
			textureCoords: [],//planeOBJ.textureCoords,
			splitDepth: splitDepth,
			imgPaths: [],
			curImgID0: 0,
			curImgID1: 0,
			images: [],
			imgCount: 0,
			imgsLoading: 0
		};
		this.splitImageIntoPolygons();
		
		this.animationMeta = {
			animationDuration: 4000,
			delayDuration:     2000,
			inAnimationDelay:  false,
			stopAnimation: false,
			animationIsRunning: false,
			animationID: 0
		};
		this.glMeta = {
			backgroundColor: [1.0,1.0,1.0, 1.0],
			imgRatio: [1,1],
			instancing: false,
			instanceCount: 2
		};
		
		if(!canvasID){
			canvasID = 'canvas';
		}
		
		var canvas = document.getElementById(canvasID);
		this.gl = canvas.getContext('webgl2', {antialias: true});
		
		if(!this.gl){
			console.log('no gl-context!');
			return;
		}
		
		this.vertexShaderSource = vertexShaderSource;
		this.fragmentShaderSource = fragmentShaderSource;
		
		this.glFunctions = new GlFunctionsInstantiator(this.gl);
	}
	
	splitImageIntoPolygons(){
		let interpolF = v =>{
			return [(v[0] + 1.0) * 0.5, 1.0 -(v[1] + 1.0) * 0.5];
		};
		
		let vertices2D = TriangleSplitter.splitRect([-1,-1], [1,1], this.pictureData.splitDepth);

		console.log('vertices: ', vertices2D.length);
		
		let verticesVec3 = vertices2D.map(v => [[...v[0], 0], [...v[1], 0], [...v[2], 0]]);
		let vertices = verticesVec3.flat().flat();
		let textureCoords = [];
		for(let v of verticesVec3.flat()){
			textureCoords.push( ...interpolF(v) );
		}
		let normals = vertices.map((v,i) => ((i-2) % 3) === 0 ? -1 : 0);
		
		this.pictureData.vertices      = vertices;
		this.pictureData.normals       = normals;
		this.pictureData.textureCoords = textureCoords;
	}
	
	static getAnimationIdentifiers(){
		console.log('ANIMATIONS: ', ANIMATIONS.keys());
		return Array.from(ANIMATIONS.keys());
	}
	
	supportsWebGL2(){
		return !!this.gl;
	}

	//-----------------------------------------------------------------
	
	createPane(){	
		this.glFunctions.useProgram('picture');
		
		this.glFunctions.createVAO('picture');
		
		let vertices      = this.pictureData.vertices;
		let textureCoords = this.pictureData.textureCoords;
		
		this.pictureData.progress = 1.0;
		
		let polygonAverages = [];
		let randoms = [];	
		
		for(let i=0; i < Math.floor(vertices.length / 9.0); ++i){
			// polygonAverages:
			let v0 = vertices.slice(i*9 + 0, i*9 + 0 + 0 + 3);
			let v1 = vertices.slice(i*9 + 3, i*9 + 3 + 3);
			let v2 = vertices.slice(i*9 + 6, i*9 + 6 + 3);
			
			let avgx = (v0[0] + v1[0] + v2[0]) / 3.0;
			let avgy = (v0[1] + v1[1] + v2[1]) / 3.0;
			let avgz = (v0[2] + v1[2] + v2[2]) / 3.0;
			polygonAverages.push( avgx, avgy, avgz );
			polygonAverages.push( avgx, avgy, avgz );
			polygonAverages.push( avgx, avgy, avgz );
			
			let genRandom = ()=>{
				let rndms = 3;
				let rs = 0;
				for(let rc=0; rc < rndms; ++rc){
					rs += Math.random();
				}
				return rs / rndms;
			};
			
			// randoms:
			let r0, r1, r2;
			[r0, r1, r2] = [genRandom(), genRandom(), genRandom()];
			randoms.push( r0, r1, r2,
							  r0, r1, r2,
							  r0, r1, r2 );
		}
		
		this.glFunctions.evalLayoutLocations( ['pos', 'texcoord', 'polygonXYZAverage', 'randoms'] );
		console.log('layoutLocations: ', this.glFunctions.layoutLocations);
		
		this.glFunctions.genAndBindVectorVBO(vertices,  3, 'pos');
		this.glFunctions.genAndBindVectorVBO(textureCoords, 2, 'texcoord');
		
		this.glFunctions.genAndBindVectorVBO(polygonAverages, 3, 'polygonXYZAverage');
		this.glFunctions.genAndBindVectorVBO(randoms, 3, 'randoms');
		
		this.glFunctions.useProgram('picture');
		
		this.glFunctions.setUniform1f('progress', this.pictureData.progress);
		this.glFunctions.setUniformVector2fv('imgRatio', this.glMeta.imgRatio);
		
		this.setAnimationBuffers();
		
		//	 always unbind VAO:
		this.glFunctions.unbindVAO(null);
	}
	
	getFirstImageID(){
		return this.pictureData.curImgID0;
	}
	getSecondImageID(){
		return this.pictureData.curImgID1;
	}
	incrementImageIDs(){
		let incrmtId = (id) => (id + 1) % this.pictureData.imgCount;
		this.pictureData.curImgID0 = this.pictureData.curImgID1;
		this.pictureData.curImgID1 = incrmtId(this.pictureData.curImgID1);
		
		this.setTextureImages();
		
//		this.loadCurrentImageIDs();
	}
	loadCurrentImageIDs(){
		this.pictureData.imgsLoading = 0;
		
		let frstID = this.getFirstImageID();
		let scndID = this.getSecondImageID();
		
		let imgIDsToLoad = [];
		if(!this.pictureData.images[frstID]){
			imgIDsToLoad.push( frstID );
		}
		if(scndID != frstID && !this.pictureData.images[scndID]){
			imgIDsToLoad.push( scndID );
		}
		
		this.pictureData.imgsLoading = imgIDsToLoad.length;
		if(imgIDsToLoad.length > 0){
			for(let id of imgIDsToLoad){
				this.loadImage(id);
			}
		}else{
			this.setTextureImages();
		}
	}
	
	loadImage(id){
		let image = new Image();
		
		image.src = this.pictureData.imgPaths[id];
		
		image.addEventListener('load', evnt=>{
	
			this.pictureData.images[id] = image;
			this.pictureData.imgsLoading -= 1;
			if(this.pictureData.imgsLoading === 0){
				this.setTextureImages();
				if(!this.animationMeta.inAnimationDelay){
					this.startAnimationLoop();
				}
			}
		});
	}
	
	setTextureImages(){
		this.glFunctions.bindVAO('picture');
	
		let img0 = this.pictureData.images[this.getFirstImageID() ];
		let img1 = this.pictureData.images[this.getSecondImageID()];
	
		this.glFunctions.setTextureImage('img0', img0, 'u_texture0', 0);
		this.glFunctions.setTextureImage('img1', img1, 'u_texture1', 1);
		
		this.glFunctions.unbindVAO(null);
	}
	
	setImages(imgs){
		this.pictureData.images = Array.from(imgs);
		this.pictureData.imgCount = this.pictureData.images.length;
		
		this.pictureData.curImgID0 = 0;
		this.pictureData.curImgID1 = this.pictureData.images.length > 1 ? 1 : 0;
		
		this.pictureData.imgsToLoad = 0;
	}
	
	setImagePaths(imgPaths){
		this.pictureData.curImgID0 = 0;
		this.pictureData.curImgID1 = imgPaths.length > 1 ? 1 : 0;
		
		this.pictureData.imgPaths = imgPaths;
		this.pictureData.imgsToLoad = imgPaths.length;
		this.pictureData.imgCount = imgPaths.length;
		
		this.loadAllImages( this.startAnimationLoop );
		
//		this.loadCurrentImageIDs();
	}
	
	//-----------------------------------------------------------------
	
	paintPane(){
		let vertices = this.pictureData.vertices;
		
		let primitiveType = this.gl.TRIANGLES;
		let offset = 0;
		let count = Math.floor(vertices.length / 3);
		if(this.glMeta.instancing){
			this.gl.drawArraysInstanced(primitiveType, offset, count, this.glMeta.instanceCount);
		}else{
			this.gl.drawArrays(primitiveType, offset, count);
		}
	}
	
	setAnimationType(animTypeStr){
		let AnimConstr = ANIMATIONS.get(animTypeStr);
		if(!AnimConstr){
			console.log(`animation ${animTypeStr} unknown!!! you can choose between the following animations:`);
			ANIMATIONS.forEach((anim, animID)=>{
				console.log(animID);
			});
			return false;
		}
		this.animationType = new AnimConstr(this.glFunctions);
		this.animationType.setGL(this.gl);
		return true;
	}
	
	//-----------------------------------------------------------------
	
	startAnimation(animMeta) {
/*		animMeta = {
			imgPaths: imgPaths,							mandatory!
			animationDuration: animationDuration,	optional
			delayDuration: delayDuration,				optional
			backgroundColor: [0,0,0, 0.0],			optional
			animationType: 'Wave'						optional
		}*/
		
		if (!this.gl) {
			return false;
		}
		
		let animationSuccessfullySet;
		if(!!animMeta.animationType){
			animationSuccessfullySet = this.setAnimationType(animMeta.animationType);
		}else{
			animationSuccessfullySet = this.setAnimationType('Wave');
		}
		if(!animationSuccessfullySet){
			return false;
		}
		
		console.log('animMeta.images: ', animMeta.images);
		
		if( !animMeta.images && animMeta.imgPaths.length === 0 ){
			console.log('no image paths to load!!!');
		}
		
		if(!!animMeta.backgroundColor){
			this.glMeta.backgroundColor = animMeta.backgroundColor;
		}
		
		if(!!animMeta.animationDuration){
			this.animationMeta.animationDuration = animMeta.animationDuration;
		}
		if(!!animMeta.delayDuration){
			this.animationMeta.delayDuration = animMeta.delayDuration;
		}
		
		if(animMeta.splitDepth && animMeta.splitDepth != this.pictureData.splitDepth){
			this.pictureData.splitDepth = animMeta.splitDepth;
			this.splitImageIntoPolygons();
		}
		
		if(animMeta.images){
			this.setImages(animMeta.images);
		}else if (animMeta.imgPaths){
			this.setImagePaths(animMeta.imgPaths);
		}
	
		this.resizeCanvasToDisplaySize();
		
		let frgmntShrdSrc = !!this.animationType.fragmentShaderSource ? this.animationType.fragmentShaderSource : this.fragmentShaderSource;
	
		var vertexShader   = this.glFunctions.createShader(this.gl.VERTEX_SHADER,   vertexShaderSource + this.animationType.vertexShaderSource);
		var fragmentShader = this.glFunctions.createShader(this.gl.FRAGMENT_SHADER, frgmntShrdSrc);
	
		var program = this.glFunctions.createProgram('picture', vertexShader, fragmentShader);
		this.glFunctions.useProgram('picture');
		
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		
		this.glFunctions.setModelView();
		this.glFunctions.setPerspective();
		
		this.createPane();
		
		if(animMeta.images){
			this.startAnimationLoop();
		}
		
		return true;
	}
	
	loadAllImages(	callback ){
		callback = callback.bind(this);
		
		let pths = this.pictureData.imgPaths;
		let mgsToLoad = pths.length-1;
		
		const imgs = pths.map(v=>new Image());
		
		let imgLoadingFinished = ()=>{
			if(--mgsToLoad === 0){
				for(let i=0; i < imgs.length; ++i){
					this.pictureData.images[i] = imgs[i];
				}
//				this.setTextureImages();
				
				if(this.onImagesLoaded){
					this.onImagesLoaded();
				}
				callback();
			}
		};
		for(let i=0; i < pths.length; ++i){
			let pth = pths[i];
			let image = imgs[i];
		
			image.src = pth;
			
			image.addEventListener('load', imgLoadingFinished);
		}
	}
	
	stopAnimation(){
		if(this.animationMeta.animationIsRunning ||
			this.animationMeta.inAnimationDelay){
			this.animationMeta.stopAnimation = true;
		}else{
			if(this.onStoppingAnimation){
				this.onStoppingAnimation();
			}
		}
	}
	
	//-----------------------------------------------------------------
	
	onImageLoaded(){
		this.pictureData.imgsLoading -= 1;
		if(this.pictureData.imgsLoading === 0){
			this.paintPicture();
			
			this.startAnimationLoop();
		}
	}
	
	
	paintPicture(){
		this.glFunctions.useProgram('picture');
		
		this.resizeCanvasToDisplaySize();
		
		this.gl.clearColor(...this.glMeta.backgroundColor);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.glFunctions.bindVAO('picture');
		
		this.glFunctions.setUniform1f('progress', this.pictureData.progress);
		
		this.updateAnimationBuffers();
		
		this.paintPane();
		
		this.glFunctions.unbindVAO();
	}
	
	startAnimationLoop(){
		console.log('startAnimationLoop');
		
		this.pictureData.progress = 0.0;
		let duration = this.animationMeta.animationDuration;
		let lastTime = null;
		this.animationMeta.stopAnimation = false;
		this.animationMeta.animationIsRunning = true;
		const curAnimID = this.animationMeta.animationID;
		
		this.setTextureImages();
		
		let cntr = 0; // used to calc fps
		
		let innerGameLoop = (curTime)=>{
			if(this.animationMeta.stopAnimation){
				this.animationMeta.stopAnimation = false;
				this.animationMeta.animationIsRunning = false;
				if(this.onStoppingAnimation){
					this.onStoppingAnimation();
				}
				return;
			}
			
			let dt = (lastTime !== null) ? curTime - lastTime : 0;
			this.pictureData.progress = Math.min( this.pictureData.progress + dt / duration, 1.0);
			
			this.paintPicture();
			
			++cntr;
			
			lastTime = curTime;
			
			if(curAnimID != this.animationMeta.animationID){
				return;
			}
			
			if(this.pictureData.progress < 1.0){
				window.requestAnimationFrame( innerGameLoop );
			}else{
				console.log('fps: ', cntr / (duration/1000));
				
				this.animationMeta.animationIsRunning = false;
				
				this.animationMeta.inAnimationDelay = true;
				
				this.incrementImageIDs();
				this.nextAnimation();
				
				setTimeout(()=>{
					this.animationMeta.inAnimationDelay = false;
					if(this.animationMeta.stopAnimation){
						if(this.onStoppingAnimation){
							this.onStoppingAnimation();
						}
					}else{
						if(this.pictureData.imgsLoading === 0){
							this.startAnimationLoop();
						}
					}
				}, this.animationMeta.delayDuration);
			}
		};
		innerGameLoop( performance.now() );
	}
	
	setAnimationBuffers(){
		this.animationType.initBufferData();
	}
	updateAnimationBuffers(){
		this.animationType.updateBufferData();
	}
	nextAnimation(){
		this.animationType.nextAnimation();
	}
	
	resizeCanvasToDisplaySize(multiplier) {
		let canvas = this.gl.canvas;
		multiplier = multiplier || 1;
		const realToCSSPixels = window.devicePixelRatio;
		const width  = Math.floor(canvas.clientWidth  * realToCSSPixels);
		const height = Math.floor(canvas.clientHeight * realToCSSPixels);
		if (canvas.width !== width ||  canvas.height !== height) {
			const max = Math.max(width, height);
			canvas.width  = width;
			canvas.height = height;
			this.glMeta.imgRatio = [width / max, height / max];
			this.gl.viewport(0, 0, canvas.width, canvas.height);
	   	return true;
		}
	 	return false;
	}
	
	onCanvasResize(){
		this.resizeCanvasToDisplaySize();
	}
}

/*startAnimation(['../images/HippoWolfGang.png',
					 '../images/HippoWolfGang2.png',
					 '../images/Nila.png',
					 '../images/HippoWolfGangFasnet.png']);*/

export {SlideShowGL, ANIMATIONS};

