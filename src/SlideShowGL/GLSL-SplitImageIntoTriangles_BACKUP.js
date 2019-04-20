const glMatrix = require('gl-matrix');

let PI = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461;
let TAU = 2 * 1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461;

let vertexCountPerAxis = 10;

function mod(x,y){
	return x - y * Math.floor(x/y);
}

function getPos(vertexID, polygonID){
	let n = vertexCountPerAxis;
	let rowID = Math.floor(polygonID / (n*2));
	let colID = Math.floor(mod(polygonID - mod(polygonID, 2), n*2)) / 2;

	console.log('rowID: ', rowID);
	console.log('colID: ', colID);

	let nh = n / 2.0;
	let rowIDf = rowID;
	let colIDf = colID;
	let offs = 2.0 / n;

	// console.log('nh: ', nh);
	// console.log('offs: ', offs);

	let modPolyID2f = mod(polygonID, 2.0);
	let modPolyID2i = modPolyID2f;

	console.log('modPolyID2f: ', modPolyID2f);

	let v0 = [0.0, 0.0, 0.0];
	v0[0] = -1.0 + colIDf * offs;
	v0[1] = -1.0 + rowIDf * offs;
	v0[2] = 0.0;

	let v1 = [0.0, 0.0, 0.0];
	v1[0] = v0[0] + (modPolyID2i == 0 ? 0.0 : offs);
	v1[1] = v0[1] + offs;
	v1[2] = 0.0;

	let v2 = [0.0, 0.0, 0.0];
	v2[0] = v0[0] + offs;
	v2[1] = v0[1] + (modPolyID2i == 0 ? offs : 0.0);
	v2[2] = 0.0;

	let pos;

	if(vertexID == 0){
		pos = v0;
	}else if (vertexID == 1){
		pos = v1;
	}else{ // vertexID == 2
		pos = v2;
	}
	return pos;
}

for(let polygonID=0; polygonID < vertexCountPerAxis*vertexCountPerAxis * 2; polygonID++){
	for(let vertexID=0; vertexID < 3; ++vertexID){
		let x = getPos(vertexID, polygonID);
		console.log('vertexID: ', vertexID, '   polygonID: ', polygonID, '  =>   ', x);
	}
	console.log();
	// break;
}

