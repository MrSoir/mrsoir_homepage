"use strict";

// plain-html:
//import './gl-matrix-min.js';
// react:
import * as glMatrix from 'gl-matrix';
import {GlFunctionsInstantiator} from './glFunctions.js';
import StaticFunctions from './StaticFunctions.js';
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

var FAKE_RANDOMS_CNT = 20;
var VERTEX_COUNT_PER_AXIS = 223;

//-----------------------------------------------------------------

var vertexShaderSource = `#version 300 es
	precision mediump float;
	
	//-------constants-----------
	
	const float PI  = 3.1415926535897932384626433832795;
	const float TAU = 6.2831853071795864769252867665590;
	
	//-------global variables-----------
		// have to be calcluated dynamically in the vertex shader - instancing!!!
		
	vec3 pos;
	vec2 texcoord;
	vec3 polygonXYZAverage;
	vec3 randoms;
	
	//-------attributes-----------
	
	layout (location = 0) in float vertexIDf;
/*	layout (location = 0) in vec3 pos;
	layout (location = 1) in vec2 texcoord;
	
	layout (location = 5) in vec3 polygonXYZAverage;*/
//	layout (location = 6) in vec3 randoms;
	
	//-------uniforms-----------
	
	uniform mat4 modelView;
	uniform mat4 perspective;
	
	uniform float progress;
	
	uniform vec2 imgRatio;
	
	uniform int vertexCountPerAxis;
	
	uniform float fakeRandoms[$!{FAKE_RANDOMS_CNT}!$]; // will be replaced by: FAKE_RANDOMS_CNT 
	
	//-------out-variables-------
	
	out vec2 f_texcoord;
	out float f_trnsfrmPrgrs;
	
	//-------some useful functions-------
	
	float genRandom(vec2 co){
	    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}
	
	void genRandoms(){
		float polyIDf = float(gl_InstanceID);
		vec2 v0 = polygonXYZAverage.xy * polygonXYZAverage.zy;
		vec2 v1 = polygonXYZAverage.xz * polygonXYZAverage.yz;
		vec2 v2 = polygonXYZAverage.xx * polygonXYZAverage.zz;

		float r0 = 0.2;//genRandom(polygonXYZAverage.xy / vec2(float(gl_InstanceID), vertexIDf));
		float r1 = 0.5;//genRandom(polygonXYZAverage.xz / vec2(float(gl_InstanceID+1), vertexIDf+1.0));
		float r2 = 0.8;//genRandom(polygonXYZAverage.yz / vec2(float(gl_InstanceID+2), vertexIDf+2.0));
		r0 = genRandom(texcoord);
		r1 = genRandom(texcoord+1.0);
		r2 = genRandom(texcoord+2.0);
		r0 = (polygonXYZAverage.xy / length(polygonXYZAverage.xy)).x;
		r1 = (polygonXYZAverage.xy / length(polygonXYZAverage.xy)).y;
		r2 = (texcoord.xy / length(texcoord.xy)).x;
		randoms = vec3(r0, r1, r2);
/*		float id0 = float(gl_InstanceID);
		float id1 = float(gl_InstanceID) * 0.5;
		float id2 = float(gl_InstanceID) * 0.3;
		float idSum = id0 + id1 + id2;
		
		int tarID = int(mod(idSum, $!{FAKE_RANDOMS_CNT}!$.0 - 3.0));
		
		randoms = vec3(fakeRandoms[0+tarID], fakeRandoms[1+tarID], fakeRandoms[2+tarID]);*/
	}
	
	// calcVertPos: 	splittet das bild (x: -1 -> 1 | y: -1 -> 1) in vertexCountPerAxis * vertexCountPerAxis rechtecke,
	//			die jeweils wiederum in 2 dreiecke geteilt sind. damit ergeben sich vertexCountPerAxis * vertexCountPerAxis * 2
	//			rechtecke!
	//			logik: 
	//				polygonID: 0 -> vertexCountPerAxis * vertexCountPerAxis * 2
	//				vertexID: 0 -> 2 (eines der 3 vertexes eines polygons)
	//				colID: inkrementiert jedes zweite polygonID um eins nach oben (2 dreiecke pro rechteck), bis das max bei (vertexCountPerAxis * 2 - 1) erreich ist
	//				rowID: inkrementiert jedes vertexCountPerAxis * 2 polygonID um eins nach oben, bis das max bei vertexCountPerAxis - 1 erreicht ist
	//				offs: da das bild in vertexCountPerAxis * vertexCountPerAxis rechtecke geteilt wird, springt der index sowohl in vertikaler als auch horizontaler richtung um jeweils 2.0 / vertexCountPerAxis
	//					  (2.0 == bild-range der x- und y-achse von jeweils -1 bis 1)
	void calcVertPos(){
		int vertexID = int(vertexIDf);
		int polygonID = gl_InstanceID;
		
		float polygonIDf = float(polygonID);
		
		int n = vertexCountPerAxis;
		float nf = float(n);
		int rowID = int( floor(polygonIDf / (nf*2.0)) );
		int colID = int( floor(floor(mod(polygonIDf - floor(mod(polygonIDf, 2.0)), nf*2.0))) / 2.0 );
	
		float nh = nf / 2.0;
		float rowIDf = float(rowID);
		float colIDf = float(colID);
		float offs = 2.0 / nf;
	
		float modPolyID2f = floor(mod(polygonIDf, 2.0));
		int modPolyID2i = int(modPolyID2f);
	
		vec3 v0 = vec3(0.0);
		v0[0] = -1.0 + colIDf * offs;
		v0[1] = -1.0 + rowIDf * offs;
		v0[2] = 0.0;
	
		vec3 v1 = vec3(0.0);
		v1[0] = v0[0] + (modPolyID2i == 0 ? 0.0 : offs);
		v1[1] = v0[1] + offs;
		v1[2] = 0.0;
	
		vec3 v2 = vec3(0.0);
		v2[0] = v0[0] + offs;
		v2[1] = v0[1] + (modPolyID2i == 0 ? offs : 0.0);
		v2[2] = 0.0;
	
		if(vertexID == 0){
			pos = v0;
		}else if (vertexID == 1){
			pos = v1;
		}else{ // vertexID == 2
			pos = v2;
		}
		
		polygonXYZAverage = (v0 + v1 + v2) / 3.0;
	
		texcoord = (vec2(pos) + 1.0) * 0.5;
		texcoord.y = 1.0 - texcoord.y;
	}
	
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
	
	// here will stand the vertex-shader-source-code of the derived animation-class:
	$!{derivedVertexCode}!$
	
	void main(){
		calcVertPos();
		genRandoms();
		
		f_texcoord = texcoord;
		f_trnsfrmPrgrs = progress;
		
		main_derived();
	}
`;

