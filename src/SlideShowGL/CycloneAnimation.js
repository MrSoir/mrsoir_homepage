//plain-html:
//import './gl-matrix-min.js';
// react:
import * as glMatrix from 'gl-matrix';

//-----------------------------------------------------------------

var vertexShaderSource = `		
	uniform int transformID;
	
	vec4 getCycRoration(vec3 cycloneCenter, float cycloneRad){	
		vec3 centPos = polygonXYZAverage - cycloneCenter;
		vec3 ceneredPos = pos - cycloneCenter;
		
		float centdx = cycloneCenter.x - polygonXYZAverage.x;
		float centdy = cycloneCenter.y - polygonXYZAverage.y;
		float centdz = cycloneCenter.z - polygonXYZAverage.z;
		
		float distToCyclCent = centPos.x * centPos.x
									+ centPos.y * centPos.y
									+ centPos.z * centPos.z;
		
		
		float sinProg = sin(progress * PI);
			
		float cycles = 1.0;
		float radAngle = progress * PI * 2.0 * cycles;
		mat4 rotMat = rotateZ(radAngle);
		
/*		float sclFctr = 2.0;
		float sclVal = 1.0 + sinProg * sclFctr;
		mat4 sclMat = scaleMat4( vec3(sclVal,sclVal,sclVal) );*/
		
		vec4 p = vec4(ceneredPos, 1.0);
//		p = sclMat * p;
		p = rotMat * p;
		
		
		float zscale = 4.5;
		float centOffs = (centdx*centdx + centdy*centdy) / (cycloneRad*cycloneRad);
		float zOffs = sinProg * centOffs * zscale;
		
		float rndmFctr = 0.5;
		float rndmx = (randoms.x - 0.5) * rndmFctr * sinProg;
		float rndmy = (randoms.y - 0.5) * rndmFctr * sinProg;
		
		p.x += rndmx;
		p.y += rndmy;
		p.z = -zOffs;
		p.xyz += cycloneCenter;
		return p;
	}
	
	void main_derived() {		
		vec3 cycloneCenter = vec3(0.0, 0.0, 0.0);
		float cycloneRad = sqrt(2.0);
		vec4 cyclPos = getCycRoration(cycloneCenter, cycloneRad);
		
		vec4 pos4 = cyclPos;
		
		float sclFctr = 10.0;
		vec2 scaleRatio = imgRatio * sclFctr;
		mat4 scaleImage = scaleMat4(vec3(scaleRatio.x, scaleRatio.y, sclFctr));
		
		gl_Position = perspective * modelView * scaleImage * pos4;//vec4(pos, 1.0);

		f_texcoord = texcoord;
		f_trnsfrmPrgrs = progress;
	}
`;

//-----------------------------------------------------------------

var fragmentShaderSource = ``;

class CycloneAnimation{
	
	constructor(glFunctions){
		this.vertexShaderSource = vertexShaderSource;
		this.fragmentShaderSource = fragmentShaderSource;
		
		this._waveMeta = {
			transformID: 2,
			animationCount: 9,
		};
		
		this.glFunctions = glFunctions;
	}
	
	setGL(_gl){
		this.gl = _gl;
	}
	
	initBufferData(){
		this.glFunctions.setUniform1i('transformID', this._waveMeta.transformID);
	}
	updateBufferData(){
		this.glFunctions.setUniform1i('transformID', this._waveMeta.transformID);
	}
	
/*	setTransformID(id){
		this._waveMeta.transformID = id;
	}*/
	nextAnimation(){
		this._waveMeta.transformID = (this._waveMeta.transformID + 1) % this._waveMeta.animationCount;
	}
};

export default CycloneAnimation;

