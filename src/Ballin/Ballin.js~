import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import SlideShow from '../SlideShow';
import meta_info from './info.txt';
import './Ballin.css';
import CurtainButton from '../CurtainButton';

class Ballin extends Component{
	constructor(props){
		super(props);
		
		this.onImageClick = this.onImageClick.bind(this);
		this.launchBallinGL = this.launchBallinGL.bind(this);
		this.downloadBallinOriginal = this.downloadBallinOriginal.bind(this);
		
		this.state = {
			ballin_gl_pics:   [],
			ballin_orig_pics: []
		}
	}
	launchBallinGL(){
		window.location.href = 'https://ballingl.firebaseapp.com/';
	}
	downloadBallinOriginal(){
		window.open('https://github.com/MrSoir/Ballin_2D/archive/master.zip', '_blank');
	}
	componentWillMount() {
		let txt = readTextFile(meta_info);
		
		let info_lines = txt.split('\n').filter((tn)=>!!tn);
		// first line in info_lines gives the number of images to render for Ballin'GL
		let ballinGL_imgCount   = parseInt(info_lines[0].split(' ').filter(s=>!!s).slice(-1)[0]);
		let ballinOrig_imgCount = parseInt(info_lines[1].split(' ').filter(s=>!!s).slice(-1)[0]);
		
   	let ballin_gl_pics   = [];
   	let ballin_orig_pics = [];
   	let f = (pth)=>{
   		return {
   			img_path: pth
   		};
   	};
   	for(let i=0; i < ballinGL_imgCount; ++i){
   		ballin_gl_pics.push( f(process.env.PUBLIC_URL + '/Ballin/pics/BallinGL_preview_' + i + '.png') );
   	}
   	for(let i=0; i < ballinOrig_imgCount; ++i){
   		ballin_orig_pics.push( f(process.env.PUBLIC_URL + '/Ballin/pics/BallinOrig_preview_' + i + '.png') );
   	}

   	let newstate = this.state;
   	newstate.ballin_gl_pics = ballin_gl_pics;
   	newstate.ballin_orig_pics = ballin_orig_pics;
   	this.setState(newstate);
   }
   componentDidMount(){
		window.scrollTo(0, 0);
	}
	onImageClick(id){
		this.launchBallinGL();
	}
	render(){
		let infoText_GL = <div className="ProgramDescription BallinInfoMargins">Ballin' GL is a browser game written in 
		JavaScript. Although the gameplay is 2D, the game is rendered in 3D powered by the 
		WebGL2 technology. The game is totally free, there are no in-app-purchases or 
		advertisement. The reason I wrote this game was to learn programming 3D-graphics
		using WebGL and to improve my skills in linear algebra.
		<br/><br/>
		Ballin' GL runs on most common browsers: Chrome, Chromium, Firefox, Opera, Safari. 
		Ensure you're running your browsers latest version. Older browser versions most likely
		won't support WebGL2 (unfortunately Ballin' GL does not run on Mircosoft's IE and Edge -
		as far as I know these browsers don't support WebGL2 at all).
		<br/><br/>
		Go get the most fun out of Ballin' GL I recommend playing it on your smartphone. 
		On smartphones the game is controlled by the smartphone's motion sensors &#x2192; the device as a whole becomes the controller!</div>;
		
		let infoText_Orig = <div className="ProgramDescription BallinInfoMargins">I wrote the first version 
		of Ballin' in Java in the course of a college assignment. 
		Compared to the original Ballin', Ballin'GL is much more advanced. 
		Ballin'GL is running a 3D-engine with lightning effects and other 
		fancy stuff. But sometimes the beauty lies in it's simplicity.</div>;

		return (
			<div className="Ballin">
				<div className="ProgramHeading">Ballin' GL</div>

				<SlideShow img_paths={this.state.ballin_gl_pics}/>
				
				{infoText_GL}
				<CurtainButton text="Click me to play Ballin' GL!"
									onClick={this.launchBallinGL}/>
				
				<div className="BallinSeparator"/>
				
				{/*--------------------*/}
				
				<div className="ProgramHeading">Ballin' Original</div>

				<SlideShow img_paths={this.state.ballin_orig_pics} />
				
				{infoText_Orig}
				
				<CurtainButton text="Download"
								   onClick={this.downloadBallinOriginal}/>
			</div>
		);
	}
}



export default withRouter(Ballin);