/*var fragmentShaderSource = `#version 300 es
	precision mediump float;
	
	out vec4 outColor;
	
	void main() {
		
		outColor = vec4(0.0, 1.0, 0.0, 1.0);
	}
`;*/


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
			images: new Map(),
			imgsLoading: 0
		};
		
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
			instancing: true,
			instanceVertexCountPerAxis: 1, // will be set in setSplitDepth()
			instanceCount: 1 //VERTEX_COUNT_PER_AXIS*VERTEX_COUNT_PER_AXIS*2
		};
		
		this.setSplitDepth(splitDepth);
		
		if(!canvasID){
			canvasID = 'canvas';
		}
		
		var canvas = document.getElementById(canvasID);
		this.gl = canvas.getContext('webgl2', {antialias: true});
		
		if(!this.gl){
			console.log('no gl-context!');
			return;
		}
		
		this.vertexShaderBaseSource = vertexShaderSource;
		this.fragmentShaderSource = fragmentShaderSource;
		
		this.glFunctions = new GlFunctionsInstantiator(this.gl);
	}
	
	setSplitDepth(splitDepth){
		this.pictureData.splitDepth = splitDepth;
		
		// non-instancing:
//		this.splitImageIntoPolygons();

		// instancing:
		this.setInstanceVertexCount();
	}
	setInstanceVertexCount(){
		let splitDepth = this.pictureData.splitDepth;
		
		let polygons = (2 ** splitDepth) * 2;
		let rectanglesPerAxis = Math.floor((polygons * 0.5) ** 0.5);
		
		this.glMeta.instancingRectanglesPerAxis = rectanglesPerAxis;
		this.glMeta.instancingPolygonsPerInstance = rectanglesPerAxis * rectanglesPerAxis * 2;
		
		this.glMeta.instancingRectanglesPerAxis = 10;
		this.glMeta.instancingPolygonsPerInstance = 10 * 10 * 2; 
		
		console.log('instancingPolygonsPerInstance: ', this.glMeta.instancingPolygonsPerInstance);
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
		
		this.pictureData.progress = 1.0;
		
		let polygonAverages = [];
		let randoms = [];
		for(let i=0; i < FAKE_RANDOMS_CNT; ++i){
			let genRandom = ()=>{
				let rndms = 1;
				let rs = 0;
				for(let rc=0; rc < rndms; ++rc){
					rs += Math.random();
				}
				return rs / rndms;
			};
			randoms.push(genRandom());
		}
		console.log('randoms: ', randoms);
		
		this.glFunctions.evalLayoutLocations( ['randoms'] );
		console.log('layoutLocations: ', this.glFunctions.layoutLocations);
		
		this.glFunctions.genAndBindVectorVBO([0,1,2], 1, 'vertexIDf');
		this.glFunctions.setUniform1fv('fakeRandoms', randoms.slice(0, 100));
		this.glFunctions.setUniform1i('vertexCountPerAxis', this.glMeta.instancingRectanglesPerAxis);
		
//		this.glFunctions.genAndBindVectorVBO(vertices,  3, 'pos');
//		this.glFunctions.genAndBindVectorVBO(textureCoords, 2, 'texcoord');
		
//		this.glFunctions.genAndBindVectorVBO(polygonAverages, 3, 'polygonXYZAverage');
//		this.glFunctions.genAndBindVectorVBO(randoms, 3, 'randoms');
		
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
		let incrmtId = (id) => (id + 1) % this.pictureData.imgPaths.length;
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
	
	setImagePaths(imgPaths){
		this.pictureData.curImgID0 = 0;
		this.pictureData.curImgID1 = imgPaths.length > 1 ? 1 : 0;
		
		this.pictureData.imgPaths = imgPaths;
		this.pictureData.imgsToLoad = imgPaths.length;
		
		this.loadAllImages( this.startAnimationLoop );
		
//		this.loadCurrentImageIDs();
	}
	
	//-----------------------------------------------------------------
	
	paintPane(){
		let vertices = this.pictureData.vertices;
		
		let primitiveType = this.gl.TRIANGLES;
		let offset = 0;
		let count = 3;//Math.floor(vertices.length / 3);
		if(this.glMeta.instancing){
			this.gl.drawArraysInstanced(primitiveType, offset, count, this.glMeta.instanceCount * this.glMeta.instancingPolygonsPerInstance);
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
		
		if(animMeta.imgPaths.length === 0){
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
			this.setSplitDepth(animMeta.splitDepth);
		}
		
		this.setImagePaths(animMeta.imgPaths);
	
		this.resizeCanvasToDisplaySize();
		
		let vertxShdrSrc = StaticFunctions.replaceString(this.vertexShaderBaseSource, [FAKE_RANDOMS_CNT, this.animationType.vertexShaderSource], ['FAKE_RANDOMS_CNT', 'derivedVertexCode']);
		let frgmntShrdSrc = !!this.animationType.fragmentShaderSource ? this.animationType.fragmentShaderSource : this.fragmentShaderSource;
	
		var vertexShader   = this.glFunctions.createShader(this.gl.VERTEX_SHADER, vertxShdrSrc);
		var fragmentShader = this.glFunctions.createShader(this.gl.FRAGMENT_SHADER, frgmntShrdSrc);
	
		var program = this.glFunctions.createProgram('picture', vertexShader, fragmentShader);
		this.glFunctions.useProgram('picture');
		
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		
		this.glFunctions.setModelView();
		this.glFunctions.setPerspective();
		
		this.createPane();
		
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
				this.setTextureImages();
				
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
		this.pictureData.progress = 0.0;
		let duration = this.animationMeta.animationDuration;
		let lastTime = null;
		this.animationMeta.stopAnimation = false;
		this.animationMeta.animationIsRunning = true;
		const curAnimID = this.animationMeta.animationID;
		
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
