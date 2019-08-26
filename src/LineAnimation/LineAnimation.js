import React, { Component } from 'react';
import * as THREE from 'three';
import './LineAnimation.css';



//----------------------------------

const {
	WebGLRenderer, Scene, PerspectiveCamera, Mesh, Color,
	Vector3, SplineCurve, Path,
} = THREE

function genRandomFloat(mi, mx){
	return (Math.random() * (mx - mi) + mi);
}

let windowWidth 	= window.innerWidth;
let windowHeight 	= window.innerHeight;

class Webgl {
	constructor(w, h) {
		this.meshListeners = [];
		
		this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		
		this.scene = new Scene();
		
		let cameraZ = 500;
		
		this.camera = new PerspectiveCamera(45, w / h, 1, 1000);
		this.camera.position.set(0, 0, cameraZ);
		
		this.light = new THREE.DirectionalLight( 0xffffff );
		this.light.position.set( -300, 0, cameraZ );
		this.scene.add(this.light);
		
		this.dom = this.renderer.domElement;
		this.update = this.update.bind(this);
		this.resize = this.resize.bind(this);
		this.resize(w, h); // set render size
	}
	add(mesh) {
		this.scene.add(mesh);
		if (!mesh.update)
			return;
		this.meshListeners.push(mesh.update);
	}
	addCircle(mesh){
		this.scene.add(mesh);
		if(!this.circles){
			this.circles = [];
		}
		this.circles.push(mesh);
	}
	clearCircles(){
		if(!this.circles){
			return;
		}
		this.circles.forEach(c=>{
			this.scene.remove(c);
		});
		this.circles.splice(0, this.circles.length);
	}
	remove(mesh) {
		this.scene.remove(mesh);
		
		const idx = this.meshListeners.indexOf(mesh.update);
		if (idx < 0){
			return;
		}
		this.meshListeners.splice(idx, 1);
	
	}
	update() {
		for(let i=0; i < this.meshListeners.length; ++i){
			this.meshListeners[i].apply();
		}
		this.renderer.render(this.scene, this.camera);
	}
	resize(w, h) {
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(w, h);
	}
}
/*const webgl = new Webgl(windowWidth, windowHeight);
document.body.appendChild(webgl.dom);*/

const LINE_WIDTH = 1.5;
const COLOR_IDS = [
	0xff0000,
	0xff00ff,
	0x0000ff,
	0x00ff00,
];

function genMaterial(){
	return new THREE.MeshStandardMaterial({color: 0xff0000, 
									
														metalness: 0.0, 
														roughness: 0.25});
}

class PipeCurve extends THREE.Curve{
	constructor(points){
		super();
		this.points = points;
		this.getPoint = this.getPoint.bind(this);
	}
	evalPointId(t){
		return t * (this.points.length-1);
	}
	getPoint(t){
		if(t === 0){
			return this.points[0];
		}else if(t === this.points.length-1){
			return this.points[this.points.length-1];
		}
		
		let pid = this.evalPointId(t);
		let lid = Math.floor(pid);
		let uid = lid + 1;
		let offs = pid % 1;
		
		if(uid === this.points.length){
			return this.points[uid-1];
		}
		
/*		console.log('t: ', t, '	points.length: ', this.points.length,
						'	pid: ', pid, '	lid: ', lid, '	uid: ', uid, '	offs: ', offs);*/
		
		let lp = this.points[lid].clone();
		let up = this.points[uid].clone();
		
		let dst = up.clone().sub(lp);
		
		return lp.add( dst.multiplyScalar(offs) );
		
		
/*		console.log('t: ', t);
		let tx = t * 3 - 1.5;
		let ty = Math.sin( 2 * Math.PI * t );
		let tz = 0;

		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( 50 );*/
	}
}

class Pipe extends Mesh {
	constructor(points, {
						tubularSegments = 6,
						radius = 1,
						radialSegments = 4,
						closed = false,
						color = 0x003300
						
					}={}){
		let path = new PipeCurve(points);
		
		let geometry = new THREE.TubeGeometry( path, tubularSegments, radius, radialSegments, closed );
		
		let material = genMaterial();
		
		super(geometry, material);
		
		this.points = points;
	}
}


//-------------------------


