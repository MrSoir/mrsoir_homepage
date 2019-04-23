//plain-html:
//import './gl-matrix-min.js';
// react:
import * as glMatrix from 'gl-matrix';
import StaticFunctions from './StaticFunctions.js';

//-----------------------------------------------------------------

var vertexShaderSource = `		
	uniform vec3 tileCenters[$!{TileCentersCount}!$];
	uniform float doRotation;
	uniform int rotationCount;
	
	float interpolX(float x){
		return (x + 1.0) * 0.5;
	}
	
	float getSqrdDist(vec3 v0, vec3 v1){
		float dx = v0.x - v1.x;
		float dy = v0.y - v1.y;
		float dz = v0.z - v1.z;
		return dx * dx + dy * dy + dz * dz;
	}
	
	vec2 getTileCenter(){
		float closestTileID = 0.0;
		float tileDist = getSqrdDist(polygonXYZAverage, tileCenters[0]);
		for(int i=1; i < $!{TileCentersCount}!$; ++i){
			float curDist = getSqrdDist(polygonXYZAverage, tileCenters[i]);
			if(curDist < tileDist){
				tileDist = curDist;
				closestTileID = float(i);
			}
		}
		tileDist += randoms.x;
		return vec2(closestTileID, tileDist);
	}
	
	mat4 genScaleMat(){
		float adjProg = progress > 0.99 ? 1.0 : progress;
		float sclFctr =  1.0 - sin(adjProg * PI) * 1.0;

		mat4 sclM = scaleMat4( vec3(sclFctr, sclFctr, 1.0) );
		return sclM;
	}

	vec4 evalPos(){
		vec2 tileCentDist = getTileCenter();
		float dist = tileCentDist[1];
		vec3 tileCent = tileCenters[ int(tileCentDist[0]) ];
		
		mat4 sclM = genScaleMat();
		mat4 trnslFromTileCent = translateMat4( -tileCent );
		mat4 trnslToTileCent   = translateMat4(  tileCent );
		vec4 pos4 = vec4(pos, 1.0);
		
		mat4 rotMat = mat4(1.0);
		if(doRotation > 0.5){
			rotMat = rotateZ( progress * TAU * float(rotationCount) );
		}
		
		return trnslToTileCent * sclM * rotMat * trnslFromTileCent * pos4;
	}
	
	void main() {		
		vec4 pos4 = evalPos();
		
		float sclFctr = 10.0;
		vec2 scaleRatio = imgRatio * sclFctr;
		mat4 scaleImage = scaleMat4(vec3(scaleRatio.x, scaleRatio.y, sclFctr));
		
		gl_Position = perspective * modelView * scaleImage * pos4;

		f_texcoord = texcoord;
		f_trnsfrmPrgrs = progress;
	}
`;

//-----------------------------------------------------------------

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
		if(f_trnsfrmPrgrs >= 0.5){
			txt = txt1;
		}else{
			txt = txt0;
		}

		outColor = txt;
	}
`;

class TileAnimation{
	
	constructor(glFunctions){
		this._animMeta = {
			tileCentersPerRow: 8
		};
		this.genTileCenters();
		
		this.vertexShaderSource = StaticFunctions.replaceString(vertexShaderSource, 
																				  [Math.pow(this._animMeta.tileCentersPerRow, 2),],
																				  ['TileCentersCount',]);
		this.fragmentShaderSource = fragmentShaderSource;
		
		this.glFunctions = glFunctions;
	}
	
	genTileCenters(){
		this.tileCenters = [];
		
		let strt = -1;
		let offs = 2 / this._animMeta.tileCentersPerRow;
		
		for(let r=0; r < this._animMeta.tileCentersPerRow; ++r){
			for(let c=0; c < this._animMeta.tileCentersPerRow; ++c){
				
			this.tileCenters.push( [ strt + (c + 0.5) * offs,
									  		 strt + (r + 0.5) * offs,
									  		 0 ]
								 		);
			}
		}
	}
	
	setGL(_gl){
		this.gl = _gl;
	}
	
	setRotationUniforms(){
		let doRotation = Math.random();
		this.glFunctions.setUniform1f('doRotation', Math.random());
		
		let maxRotations = 3;
		let rotationCount = Math.floor(-maxRotations + Math.random() * maxRotations * 2);
		if(rotationCount === 0){
			rotationCount = -1;
		}
		this.glFunctions.setUniform1i('rotationCount', rotationCount);
	}
	
	initBufferData(){
		let tileCentersPerRow = this._animMeta.tileCentersPerRow;
		for(let i=0; i < tileCentersPerRow * tileCentersPerRow; ++i){
			this.glFunctions.setUniformVector3fv('tileCenters[' + i + ']', this.tileCenters[i]);
		}
		this.setRotationUniforms();
	}
	updateBufferData(){
	}
	nextAnimation(){
		this.setRotationUniforms();
//		this._animMeta.transformID = (this._animMeta.transformID + 1) % this._animMeta.animationCount;
	}
};

export default TileAnimation;

