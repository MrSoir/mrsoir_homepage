import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import CurtainButton from '../CurtainButton';

import FlipSelectorRSC from './FlipSelectorRSC';
import SlideBarRSC from './SlideBarRSC';
import SpinningWheelRSC from './SpinningWheelRSC';
import WaitingBarRSC from './WaitingBarRSC';
import DataVisualizationRSC from './DataVisualizationRSC';

import IndicatorBar from '../IndicatorBar';
import SpinningWheel from '../SpinningWheel';
import DiaSelector from '../DiaSelector/DiaSelector';
import './ReactShowCase.css';

class ReactShowCase extends Component{
	constructor(props){
		super(props);
		
		this.previewSelected = this.previewSelected.bind(this);
		this.getPreviewImagePaths = this.getPreviewImagePaths.bind(this);
		this.setFullScreen = this.setFullScreen.bind(this);
		
		this.showcase = React.createRef();
		
		this.state = {
			selectedPreviewId: 0,
			previewImagePaths: this.getPreviewImagePaths(),
			fullScreen: false
		}
	}
	getPreviewImagePaths(){
		let basePath = process.env.PUBLIC_URL + '/ReactShowCase/previews/';
		return [basePath + 'WaitingBar.png',
				  basePath + 'DataVisualization.png',
				  basePath + 'SpinningSelector.png',
				  basePath + 'FlipSelector.png',
				  basePath + 'SlideBar2.png'
				  ];
	}
   componentDidMount(){
   	
	}
	genMainComponent(){
		switch(this.state.selectedPreviewId){
			case 0:
				return this.genWaitingBar();
			case 1:
				return this.genDataVisualization();
			case 2:
				return this.genSpinningWheel();
			case 3:
				return this.genFlipSelector();
			case 4:
				return this.genSlideBar();
			case 5:
				return this.genCurtainButtonDiv();
			default:
				return (
					<div>
						invalid selection!
					</div>
				);
		}
	}
	genFlipSelector(){
		return (
			<FlipSelectorRSC/>
		);
	}
	genCurtainButtonDiv(){
		return (
			<div className="CurtainButtonRSC">
				<CurtainButton text="test button"/>
			</div>
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
	genDataVisualization(){
		return (
			<DataVisualizationRSC/>
		)
	}
	previewSelected(previewId){
		this.setState({selectedPreviewId: previewId});
	}
	setFullScreen(){
		let oldState = this.state.fullScreen;
		var elem = this.showcase.current;//document.getElementById("myvideo");
		function openFullscreen() {
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.mozRequestFullScreen) { /* Firefox */
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) { /* IE/Edge */
				elem.msRequestFullscreen();
			}
		}
		function closeFullscreen() {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) { /* Firefox */
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { /* IE/Edge */
				document.msExitFullscreen();
			}
		}
		console.log('oldState: ', oldState);
		if(oldState){
			closeFullscreen();
		}else{
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
					<CurtainButton text="change to fullscreen"
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
			</div>
		);
	}
}

export default withRouter(ReactShowCase);
