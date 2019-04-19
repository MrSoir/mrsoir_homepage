//plain-html:
//import './gl-matrix-min.js';
// react:
import * as glMatrix from 'gl-matrix';

//-----------------------------------------------------------------

function replaceString(s, args){
  for(let i=0; i < args.length; ++i){
  	console.log('replacing: ', args[i]);
    s = s.replace('$!{' + i + '}!$', args[i]);
  }
  return s;
}

var vertexShaderSource = `		
	const float EXP_SCL_FCTR = 6.0;
	
	uniform vec3 gravityCenters[$!{0}!$];
	uniform int gravityCenterCount;
	
	int getClosestGravityCenterID(){
		vec3 gv = gravityCenters[0] - polygonXYZAverage;
		float gd = gv.x*gv.x + gv.y*gv.y + gv.z*gv.z;
		int id = 0;
		for(int i=1; i < gravityCenterCount; ++i){
			vec3 gv2 = gravityCenters[i] - polygonXYZAverage;
			float gd2 = gv2.x*gv2.x + gv2.y*gv2.y + gv2.z*gv2.z;
			if(gd2 < gd){
				id = i;
				gd = gd2;
			}
		}
		return id;
	}
	
	mat4 genGravityTranslation(int gravID){
		float progOffs = 0.01;
		if(progress < progOffs || 1.0 - progress < progOffs){
			return mat4(1.0);
		}
		
		vec3 gravCentr = gravityCenters[gravID];
		
		float ellipseProg = 1.0 - abs(progress * 2.0 - 1.0);
		
		// direct translation (to gravity center):
		
		float extOffs = 0.1;
		vec3 DV = gravCentr - polygonXYZAverage;
		vec3 DVunit = DV / length(DV);
		vec3 DVext = DV + DVunit * extOffs;
		float fctrToGravCenter = length(DV) / length(DVext);
		
		float accelFctr = 1.0 + randoms.x * EXP_SCL_FCTR; 
		float prog = exp(ellipseProg * accelFctr) / exp(accelFctr);
		
		float vorz = progress >= 0.5 ? -1.0 : 1.0;
		
		mat4 DM = translateMat4(DVext * prog);
		
		
		// offset translation:
		
		vec3 refVec = vec3(0.0, 0.0, 1.0);
		vec3 orthoVec = cross(DV, refVec);
		vec3 orthoVecUni = orthoVec / length(orthoVec);
		vec3 orthoUniTarVec;
		
		float offsProgr = mod(progress * 2.0, 1.0);
		
		if(ellipseProg < fctrToGravCenter){
			float relProgrs = ellipseProg / fctrToGravCenter;
			orthoUniTarVec = orthoVecUni * relProgrs;
		}else{
			float relProgrs = (ellipseProg - fctrToGravCenter) / (1.0 - fctrToGravCenter);
			orthoUniTarVec = orthoVecUni * (1.0 - relProgrs);
		}
		
		float offsSclFctr = 0.5;
		mat4 OM = translateMat4(orthoUniTarVec * offsSclFctr * vorz);
		
		return OM * DM;
	}
	
	void main() {
		int centID = getClosestGravityCenterID();
		mat4 GM = genGravityTranslation(centID);
		
		vec4 pos4 = vec4(pos, 1.0);
		
		float sclFctr = 10.0;
		vec2 scaleRatio = imgRatio * sclFctr;
		mat4 scaleImage = scaleMat4(vec3(scaleRatio.x, scaleRatio.y, sclFctr));
		
//		if(polygonXYZAverage.x > 0.95 && polygonXYZAverage.y > 0.95){
			gl_Position = perspective * modelView * scaleImage * GM * pos4;
/*		}else{
			gl_Position = vec4(vec3(1000.0), 0.0);
		}*/

		f_texcoord = texcoord;
		f_trnsfrmPrgrs = progress;
	}
`;

//-----------------------------------------------------------------

var fragmentShaderSource = ``;

class GravityAnimation{
	constructor(glFunctions){		
		this._waveMeta = {
			gravityCentersCount: 20,
		};
		
		console.log('vertexShaderSource:');
		console.log(vertexShaderSource);
		
		this.vertexShaderSource = replaceString(vertexShaderSource, [this._waveMeta.gravityCentersCount,]);
		this.fragmentShaderSource = fragmentShaderSource;
		
		console.log('vertexShaderSource:');
		console.log(this.vertexShaderSource);
		
		this.glFunctions = glFunctions;
	}
	
	setGL(_gl){
		this.gl = _gl;
	}
	
	genGravityCenters(){
		let gravCentrs = [];
/*		gravCentrs = [-0.5, 0, 0,
							0.5, 0, 0];*/
		for(let i=0; i < Math.ceil(Math.random() * this._waveMeta.gravityCentersCount); ++i){
			let cent = [(Math.random() - 0.5) * 1.5,
							(Math.random() - 0.5) * 1.5,
							(Math.random() - 0.5) * 1.5];
			gravCentrs.push( ...cent )
		}
		return gravCentrs;
	}
	
	initBufferData(){
		let gravCenters = this.genGravityCenters();
//		console.log('gravCenters: ', gravCenters);
		this.glFunctions.setUniformVector3fv('gravityCenters', gravCenters);
		this.glFunctions.setUniform1i('gravityCenterCount', this._waveMeta.gravityCentersCount);
	}
	updateBufferData(){
	}
	
	nextAnimation(){
		let gravCenters = this.genGravityCenters();
		this.glFunctions.setUniformVector3fv('gravityCenters', gravCenters);
	}
};

export default GravityAnimation;

