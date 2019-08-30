import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import MainImagePreview from '../MainImagePreview';
import meta_info from './info.txt';
import './Main.css';

class MainPage extends Component{
	constructor(){
		super();
		this.onPreviewClicked = this.onPreviewClicked.bind(this);
		this.loadGIFs = this.loadGIFs.bind(this);
		this.loadImage = this.loadImage.bind(this);
		this.updatePreviewsToState = this.updatePreviewsToState.bind(this);
		
		this.state = {
			previews: []
		}
	}
	getIndicators(programs){
		let f = (progrm)=>{
			let text_path = process.env.PUBLIC_URL + '/MainPage/indicators/' + progrm + '.txt';
			let txt = readTextFile(text_path);
			let lines = txt.split('\n').filter((tn)=>!!tn);
			return {
				heading: lines[0],
				description: lines.slice(1).join('')
			};
		};
		let indicators = programs.map(p=>f(p));
		return indicators;
	}
	componentWillMount() {
		let txt = readTextFile(meta_info);
		console.log(txt);
		let programs = txt.split('\n').filter((tn)=>!!tn).map((tn)=>{
			let splt = tn.split('_|_').map(v=>v.trim());
			let name = splt[0];
			let url = splt.length > 1 ? splt[1] : name.replace(' ', '');
			return {
				name,
				url
			};
		});
		
		console.log(programs);
   	let f = (pi) => {
   		let text_path = process.env.PUBLIC_URL + '/MainPage/texts/' + pi.name + '.txt';
   		let prev_text = readTextFile(text_path);
   		return {name: pi.name,
   				  url: pi.url,
   				  image_path: process.env.PUBLIC_URL + '/MainPage/pics/' + pi.name + '.png',
   				  text: prev_text };
   	};
   	let prev_programs = programs.map( p => f(p) );
   	console.log(prev_programs);
   	
   	let indicators = this.getIndicators(programs.map(p=>p.name));
   	prev_programs.forEach((p, id)=>{
   		p['heading'] = indicators[id].heading;
   		p['description'] = indicators[id].description;
   	});
   	
   	this.updatePreviewsToState(prev_programs);
   	
   	this.loadGIFs();
   }
   componentDidMount(){
   	window.scrollTo(0, 0);
   }
   updatePreviewsToState(previews){
  		let newstate = this.state;
   	newstate.previews = previews;
   	
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
	onPreviewClicked(id){
		console.log('onPreviewClicked: id: ', id, '	previews: ', this.state.previews);
		let relURL = this.state.previews[id].url;
		console.log('onPreviewClicked: ', relURL);
		if (!!window.hist)
		{
			console.log('pushing: ', '/' + relURL);
			window.hist.push('/' + relURL);
		}
	}
	render(){
		return (
		<div className="PreviewsDiv">
			{this.state.previews.map((pi, id)=>
				<div key={id}>
					<MainImagePreview
								meta={pi}
								indicator={{
									heading: pi.heading,
									description: pi.description
								}}
								onPreviewClicked={()=>{this.onPreviewClicked(id);}}
								separator={id < this.state.previews.length-1}
					/>
					{id < this.state.previews.length-1 
						? <div className="MainSeparator"></div>
						: ''}
				</div>
			)}
		</div>
		);
	}
}

export default withRouter(MainPage);

