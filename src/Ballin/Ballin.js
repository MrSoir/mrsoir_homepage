import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import SlideShow from '../SlideShow';
import meta_info from './info.txt';
import './Ballin.css';
import play_btn from './play_btn.png';

class Ballin extends Component{
	constructor(props){
		super(props);
		this.onImageClick = this.onImageClick.bind(this);
		this.launchBallinGL = this.launchBallinGL.bind(this);
		
		this.state = {
			ballin_gl_pics:   [],
			ballin_orig_pics: []
		}
	}
	launchBallinGL(){
		console.log('launching BallinGL...');
		window.location.href = 'https://ballingl.firebaseapp.com/';
/*		if (window.hist){
			console.log('  -> pushing BallinGL to Router!');
			window.hist.push('/BallinGL');
		}*/
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
	onImageClick(id){
		this.launchBallinGL();
	}
	render(){
		let infoText_GL = <div className="Info">Ballin' GL is a browser game written in 
		JavaScript. Although the gameplay is in 2D, the game is rendered in 3D using the 
		WebGL 2.0 technology. The game is totally free, there are no in-app-purchases or 
		advertisements. The only reason I wrote the game was to teach myself how to program
		 3D-graphics in WebGL and to improve my skills in linear algebra.
		<br/><br/>
		Ballin' GL runs on most common browsers: Chrome, Chromium, Firefox, Opera, Safari. 
		Just ensure you're running the latest version of your browser.
		Unfortunately Ballin' GL won't run on Mircosoft's IE and Edge. But if you are 
		browsing the web with Microsoft browsers you definitely have greater problems 
		to worry about...
		<br/><br/>
		Go get the most fun out of Ballin' GL I recommend playing it on your smartphone. 
		On smartphones you can control the game with the motion sensors. 
		Thus the smartphone itself becomes the controller.</div>;
		
		let infoText_Orig = <div className="Info">I wrote the first version 
		of Ballin' in Java (Swing) in the course of a college assignment. 
		Compared to the original Ballin', Ballin'GL is much more advanced. 
		Ballin'GL is running a 3D-engine with lightning effects and other 
		fancy stuff. But sometimes the beauty lies in it's simplicity. That's
		 why you can still download the old school Ballin' with it's plain 
		 simple 2D-engine.</div>;

		return (
			<div className="Ballin">
				<div className="BallinInfo">Ballin' GL</div>

				<SlideShow img_paths={this.state.ballin_gl_pics} />
				
				{infoText_GL}
				<div className="Button"
					  onClick={this.launchBallinGL}>
					Click me to play Ballin' GL!
				</div>
				
				<div className="BallinSeparator"/>
				
				{/*--------------------*/}
				
				<div className="BallinInfo">Ballin' Original</div>

				<SlideShow img_paths={this.state.ballin_orig_pics} />
				
				{infoText_Orig}
				<div className="Button BtmMargin">
					Click me to download Ballin'!
				</div>
			</div>
		);
	}
}



export default withRouter(Ballin);

