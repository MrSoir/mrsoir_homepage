import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';
import './Main.css';

class MainPage extends Component{
	constructor(){
		super();
		this.onImageClick = this.onImageClick.bind(this);
		this.loadGIFs = this.loadGIFs.bind(this);
//		this.loadImage = this.loadImage.bind(this);
		this.updatePreviewsToState = this.updatePreviewsToState.bind(this);
		
		this.state = {
			previews: []
		}
	}
	componentWillMount() {
		let txt = readTextFile(meta_info);
		console.log(txt);
		let programs = txt.split('\n').filter((tn)=>!!tn);
		console.log(programs);
   	let f = (pi) => {
   		let text_path = process.env.PUBLIC_URL + '/MainPage/texts/' + pi + '.txt';
   		console.log(text_path);
   		let prev_text = readTextFile(text_path);
   		return {name: pi,
   				  image_path: process.env.PUBLIC_URL + '/MainPage/pics/' + pi + '.png',
   				  text: prev_text };
   	};
   	let prev_programs = programs.map( p => f(p) );
   	console.log(prev_programs);
   	
   	this.updatePreviewsToState(prev_programs);
/*   	let newstate = this.state;
   	newstate.preview = prev_programs;
   	this.setState(newstate);*/
   	
   	this.loadGIFs();
   }
   updatePreviewsToState(previews){
  		let newstate = this.state;
   	newstate.previews = previews;
   	
   	console.log('updating state: ', newstate);
   	this.setState(newstate);
   }
   loadGIFs(){
   	let getBaseFilePath = (filePath)=>{
			let dotID = filePath.lastIndexOf('.');
			return filePath.slice(0, dotID);
		};
		
   	let prev_programs = this.state.previews;
   	
   	prev_programs.map((p)=>{
   		let basePath = getBaseFilePath(p.image_path);
   		let gifImgPath = basePath + '.gif';
   		this.loadImage(gifImgPath, ()=>{
   			p.image_path = gifImgPath;
   			this.updatePreviewsToState(prev_programs);
   		});
   	});
   }
   loadImage(imgPath, onLoaded){
   	let image = new Image();
		image.addEventListener('load', evnt=>{
			console.log('success: loaded image: ', imgPath);
			if(onLoaded){
				onLoaded(imgPath);
			}
		});
		image.addEventListener('onerror', evnt=>{
			console.log('error: could not load image: ', imgPath);
		});
		image.src = imgPath;
   }
	onImageClick(id){
		
	}
	render(){
		return (
		<div className="PreviewsDiv">
			{this.state.previews.map((pi, id)=>
				<Preview key={id} 
							meta={pi}
							separator={id < this.state.previews.length-1}
				/>
			)}
		</div>
		);
	}
}

class Preview extends Component{
	constructor(){
		super();
		
		this.loadPath = this.loadPath.bind(this);
	}
	loadPath(){
		let name = this.props.meta.name;
		console.log(name);
		if (!!window.hist)
		{
			console.log('pushing: ', '/' + name);
			window.hist.push('/' + name.replace(' ', ''));
		}
	}
	
	render(){
		let sep = this.props.separator ? <div className="MainSeparator"></div> : '';
		return (
			<div className="">
				<div className="MainPreviewContainer">
					<img 	src={this.props.meta.image_path} 
							alt="logo"
							className="MainPreviewImage"
							onClick={this.loadPath} />
					<div className="PreviewText PreviewTextSizing">
						<u className="PreviewHeadingSizing Cursor" 
							onClick={this.loadPath}>
							{this.props.meta.name}
						</u>
						<p className="PreviewTextHeadingSpace"/> {this.props.meta.text}
					</div>
				</div>
				{sep}
			</div>
		);
	}
}

export default withRouter(MainPage);

