import React, {Component, useState, useEffect, useLayoutEffect} from 'react';
import './WaveWaitingBar.css';

const [cw, ch] = [500, 500];
const [cw2, ch2] = [
  cw * 0.5,
  ch * 0.5
];

function rgbToHex(r, g, b) {
  r = Math.min(Math.trunc(r));
  g = Math.min(Math.trunc(g));
  b = Math.min(Math.trunc(b));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

class Bounce {
  constructor(r=0.0, g=0.0, b=1.0) {
    const MIN_LIFETIME = 1000;
    const MAX_LIFETIME = 3000;
    this.id = Bounce.CNT++;
    this.maxHeight = (0.2 + Math.random() * 0.8);
    this.lifetime = MIN_LIFETIME + Math.random() * (MAX_LIFETIME - MIN_LIFETIME);
    this.width = 3 + ((this.lifetime - MIN_LIFETIME) / (MAX_LIFETIME - MIN_LIFETIME)) * 7;
    this.x = Math.random();//cw * 0.2 + 10 + Math.random() * (cw * 0.6 - 20);

    this.lived = 0;
    this.progress = 0;
    this.height = 0;

		this.rndm0 = Math.random();
		this.rndm1 = Math.random();
		this.rndm2 = Math.random();

		this.r = r;
		this.g = g;
		this.b = b;
    this.genColor(r, g, b);
  }
  genColorVal() {
    const mincolval = 80;
    return Math.min(Math.trunc( mincolval + Math.random() * (255 - mincolval) ), 255);
  }
  genColor() {
    let rndm = Math.random();

		let rv = Math.min(Math.trunc(this.r * this.genColorVal()), 255);
		let gv = Math.min(Math.trunc(this.g * this.genColorVal()), 255);
		let bv = Math.min(Math.trunc(this.b * this.genColorVal()), 255);
		this.color = [rv, gv, bv];

    this.colorHex = rgbToHex(...this.color);
  }
  update(dt) {
    this.lived += dt;
    this.progress = Math.min(this.lived / this.lifetime, 1);
    if (this.progress === 1) {
      this.dead = true;
    }
    this.height = Math.sin(this.progress * Math.PI) * this.maxHeight;
  }
}
Bounce.CNT = 0

function WaveWaitingBar(props) {
  const canvas = React.createRef();

	let r = (props.r != null ? props.r : 0.0);
	let g = (props.g != null ? props.g : 1.0);
	let b = (props.b != null ? props.b : 0.0);

	let labelColor = rgbToHex(r*255,g*255,b*255);
	let labelStyle = {color: labelColor};

	const [lastRenderTime, setLastRenderTime] = useState(new Date().getTime());
	const [bounces, setBounces] = useState([]);
	const [updateCanvasState, setUpdateCanvasState] = useState(false);

  let elementCount = !!props.elementCount ? props.elementCount : (window.mobilecheck() ? 50 : 200);

	useEffect(()=>{
		initializeBounces(r,g,b);
	}, []);

	function initializeBounces(){
		const bounces = [];
		for (let i = 0; i < elementCount; ++i) {
			bounces.push( new Bounce(r,g,b) );
		}
		setBounces( bounces );
	}

	// update the bounces:
  useEffect(() => {
    let [dt, curTime] = evaldt();
		updateBounces(dt);
		setUpdateCanvasState( !updateCanvasState ); // simply toggle state...
		if( !props.stop ){
			requestAnimationFrame(()=>{updateTime(curTime)});
		}
  }, [lastRenderTime, bounces]);

	// render the canvas:
	useEffect(()=>{
		renderCanvas();
	}, [updateCanvasState]);

	function updateTime(curTime){
		setLastRenderTime(curTime);
	}
  function evaldt() {
    const curTime = new Date().getTime();
    let dt = lastRenderTime
      ? curTime - lastRenderTime
      : 0;
    return [dt, curTime];
  }
	function updateBounces(dt){
		bounces.forEach(b => {
			b.update(dt);
			if (b.dead) {
				killBounce(b);
			}
		});
	}
  function renderCanvas(){
    const curCanvas = canvas.current;
    let ctx = curCanvas.getContext('2d');
		ctx.clearRect(0, 0, curCanvas.width, curCanvas.height);
		bounces.forEach(b=>renderBounce(b));
  };
  function killBounce(bounce) {
    let id = bounces.indexOf(bounce);
    for (let i = 0; i < bounces.length; ++i) {
      if (bounces[i].id === bounce.id) {
        bounces.splice(i, 1);
        let cntr = 0;
        while(bounces.length < elementCount && cntr++ < 3){
          addBounce();
        }
        break;
      }
    }
  }
	function addBounce(){
		bounces.push( new Bounce(r,g,b) );
    setBounces(bounces);
	}

  function renderBounce(bounce) {
    let ctx = canvas.current.getContext('2d');

    const color = bounce.color;
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;//bounce.colorHex;

    let baseWidth = bounce.width;
    let bw2 = baseWidth * 0.5;
    let bw4 = baseWidth * 0.25;
    let bw16 = bw4 * 0.5 * 0.5;

    let bl = ch * 0.5; // baseLine
    let hght = bounce.height * ch * 0.5;

		let prctg = bounce.x + (-0.1 + 0.2 * bounce.rndm0) * bounce.progress;
		let radprctg = 0.15;
		let cwh2m = Math.min(cw2, ch2);
		let rad = radprctg * cwh2m;
		let rndmradstrt = rad * (0.95 + 0.1 * bounce.rndm1);
		let angl = prctg * Math.PI * 2;
		let radrng = Math.PI * 2 / 100;
		let rr2 = radrng * 0.5;
		let radhght = bounce.height * (1 - radprctg) * cwh2m;

    let x0i = cwh2m + Math.cos(angl - rr2) * rndmradstrt;
    let x1i = cwh2m + Math.cos(angl + rr2) * rndmradstrt;
    let y0i = cwh2m + Math.sin(angl - rr2) * rndmradstrt;
    let y1i = cwh2m + Math.sin(angl + rr2) * rndmradstrt;

    let x0o = cwh2m + Math.cos(angl - rr2) * (rad + radhght);
    let y0o = cwh2m + Math.sin(angl - rr2) * (rad + radhght);
    let x1o = cwh2m + Math.cos(angl + rr2) * (rad + radhght);
    let y1o = cwh2m + Math.sin(angl + rr2) * (rad + radhght);

    const rrh = 0.8; //Math.random() * 0.2 + 0.8;
    const lrh = 0.8; //Math.random() * 0.2 + 0.8;
		ctx.beginPath();
		ctx.moveTo(x0i, y0i);
    ctx.lineTo(x0o, y0o);

    if(props.roundedEdges){
      let edgeDist = Math.sqrt((x0o - x1o) * (x0o - x1o) + (y0o - y1o) * (y0o - y1o));
      let ed2 = edgeDist * 0.5;
      let xedgo = cwh2m + Math.cos(angl) * (rad + radhght + ed2);
      let yedgo = cwh2m + Math.sin(angl) * (rad + radhght + ed2);
      ctx.quadraticCurveTo(xedgo, yedgo, x1o, y1o);
    }else{
      ctx.lineTo(x1o, y1o);
    }
    ctx.lineTo(x1i, y1i);
    ctx.closePath();
		// ctx.lineTo(cwh2m + Math.cos(angl - rr2) * (rad + radhght), cwh2m + Math.sin(angl - rr2) * (rad + radhght));
		// ctx.quadraticCurveTo(cwh2m + Math.cos(angl) * (rad + radhght + ed2), cwh2m + Math.sin(angl) * (rad + radhght + ed2), cwh2m + Math.cos(angl + rr2) * (rad + radhght), cwh2m + Math.sin(angl + rr2) * (rad + radhght));
		// ctx.lineTo(cwh2m + Math.cos(angl + rr2) * rndmradstrt, cwh2m + Math.sin(angl + rr2) * rndmradstrt);
		ctx.closePath();
		ctx.fill();
  };

  return (
		<div className="MainDivWWB">
			<canvas className="CanvasWWB" ref={canvas} width={cw} height={ch}/>
			<div className="LabelWWB"
					 style={labelStyle}>
				loading...
			</div>
		</div>
	);
}

export default WaveWaitingBar;
