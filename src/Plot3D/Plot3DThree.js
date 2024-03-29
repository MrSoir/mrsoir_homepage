import { WEBGL } from 'three/examples/jsm/WebGL.js';
import * as THREE from 'three';
import PIPE from './PipeThree';
import Grid from './GridThree';

if ( WEBGL.isWebGL2Available() === false ) {
	console.log('no webgl2 available');
}

function formatDateToStr(date){
	return date.toISOString().split('T')[0];
}
function addDaysToDate(days, date){
	return addSecondsToDate(days * 24*60*60, date);
}
function addHoursToDate(hours, date){
	return addSecondsToDate(hours * 60*60, date);
}
function addMinutesToDate(mins, date){
	return addSecondsToDate(mins * 60, date);
}
function addSecondsToDate(seconds, date){
	let dcpy = new Date(date); // clone - don't touch original date!
	dcpy.setTime(dcpy.getTime()  + seconds * 1000);
	return dcpy;
}

class Plot3DThree{
	constructor(canvas, props={}){
		this.updateCamera = this.updateCamera.bind(this);
		this.onResize = this.onResize.bind(this);
		this.render = this.render.bind(this);
		this.setLight = this.setLight.bind(this);
		this.createCustomShaderMaterial = this.createCustomShaderMaterial.bind(this);
		this.genLabel = this.genLabel.bind(this);
		
		//------------------------------------------
		
		this.props = props;
		
		this.DATA_COLORS = [0xff00ff, 0xff4444, 0x8888ff, 0xffa500];
		this.DATA_Z_PADDING = 1.5;
		this.DATA_STROKE_WIDTH = 0.2;
		
		this.AXIS_LABEL_FONT_SIZE_IF_NOT_SET = 0.3;
		this.FONT_SIZE_SETTING_SCALE_FACTOR = 0.1;
		
		this.resetData();
		
		this.DATA_WIDTH  = 15;
		this.DATA_HEIGHT = 10;
		
		const fontURI =  process.env.PUBLIC_URL + 'fonts/testFont.typeface.json';
		var fontLoader = new THREE.FontLoader();
		
		this.threeFont = undefined;
		
		//------------------------------------------
		
		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
		this.cameraZ = 30;
		
		this.canvas = canvas;
		this.context = canvas.getContext('webgl2', {antialias: true, alpha: true});
		this.renderer = new THREE.WebGLRenderer({canvas: canvas, context: this.context});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		
		this.onResize();
		
		this.scene = new THREE.Scene();
		
		this.setLight();
		
		this.dataGroup = new THREE.Group();
		this.scene.add(this.dataGroup);
		this.axisGroup = new THREE.Group();
		this.scene.add(this.axisGroup);
		
		fontLoader.load( fontURI, function( font ){
			this.threeFont = font;
			console.log('font loaded!');
			
			this.onLoaded();
			
		}.bind(this) );
		
		window.addEventListener('resize', 				this.onResize);
		window.addEventListener('orientationchange', this.onResize);
		
		this.rot = 0.0;
		this.render();
	}
	onLoaded(){
		this.setCanvasResolution();
		
		if( !!this.props.onLoaded ){
			this.props.onLoaded(this);
		}
		
		this.genAxis();
		
/*		let labels = ['Nila', 'Hippo', 'Wolfi', 'Schaffi', 'Pappi', 'Nilhorn', 'Nildrache'];
		for(let i=0; i < 3; ++i){
			this.addData( {points: this.generateRandomPoints(100), label: labels[i % labels.length]} );
		}*/
	}
	setOrthographicCamera(){
		this.props.orthographic = true;
		this.updateCamera();
	}
	setPerspectiveCamera(){
		this.props.orthographic = false;
		this.updateCamera();
	}
	addData(data){
		this.addDataPoints({points: data.points, label: data.label});
		this.alignAxis();
	}
	resetData(){
		this.data = {
			originalData: [],
			dataMeshes: [],
			dataLabelMeshes: []
		};
	}
	clearAxis(){
		this.clearThreeContainer( this.axisGroup );
	}
	clearData(){
		this.clearDataGroup();
		this.resetData();
	}
	clearDataGroup(){
		this.clearThreeContainer( this.dataGroup );
	}
	clearScene(){
		this.clearThreeContainer( this.scene );
	}
	clearThreeContainer(target){
		while(target.children.length > 0){ 
			target.remove(target.children[0]); 
		}
	}
	addLabel(labelData){
		let labelMesh = this.genLabel(labelData);
		this.data.dataLabelMeshes.push( labelMesh );
		this.dataGroup.add( labelMesh );
	}
	genLabel(labelData){
		const label = labelData.label;
		const pos = labelData.position;
		const col = labelData.color;
		
		var textGeo = new THREE.TextGeometry( label, {
			font: this.threeFont,
			size: !!labelData.fontSize ? labelData.fontSize : 0.5,
			height: 0.2,
			curveSegments: 20,
		} );
		
		var textMaterial = new THREE.MeshPhongMaterial( { color: col } );
		
		var labelMesh = new THREE.Mesh( textGeo, textMaterial );
		labelMesh.position.set( pos.x, pos.y, pos.z);
		
		return labelMesh;
	}
	setAxisLabels(axisLabels){
		this.props.axisLabels = axisLabels;
		this.updateAxis();
	}
	updateAxis(){
		this.clearAxis();
		this.genAxis();
	}
	genAxis(){
		let z = this.evalMaxZOffs();
		this.genAxisMesh();
		if(this.data.originalData.length > 1){
			this.genAxisMesh();
		}
		this.alignAxis();
	}
	alignAxis(){
		let z = this.evalMaxZOffs();
		if(this.axisGroup.children.length === 1){
			let axis = this.axisGroup.children[0];
			axis.position.set(0, 0, this.evalMaxZOffs());
		}else if(this.axisGroup.children.length > 1){
			let axis0 = this.axisGroup.children[0];
			axis0.position.set(0, 0, 0.1);
			let axis1 = this.axisGroup.children[1];
			axis1.position.set(0, 0, z);
		}
	}
	genAxisMesh(){
		let axis = new THREE.Group();
		
		// axis-arrows/indicators:
		let xAxisMesh = new PIPE.PipeArrow(new THREE.Vector3(-this.DATA_WIDTH*0.5, 0, 0),
															 	new THREE.Vector3( this.DATA_WIDTH*0.5, 0, 0),
															 	new THREE.MeshPhongMaterial({color: 0x00aaFF})); 
		let yAxisMesh = new PIPE.PipeArrow(new THREE.Vector3(-this.DATA_WIDTH*0.5, 0, 0),
															 	new THREE.Vector3(-this.DATA_WIDTH*0.5, this.DATA_HEIGHT, 0),
															 	new THREE.MeshPhongMaterial({color: 0x00aaFF}));
		axis.add(xAxisMesh);
		axis.add(yAxisMesh);
		
		// grid:
		let gridDims = {x: -this.DATA_WIDTH*0.5, y: 0, width: this.DATA_WIDTH, height: this.DATA_HEIGHT};
		let gridMaterial = new THREE.MeshPhongMaterial({color: 0xFF00ff});
		gridMaterial.transparent = true;
		gridMaterial.opacity = 0.4;
		let stepsx = this.evalGridStepsX();
		let stepsy = this.evalGridStepsY();
		let date = new Date();
/*		let axisLabels = {
			xlabels: [],//'0', '1', '2', '3', '4'],			
			ylabels: ['0', '1', '2', '3']
		};
		let curDate = new Date();
		for(let i=0; i < 5; ++i){
			let d = addDaysToDate(i, curDate);
			let dstr = formatDateToStr(d);
			axisLabels.xlabels.push(dstr);
		}*/
		let axisLabels = this.evalAxisLabels();
		let grid = new Grid(gridDims, stepsx, stepsy, gridMaterial, axisLabels, this.genLabel, this.evalAxisLabelFontSize());
		axis.add( grid );
		
		this.axisGroup.add( axis );
	}
	evalAxisLabelFontSize(){
		console.log('this.props.axisLabelFontSize: ', this.props.axisLabelFontSize);
		let axisLabels = this.evalAxisLabels();
		let axisLabelFontSize = this.AXIS_LABEL_FONT_SIZE_IF_NOT_SET;
		
		if(axisLabels && axisLabels.fontSize){
			axisLabelFontSize = axisLabels.fontSize * this.FONT_SIZE_SETTING_SCALE_FACTOR;
		}else if(this.props.axisLabelFontSize){
			axisLabelFontSize = this.props.axisLabelFontSize * this.FONT_SIZE_SETTING_SCALE_FACTOR;
		}
		return axisLabelFontSize;
	}
	evalAxisLabels(){
		return this.props.axisLabels ? this.props.axisLabels : [];
	}
	evalGridStepsX(){
		let labels = this.props.axisLabels;
		return (!!labels && !!labels.xlabels) ? labels.xlabels.length-1 : 0;
	}
	evalGridStepsY(){
		let labels = this.props.axisLabels;
		return (!!labels && !!labels.ylabels) ? labels.ylabels.length-1 : 0;
	}
	copyPoints(points){
		return points.map(p=>p);
	}
	addDataPoints(data){
		this.data.originalData.push( data );
		
		this.generateDataMesh(data.points);
		
		let labelData = {
			label: data.label,
			position: new THREE.Vector3(this.DATA_WIDTH * 0.5 + 0.5, 0, this.evalMaxZOffs()),
			color: this.evalDataColor(),
			fontSize: this.evalDataLabelFontSize()
		};
		this.addLabel( labelData );
		
		this.alignDataLabels();
	}
	evalDataLabelFontSize(){
		return !!this.props.dataLabelFontSize ? this.props.dataLabelFontSize * this.FONT_SIZE_SETTING_SCALE_FACTOR : 0.3;
	}
	alignDataLabels(){
		// set y-position of most front label to zero and 
		// then increment y-position of every label a little bit the
		// => the farther away the label is, the higher it hangs in the air 
		let dataLabelMeshes = this.data.dataLabelMeshes;
		let yoffs = 0;
		for(let i=dataLabelMeshes.length-1; i >= 0; --i){
			let pos = dataLabelMeshes[i].position.clone();
			dataLabelMeshes[i].position.set(pos.x, yoffs, pos.z);
			yoffs += 1;
		}
	}
	evalMaxZOffs(){
		return this.data.dataMeshes.length * this.DATA_Z_PADDING;
	}
	evalDataColor(){
		return this.DATA_COLORS[ this.data.originalData.length % this.DATA_COLORS.length ];
	}
	generateLabel(label){
		
	}
	generateDataMesh(points){
		let prcsdPoints       = this.processDataPoints(this.copyPoints(points), 0, this.DATA_HEIGHT);
		let prcsdStrokePoints = this.processStrokeDataPoints(this.copyPoints(points), 0, this.DATA_HEIGHT);
		
		let datacolor = this.evalDataColor();
		let dataMesh       = this.genCustomShapeMesh(prcsdPoints);
		let strokeDataMesh = this.genCustomShapeMesh(prcsdStrokePoints, 
							new THREE.MeshBasicMaterial({color: datacolor}));
		
		this.data.dataMeshes.push( {dataMesh, strokeDataMesh} );
		
		let zoffs = this.evalMaxZOffs();
		dataMesh.geometry.translate(0, 0, zoffs);
		strokeDataMesh.geometry.translate(0, 0, zoffs + 0.01);
		
		this.dataGroup.add(dataMesh);
		this.dataGroup.add(strokeDataMesh);
	}
	processDataPoints(points, ymin, ymax){
		return this.processDataPoints_hlpr(points, ymin, ymax, false);
	}
	processStrokeDataPoints(points, ymin, ymax){
		return this.processDataPoints_hlpr(points, ymin, ymax, true);
	}
	processDataPoints_hlpr(points, ymin, ymax, stroked=false){
		points = this.interpolDataPoints(points, ymin, ymax);
		points = stroked ? this.finalizeStrokePoints(points, this.DATA_STROKE_WIDTH) : this.finalizePoints(points, 0.1);
		return points;
	}
	interpolDataPoints(points, ymin, ymax){
		let intrpolPnts = [];
		let x = -Math.floor(this.DATA_WIDTH * 0.5);
		let xstep = this.DATA_WIDTH / points.length;
		
		for(let i=0; i < points.length; ++i){
			let ytar = points[i][1];
			let yintrpl = (ytar - ymin) / (ymax-ymin) * this.DATA_HEIGHT;
			intrpolPnts.push( [x, yintrpl] );
			x += xstep;
		}
		return intrpolPnts;
	}
	finalizePoints(interpolatedPoints){
		let dwh = Math.floor( this.DATA_WIDTH * 0.5 );
		interpolatedPoints.unshift( [-dwh,0] );
		interpolatedPoints.push(    [ dwh,0] );
		return interpolatedPoints;
	}
	finalizeStrokePoints(interpolatedPoints, strokeWidth){
		for(let i=interpolatedPoints.length-1; i >= 0; --i){
			interpolatedPoints.push( [interpolatedPoints[i][0], interpolatedPoints[i][1]-strokeWidth] );
		}
		return interpolatedPoints;
	}
	generateRandomPoints(n){
		let pnts = [];
		let rv = this.generateRandomValues(n);
		for(let i=0; i < n; ++i){
			pnts.push( [i, rv[i]] );
		}
		return pnts;
	}
	generateSinePoints(n){
		let pnts = [];
		let rv = this.generateSineValues(n);
		for(let i=0; i < n; ++i){
			pnts.push( [i, rv[i]] );
		}
		return pnts;
	}
	generateSineValues(n){
		let v = [];
		const offs = 0.01;
		for(let i=0; i < n ; ++i){
			let cv = Math.sin(i/n * 2 * Math.PI) + 5;
			v.push( cv );
		}
		return v;
	}
	generateRandomValues(n){
		let v = [];
		v.push(2);
		const offs = 0.1;
		for(let i=1; i < n ; ++i){
			let uptick = 1 + offs;
			let ups = Math.random() > 0.5 ? uptick : (1 / uptick);
			v.push( v[i-1] *  ups );
		}
		return v;
	}
	genCustomShape(points){
		let shp = new THREE.Shape();
		shp.moveTo(...points[0]);
		for(let i=1; i < points.length; ++i){
			shp.lineTo(...points[i]);
		}
		return shp;
	}
	genCustomShapeMesh(points, material = this.createCustomShaderMaterial()){
		let shp = this.genCustomShape(points);
		
		let extrudeSettings = { amount: 0.1, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 0.1 };
		
		let geometry = new THREE.ShapeGeometry( shp );
		let mesh = new THREE.Mesh( geometry, material);//new THREE.MeshPhongMaterial() );
		return mesh;
	}
	createCustomShaderMaterial(){
		let vertexShader = `#version 300 es
		
			out vec3 frgmntPos;
			out vec2 vUv;
			
			void main(){
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				frgmntPos = position;
				vUv = uv;
			}
		`;
		let fragmentShader = `#version 300 es
		
			precision highp float;
			precision highp int;
			
			in vec3 frgmntPos;
			in vec2 vUv;
			
			uniform float maxY;
			uniform float minY;
			
			const vec3 col = vec3(0.0, 1.0, 0.0);
			
			out vec4 out_FragColor;
			
			void main() {
				float a = (vUv.y - minY) / (maxY - minY);
				
				out_FragColor = vec4(col, a);
			}
		`;
		
		let material = new THREE.ShaderMaterial({
			uniforms: {
//				resolution: { value: new THREE.Vector2() },
				minY: {value: 0.0},
				maxY: {value: this.DATA_HEIGHT}
			},
			transparent: true,
			blending: THREE.NormalBlending,
			side: THREE.DoubleSide,
		
			vertexShader,
			fragmentShader
		});
		
		return material;
	}
	setLight(){
		this.light = new THREE.DirectionalLight( 0xffffff );
		this.light.position.set( 50, 50, 100 );
		this.scene.add(this.light);
	}
	setCanvasResolution(){
//		this.onResize();
	}
	onResize(){
		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
		this.renderer.setSize(this.windowWidth, this.windowHeight);
	
		this.updateCamera();
	}
	genPerspectiveCamera(){
		return new THREE.PerspectiveCamera(45, this.windowWidth/this.windowHeight, 1,1000);
	}
	genOrthographicCamera(){
		let width = this.DATA_WIDTH * 1.5;
		let height = this.DATA_HEIGHT * 3;
		return new THREE.OrthographicCamera( width / (-1.5), width / 1.5, height / 2, height / (-2), 1, 1000 );
	}
	updateCamera(){
		this.camera = this.props.orthographic ? this.genOrthographicCamera() : this.genPerspectiveCamera();
		this.camera.position.set(0, 0, this.cameraZ);
	}
	moveCamera(){
		let cameraPrctg = Math.sin( (this.rot * 0.25) % (2 * Math.PI) ) * 1;
		let cameraYPrctg = Math.sin( ((this.rot + 1) * 0.5) % (Math.PI * 2) ) * 0.25 + 0.25;
		let cameraMaxAngle = Math.PI * 0.2;
		let cameraAngle = cameraMaxAngle * cameraPrctg;
		this.camera.position.set( Math.sin(cameraAngle)  * this.cameraZ,
										  Math.sin(cameraYPrctg) * this.cameraZ, 
										  Math.cos(cameraAngle)  * this.cameraZ );
		this.camera.lookAt(0,0,0);
		this.rot += 0.01;
	}
	render(){
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render);
//		this.sphere.geometry.rotateY(this.rot);
		this.moveCamera();
	}
}

export default Plot3DThree;
