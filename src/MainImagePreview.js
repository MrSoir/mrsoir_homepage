import React, { Component } from 'react';
import './MainImagePreview.css';


class MainImagePreview extends Component{
	constructor(props){
		super(props);
		
		this.onPreviewClicked = this.onPreviewClicked.bind(this);
		this.genIndicator = this.genIndicator.bind(this);
	}
	genIndicator(){
		let {heading, description} = this.props.indicator;
		
		let focusPreview = this.props.focusPreview;
		let prevImgInctrDivClass = focusPreview ? "PreviewImageIndicatorDiv FocusedLeftMIP" : "PreviewImageIndicatorDiv";
		return (
			<div className={prevImgInctrDivClass}>
				<div className="PreviewImageIndicatorHeadingDiv PreviewHeadingSizing">
					<div className="PreviewImageIndicatorHeading">
						{heading}
					</div>
				</div>
				<div className="PreviewImageIndicatorDescriptionDiv PreviewTextSizing">
					<div className="PreviewImageIndicatorDescription">
						{description}
					</div>
				</div>
			</div>
		);
	}
	onPreviewClicked(){
		if(this.props.onPreviewClicked){
			this.props.onPreviewClicked();
		}
	}
	render(){
		let indicator = "";
		let imgClass = "ImagePreviewImage";
		if(!!this.props.indicator){
			indicator = this.genIndicator();
			
			if(this.props.focusPreview){
				imgClass += " FocusedScaledMIP";
			}
		}
		
		return (
			<div className="ImagePreviewContainer">
				<div className="ImagePreviewIndicatedImage"
					  onClick={this.onPreviewClicked}>
					<img 	src={this.props.meta.image_path} 
							alt="logo"
							className={imgClass}/>
					{indicator}
				</div>
			</div>
		);
	}
}

export default MainImagePreview;