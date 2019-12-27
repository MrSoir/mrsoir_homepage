import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import CurtainButton from '../CurtainButton';
import IndicatorBar from '../IndicatorBar';
import SpinningWheel from '../SpinningWheel';
import DiaSelector from '../DiaSelector/DiaSelector';

import FlipSelectorRSC from './FlipSelectorRSC';
import SlideBarRSC from './SlideBarRSC';
import SpinningWheelRSC from './SpinningWheelRSC';
import WaitingBarRSC from './WaitingBarRSC';
import WaveWaitingBarRSC from './WaveWaitingBarRSC';
import DataVisualizationRSC from './DataVisualizationRSC';
import CarrouselDiaShowRSC from './CarrouselDiaShowRSC';


import './ReactShowCase.css';

import Prism from 'prismjs';
import "../prism/themes/Okaidia.css";

class ReactShowCase extends Component{
	constructor(props){
		super(props);

		this.previewSelected = this.previewSelected.bind(this);
		this.getPreviewImagePaths = this.getPreviewImagePaths.bind(this);
		this.setFullScreen = this.setFullScreen.bind(this);
		this.onFullScreenChange = this.onFullScreenChange.bind(this);

		this.showcase = React.createRef();

		this.addFullScreenChangeListener();

		this.state = {
			selectedPreviewId: 0,
			previewImagePaths: this.getPreviewImagePaths(),
			fullScreen: false
		}
	}
	getPreviewImagePaths(){
		let basePath = process.env.PUBLIC_URL + '/ReactShowCase/previews/';
		return [basePath + 'Carousel.jpg',
				basePath + 'WaitingBar.jpg',
				basePath + 'WaveWaitingBar.jpg',
				basePath + 'DataVisualization.jpg',
				basePath + 'SpinningSelector.jpg',
				basePath + 'FlipSelector.jpg',
				basePath + 'SlideBar2.jpg'
				  ];
	}
   componentDidMount(){
		 window.scrollTo(0,0);
	}
	genMainComponent(){
		switch(this.state.selectedPreviewId){
			case 0:
				return this.genCarrouselDiaShow();
			case 1:
				return this.genWaitingBar();
			case 2:
				return this.genWaveWaitingBar();
			case 3:
				return this.genDataVisualization();
			case 4:
				return this.genSpinningWheel();
			case 5:
				return this.genFlipSelector();
			case 6:
				return this.genSlideBar();
			default:
				return (
					<div>
						invalid selection!
					</div>
				);
		}
	}
	genCarrouselDiaShow(){
		return (
			<CarrouselDiaShowRSC/>
		);
	}
	genFlipSelector(){
		return (
			<FlipSelectorRSC/>
		);
	}
	genSlideBar(){
		return (
			<SlideBarRSC/>
		);
	}
	genSpinningWheel(){
		return (
			<SpinningWheelRSC/>
		);
	}
	genWaitingBar(){
		return (
			<WaitingBarRSC/>
		);
	}
	genWaveWaitingBar(){
		return (
			<WaveWaitingBarRSC/>
		);
	}
	genDataVisualization(){
		return (
			<DataVisualizationRSC/>
		)
	}
	previewSelected(previewId){
		this.setState({selectedPreviewId: previewId});
	}
	addFullScreenChangeListener(){
		/* Standard syntax */
/*		document.addEventListener("fullscreenchange", this.onFullScreenChange);*/
		/* Firefox */
		document.addEventListener("mozfullscreenchange", this.onFullScreenChange);
		/* Chrome, Safari and Opera */
		document.addEventListener("webkitfullscreenchange", this.onFullScreenChange);
		/* IE / Edge */
		document.addEventListener("msfullscreenchange", this.onFullScreenChange);
	}
	onFullScreenChange(e){
		if(this.dontChangeStateOnFullScreenChangeEvent){
			this.dontChangeStateOnFullScreenChangeEvent = false;
			return;
		}
		if(this.state.fullScreen){
			this.setState({fullScreen: false});
		}
	}
	setFullScreen(){
		let oldState = this.state.fullScreen;
		var elem = this.showcase.current;//document.getElementById("myvideo");
		function openFullscreen() {
			if (elem.mozRequestFullScreen) { /* Firefox */
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) { /* IE/Edge */
				elem.msRequestFullscreen();
			} else if (elem.requestFullscreen) {
				elem.requestFullscreen();
			}
		}
		function closeFullscreen() {
			if (document.mozCancelFullScreen) { /* Firefox */
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { /* IE/Edge */
				document.msExitFullscreen();
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}

		if(oldState){
			closeFullscreen();
		}else{
			this.dontChangeStateOnFullScreenChangeEvent = true;
			openFullscreen();
		}
		this.setState({fullScreen: !oldState});
	}
	render(){
		const heading = 'React.js Components';
		const description = `
			For several React.js projects I needed some custom React/HTML-components. Some of these
			are presented below. Click on the fullscreen-button for a better user experience.
		`;
		let code = `
import React, { Component } from 'react';
import SlideBar from '../SlideBar';
import './SlideBarRSC.css';

		`;

		return (
			<div className="MainRSC">
				<div className="ProgramHeading">
					{heading}
				</div>
				<div id="DescriptionRSC"
					  className="ProgramDescription">
					{description}
				</div>
				<div id="FullScreenRSC">
					<CurtainButton text="switch to fullscreen"
								onClick={this.setFullScreen}/>
				</div>
				<div className="ReactShowCase"
					  ref={this.showcase}>
					<div className="FullScreenRSC"
							onClick={this.setFullScreen}>
						&#9974;
					</div>
					<div className="DiaSelectorRSC">
						<DiaSelector mainContent={this.genMainComponent()}
										 selectedId={this.state.selectedPreviewId}
										 previewImagePaths={this.state.previewImagePaths}
										 previewSelected={this.previewSelected}/>
					</div>
				</div>
				{/*
				<div id="CodeDivRSC">
					<div id="CodeHeadingRSC">
						Code
					</div>
					<div id="CodeFilesRSC">
						<button className="CodeFileRSC">
							JavaScript
						</button>
						<button className="CodeFileRSC">
							CSS
						</button>
					</div>
					<div id="CodeRSC">
						<pre><code class="language-js">{code}</code></pre>
					</div>
				</div>
				*/}
			</div>
		);
	}
}

export default withRouter(ReactShowCase);