class LineAnimation extends Component{
	constructor(props){
		super(props);
		
		this.mainDivRef = React.createRef();
		
		this.MAX_DIST = 500;
		this.WEBGL_BOUNDARIES_WIDTH  = 1000;
		this.WEBGL_BOUNDARIES_HEIGHT = 500;
		this.WEBGL_BOUNDARIES_DEPTH = 800;
		
		this.XMIN = -this.WEBGL_BOUNDARIES_WIDTH * 0.5;
		this.XMAX =  this.WEBGL_BOUNDARIES_WIDTH * 0.5;
		this.YMIN = -this.WEBGL_BOUNDARIES_HEIGHT * 0.4;
		this.YMAX =  this.WEBGL_BOUNDARIES_HEIGHT * 0.4;
		this.ZMIN = -this.WEBGL_BOUNDARIES_DEPTH * 0.4;
		this.ZMAX =  this.WEBGL_BOUNDARIES_DEPTH * 0.4;
		
		this.LIGHT_VEL = 1;
		
		this.MIN_VEL = -0.01;
		this.MAX_VEL =  0.01;
		this.Z_VEL_FCTR = 2;
		
		this.PIPE_RADIUS = 1;
		this.SPHERE_RADIUS = 3;
		
		this.POINT_COUNT = 250;
		
		this.LIFE_GROWTH_RATE = 0.05;
		
		this.update = this.update.bind(this);
		this.init = this.init.bind(this);
	}
	componentDidMount(){
		this.webgl = new Webgl(windowWidth, windowHeight);
		this.mainDivRef.current.appendChild(this.webgl.dom);
		
		const onResize = ()=>{
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
			this.webgl.resize(windowWidth, windowHeight);
		};
		window.addEventListener('resize', onResize);
		window.addEventListener('orientationchange', onResize);
		
		this.init();
		this.webgl.update();
		
		requestAnimationFrame(this.update);
	}
	init(){		
		this.vecId = 0;
		
		this.points 			= [];
		this.quadrants			= new Map();
		this.pipeIds 			= new Map();
		this.killedPipes 		= [];
		this.closestPoints 	= new Map();
		
		for(let i=0; i < this.POINT_COUNT; ++i){
			this.createPoint();
		}
		
		this.genCircles();
		
		this.createPipePoints();
		
		console.log('this.points: ', this.points);
	}
	//--------------------------------------------------------------------------__
	createPoint(){		
		const vec = new THREE.Vector3( genRandomFloat(this.XMIN, this.XMAX),
									 			 genRandomFloat(this.YMIN, this.YMAX),
									 			 genRandomFloat(this.ZMIN, this.ZMAX) )
		vec.id = this.vecId;
		this.vecId += 1; // keep track of all points and ensure unique id for every point
		
		vec.vel = new THREE.Vector3( genRandomFloat(this.MIN_VEL, this.MAX_VEL),
											  genRandomFloat(this.MIN_VEL, this.MAX_VEL),
											  genRandomFloat(this.MIN_VEL, this.MAX_VEL) * this.Z_VEL_FCTR );
		this.points.push( vec );
		

		
		return vec;
	}
	//--------------------------------------------------------------------------__
	createPipePoints(){
		this.pipepnts = [];
		this.pipepnts.push( new THREE.Vector3(-0.5, 0, 0) );
		this.pipepnts.push( new THREE.Vector3( 0.5, 0, 0) );
	}
	createPipe(v0, v1){
		let pipe = new Pipe(this.pipepnts, {radius: this.PIPE_RADIUS});
		pipe.kill = false;
		pipe.life = 0.0;
		pipe.cpId = this.evalPointId(v0, v1);
		pipe.pos = new THREE.Vector3(0,0,0);
		pipe.v0 = v0;
		pipe.v1 = v1;

		if(this.pipeIds.has(pipe.cpId)){
			this.killPipe( this.pipeIds.get(pipe.cpId) );
		}
		this.pipeIds.set(pipe.cpId, pipe);
		this.webgl.add( pipe );
	}
	removePipe(killedPipeArrId){
		let pipe = this.killedPipes[killedPipeArrId];
		this.killedPipes.splice(killedPipeArrId, 1);
		this.webgl.remove(pipe);
	}
	killPipe(pipe){
		let pipeId = pipe.cpId;
		pipe.kill = true;
		
		this.pipeIds.delete(pipeId);
		this.killedPipes.push(pipe);
	}
	//--------------------------------------------------------------------------__
	evalSquaredDist(v0, v1){
		return v0.distanceToSquared(v1);
	}
	updateClosestPoints(){
		this.closestPoints.clear();
		
		let qdrnts = [...this.quadrants.values()];
		qdrnts.forEach(qdrnt=>{
			let points = qdrnt;
			for(let i=0; i < points.length; ++i){
				const v0 = points[i];
				let mindst = this.evalSquaredDist(v0, points[0]);
				let id = 0;
				let cmpCnt = points.length;//Math.floor(points.length * 0.5);
				for(let j=1; j < cmpCnt; ++j){
					if(j !== i){
						let v1 = points[j];
						let curdst = this.evalSquaredDist(v0, v1);
						if(curdst < mindst){
							mindst = curdst;
							id = j;
						}
					}
				}
//				if(mindst <= this.MAX_DIST ** 2){
					let v1 = points[id];
					let pointId = this.evalPointId(v0, v1);
					this.closestPoints.set(pointId, [v0, v1]);
//				}
			}
		});
	}
	keepPointInBoundaries(vec){
		let [minx, miny, minz, maxx, maxy, maxz] = this.evalWebGlBoundaries();
		
		if(vec.x < minx){
			vec.x = minx;
			vec.vel.x *= -1;
		}else if(vec.x > maxx){
			vec.x = maxx;
			vec.vel.x *= -1;
		}
		
		if(vec.y < miny){
			vec.y = miny;
			vec.vel.y *= -1;
		}else if(vec.y > maxy){
			vec.y = maxy;
			vec.vel.y *= -1;
		}	
		
		if(vec.z < minz){
			vec.z = minz;
			vec.vel.z *= -1;
		}else if(vec.z > maxz){
			vec.z = maxz;
			vec.vel.z *= -1;
		}
	}
	evalQuadrant(vec){
		const sgmnts = 3;
		let [wc, dc, hc]= [sgmnts, sgmnts, sgmnts];
		const [minx, miny, minz, maxx, maxy, maxz] = this.evalWebGlBoundaries();
		let [x,y,z] = [vec.x, vec.y, vec.z];
		
		let qx = Math.floor( (x - minx) / ((maxx - minx) / wc) );
		let qy = Math.floor( (y - miny) / ((maxy - miny) / hc) );
		let qz = Math.floor( (z - minz) / ((maxz - minz) / dc) );
		
/*		if(id===0){
			console.log('x: ', x, 'y: ', y, 'z: ', z);
			console.log('qx: ', qx, 'qy: ', qy, 'qz: ', qz);
			console.log('minx: ', minx, 'miny: ', miny, 'minz: ', minz, 'maxx: ', maxx, 'maxy: ', maxy, 'maxz: ', maxz);
		}*/
		
		return qx + qy * sgmnts + qz * sgmnts**2;
	}
	addPointToQuadrant(quadrant, vec){
		vec.quadrant = quadrant;
		
		if( !this.quadrants.has(quadrant) ){
			this.quadrants.set(quadrant, []);
		}
		this.quadrants.get(quadrant).push(vec);
	}
	movePoints(dt){
		if(dt > 0){
			this.quadrants.clear();
			
			this.points.forEach((vec)=>{
				vec.add(vec.vel.clone().multiplyScalar(dt));
				this.keepPointInBoundaries(vec);
				
				let quadrant = this.evalQuadrant(vec);
				this.addPointToQuadrant(quadrant, vec);
			});
			this.moveCircles();
		}
	}
	//--------------------------------------------------------------------------__
	moveCircles(){
		if(!this.sphereRot){
			this.sphereRot = 0.0;
		}
		for(let i=0; i < this.circles.length; ++i){
			let circle = this.circles[i];
			let lastPos = circle.position;
			let newPos = this.points[i];
			let offs = newPos.clone().sub(lastPos);
			circle.rotation.set(this.sphereRot, 0, 0);
			circle.position.set(newPos.x, newPos.y, newPos.z);
		}
		this.sphereRot += 0.1;
	}
	genCircles(){
		this.webgl.clearCircles();
		this.circles = [];
		this.points.forEach(p=>{
			this.circles.push( this.genCircle(p, {color: 0x004400, radius: this.SPHERE_RADIUS }) );
		});
	}
	genCircle(p0, {
							color = 0x00ff00,
							radius = 1,
							widthSegments = 3,
							heightSegments = 2
						} = {}){
//		let geometry = new THREE.CircleGeometry(radius, segments);
		let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
		
		let material = genMaterial();
		
		let circle = new THREE.Mesh( geometry, material );
		circle.position.set(p0.x, p0.y,p0.z);
		
		this.webgl.addCircle( circle );
		
		return circle;
	}
	
