import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import MainImagePreview from '../MainImagePreview';
import loadPreviews from './MainPreviewTextLoader';
import logo from '../MrSoir_grass.png';
import './Main.css';


class MainPage extends Component{
	constructor(){
		super();

		this.onPreviewClicked = this.onPreviewClicked.bind(this);
		this.loadGIFs = this.loadGIFs.bind(this);
		this.loadImage = this.loadImage.bind(this);
		this.updatePreviewsToState = this.updatePreviewsToState.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.updateFocusedPreview = this.updateFocusedPreview.bind(this);

		this.state = {
			previews: [],
			focusedPreviews: []
		}
	}

	loadPreviews_hlpr(){
		this.updatePreviewsToState( loadPreviews() );
	}
   componentDidMount(){
   	this.loadPreviews_hlpr();

	window.scrollTo(0, 0);
	this.lastYScroll = 0;
   	window.addEventListener('scroll', this.onScroll);

   	setTimeout(this.updateFocusedPreview, 1000);
   }
   componentWillUnmount(){
   	window.removeEventListener('scroll', this.onScroll);
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
			if(onLoaded){
				onLoaded(imgPath);
			}
		});
		image.addEventListener('error', evnt=>{
//			console.log('error: could not load image: ', imgPath);
		});
		image.src = imgPath;
   }
	onPreviewClicked(id){
		let relURL = this.state.previews[id].url;
		if (!!window.hist)
		{
			window.hist.push('/' + relURL);
		}
	}
	updateFocusedPreview(){
		let scrOffs = Math.max(document.body.scrollTop, document.documentElement.scrollTop);

		let previews = document.getElementsByClassName('MainPrevDiv');

		let focusedPreviews = [];

		[...previews].forEach((prev, id)=>{
			let br = prev.getBoundingClientRect();
			let [top, btm, y, x] = [br.top, br.bottom, br.y, br.x];

			let viewPortHeight = window.innerHeight;

			if(y > 50 && btm < (viewPortHeight-50)){
				focusedPreviews.push(id);
			}
		});
		this.setState({focusedPreviews});
	}
	onScroll(e){
		this.updateFocusedPreview();
	}
	render(){
		let description = `
			The following shows some of the programs/projects that I've created
			over the past years. I published most of these projects on
			dedicated platforms. This website is created with the React.js-library
			and mainly serves me to test concepts of modern
			single page application development.
		`;

		return (
			<div id="MainDivMN">
				<div className="LogoHeader Show">
					<div id="LogoHeaderText" className="MrSoirHeading">Welcome to the World of</div>
					<div id="LogoHeaderImageDiv">
						<img id="LogoHeaderImage" src={logo} alt="logo"/>
					</div>
				</div>

				<div id="DescriptionMN"
					  className="ProgramDescription">
					{description}
				</div>
				<div className="MainPrevDivMN">
					{this.state.previews.map((pi, id)=>
						<div key={id}
							  className="PreviewsDivMN">
							<MainImagePreview
								meta={pi}
								indicator={{
									heading: pi.heading,
									description: pi.description
								}}
								focusPreview={this.state.focusedPreviews.some(x=>x===id)}
								onPreviewClicked={()=>{this.onPreviewClicked(id);}}
								separator={id < this.state.previews.length-1}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(MainPage);
