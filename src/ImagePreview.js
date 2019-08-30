import React, { Component } from 'react';
import './ImagePreview.css';


class ImagePreview extends Component{
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
	genIndicator(){
		let {heading, description} = this.props.indicator;
		console.log('heading: ', heading);
		console.log('description: ', description);
		return (
			<div className="PreviewImageIndicatorDiv">
				<div className="PreviewImageIndicatorHeadingDiv">
					<div className="PreviewImageIndicatorHeading">
						{heading}
					</div>
				</div>
				<div className="PreviewImageIndicatorDescriptionDiv">
					<div className="PreviewImageIndicatorDescription">
						{description}
					</div>
				</div>
			</div>
		);
	}
	render(){
		let indicator = !!this.props.indicator ? this.genIndicator() : '';
		return (
			<div className="ImagePreviewContainer">
				<div className="ImagePreviewIndicatedImage">
					<img 	src={this.props.meta.image_path} 
							alt="logo"
							className="ImagePreviewImage"
							onClick={this.loadPath} />
					{indicator}
				</div>
				<div className="PreviewText PreviewTextSizing">
					<u className="PreviewHeadingSizing Cursor" 
						onClick={this.loadPath}>
						{this.props.meta.name}
					</u>
					<p className="PreviewTextHeadingSpace"/> {this.props.meta.text}
				</div>
			</div>
		);
	}
}

export default ImagePreview;