	//--------------------------------------------------------------------------__
	evalAngle(v0, v1){
		return Math.atan2(v1.y, v1.x) - Math.atan2(v0.y, v0.x);
	}
	evalQuaternion(v0, v1){
		let vref = new THREE.Vector3(1,0,0);
		let vtar   = v1.clone().sub(v0.clone()).normalize();
		
		let cross = vref.clone().cross(vtar).normalize();
		let angle = vref.clone().angleTo(vtar);
		
		let quat = new THREE.Quaternion().setFromAxisAngle( cross, angle );
		
		return quat;
	}
	evalRotation(v0, v1){
		let dst = v1.clone().sub(v0);
		let angle = dst.angleTo(new THREE.Vector3(1,0,0));
		if(v0.y > v1.y){
			angle = Math.PI * 2 - angle;
		}
		
		dst = dst.normalize();
		
		let vref = new THREE.Vector3(1,0,0);
		
		let dot = dst.dot(vref);

//		let angle = this.evalAngle(v1,v0);
		return new THREE.Vector3(0,0, angle);
	}
	//--------------------------------------------------------------------------__
	evalPointId(v0, v1){
		let lid = v0.id < v1.id ? v0.id : v1.id;
		let uid = v0.id > v1.id ? v0.id : v1.id;
		return '' + lid + '-' + uid;
	}
	//--------------------------------------------------------------------------__
	updateKilledPipe(pipe){
		pipe.scale.set(pipe.scl * Math.max(pipe.life, 0.01), 1, 1);
	}
	updatedKilledPipes(){
		let kps = this.killedPipes;
		
		for(let i=0; i < kps.length; ){
			let pipe = kps[i];
			
			pipe.life -= this.LIFE_GROWTH_RATE * 2;
			
			if(pipe.life <= 0.0){
				this.removePipe(i);
			}else{
				this.updateKilledPipe(pipe);
				++i;
			}
		}
	}
	//--------------------------------------------------------------------------__
	updatePipe(pipe){
		let v0 = pipe.v0.clone();
		let v1 = pipe.v1.clone();
		
		let quat = this.evalQuaternion(v0, v1);
//		let rot = this.evalRotation(v0, v1);
		let dst = v1.clone().sub(v0).length();
		let scl = dst;
		let offs = v0.clone().add(v1.clone().sub(v0).multiplyScalar(0.5));
		let pos = pipe.pos;
		let relOffs = offs.clone().sub(pos);
		
		if(!this.printed){
			this.printed = 0;
		}
		if(this.printed < 2){
			console.log('pos: ', pos);
			console.log('offs: ', offs);
			console.log('relOffs: ', relOffs);
			console.log('pipe: ', pipe);
			++this.printed;
		}
		
		pipe.rotation.setFromQuaternion( quat );
		
		let tarScl = scl * pipe.life;
		if(tarScl > 0.1){
			// only scale if tarScle is greater than threshold -> otherwiese determinant === zero!!
			pipe.scale.set( tarScl, 1, 1 );
		}
		
		pipe.position.set(offs.x, offs.y, offs.z);
		
		pipe.pos.add(relOffs);
		pipe.scl = scl;
		
		if(pipe.life < 1.0){
			pipe.life = Math.min(pipe.life + this.LIFE_GROWTH_RATE, 1.0);
		}
	}
	evalDT(){
		let curtime = new Date().getTime();
		let dt = !!this.lasttime ? curtime - this.lasttime : 0;
		this.lasttime = curtime;
		
		if(dt > 100){
			dt = 100;
		}
		return dt;
	}
	updatePipes(){
		this.updateClosestPoints();
		
		let pipes = [...this.pipeIds.values()];
		pipes.forEach(pipe=>{
			if( !this.closestPoints.has(pipe.cpId) ){
				this.killPipe(pipe);
			}
		});
		
		let it = this.closestPoints[Symbol.iterator]();
		for(let [id, [v0,v1]] of it){
			if( !this.pipeIds.has(id) ){
				this.createPipe(v0, v1);
			}
			let pipe = this.pipeIds.get(id);
			this.updatePipe(pipe);
		}
		
		this.updatedKilledPipes();
	}
	evalWebGlBoundaries(){
		let [w,h,d] = [this.WEBGL_BOUNDARIES_WIDTH, this.WEBGL_BOUNDARIES_HEIGHT, this.WEBGL_BOUNDARIES_DEPTH]
		return [-w*0.5, -h*0.5, -d*0.5, w*0.5, h*0.5, d*0.5];
	}
	getDivSize(){
		return [this.mainDivRef.current.offsetWidth, this.mainDivRef.current.offsetHeight];
	}
	//--------------------------------------------------------------------------__
	updateLight(){
		let light = this.webgl.light;
		light.position.x += this.LIGHT_VEL;
		light.position.set(light.position.x, light.position.y, light.position.z);
		console.log(light.position);
	}
	update(){
		let dt = this.evalDT();
		
		this.movePoints(dt);
//		this.updateLight(dt);
		
		this.updatePipes();

		
		this.webgl.update();
		
		requestAnimationFrame(this.update);
	}
	//--------------------------------------------------------------------------__
	render(){
		return (
			<div id="LineAnimationDiv"
					ref={this.mainDivRef}
				  className="LineAnimation">
			</div>
		);
	}
}

export default LineAnimation;