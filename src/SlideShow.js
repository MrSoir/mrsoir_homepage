import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './SlideShow.css';
import next_btn from './next_btn.png';
import next_btn_hover from './next_btn_hover.png';
import next_btn_click from './next_btn_click.png';

class SlideShow extends Component{
	constructor(props){
		super(props);
		
		this.imgRef0 = React.createRef();
		this.imgRef1 = React.createRef();
		this.prevBtn = React.createRef();
		this.nextBtn = React.createRef();
		this.curFadingImgId = 0;
		
		this.setCurrentImagePath = this.setCurrentImagePath.bind(this);
		this.onImageClick = this.onImageClick.bind(this);
		this.onPrevClicked = this.onPrevClicked.bind(this);
		this.onNextClicked = this.onNextClicked.bind(this);
		this.nextImage = this.nextImage.bind(this);
		this.prevImage = this.prevImage.bind(this);
		this.onPrevHover = this.onPrevHover.bind(this);
		this.onNextHover = this.onNextHover.bind(this);
		this.onPrevLeave = this.onPrevLeave.bind(this);
		this.onNextLeave = this.onNextLeave.bind(this);
		this.startImageTimer = this.startImageTimer.bind(this);
		this.stopImageTimer = this.stopImageTimer.bind(this);
		this.curId = 0;
		this.lastId = 0;
		this.setCurrentImagePath();
	}
	componentDidMount(){
		this.startImageTimer();
	}
	componentWillUnmount(){
		this.stopImageTimer();
	}
	startImageTimer(){
		this.stopImageTimer();
		this.imageTimer = setInterval(this.nextImage, 5000);
	}
	stopImageTimer(){
		if( !!this.imageTimer ){
			clearInterval(this.imageTimer);
		}
	}
	setCurrentImagePath(){
		this.lastImgPath = this.props.img_paths[this.lastId];
		this.curImgPath = this.props.img_paths[this.curId];
	}
	updateImage(){
		this.startImageTimer();
		
		const imgRef0 = this.imgRef0.current;
		const imgRef1 = this.imgRef1.current;
		
		this.curFadingImgId = this.curFadingImgId === 0 ? 1 : 0;
		
		let newFocusedImg = this.curFadingImgId === 0 ? imgRef0 : imgRef1;
		if( !!newFocusedImg ){
			newFocusedImg.src = this.curImgPath.img_path;
		}
		
		imgRef0.style.opacity = this.curFadingImgId === 0 ? 1 : 0;
		imgRef1.style.opacity = this.curFadingImgId === 1 ? 1 : 0;
	}
	prevImage(){
		this.lastId = this.curId;
		this.curId -= 1;
		if (this.curId < 0){
			this.curId = this.props.img_paths.length - 1;
		}
		this.setCurrentImagePath();
		this.updateImage();
	}
	nextImage(){
		this.lastId = this.curId;
		this.curId += 1;
		if (this.curId >= this.props.img_paths.length){
			this.curId = 0;
		}
		this.setCurrentImagePath();
		this.updateImage();
	}
	
	onImageClick(){
		this.nextImage();
	}
	onPrevClicked(){
		this.prevImage();
	}
	onNextClicked(){
		this.nextImage();
	}
	onPrevHover(){
		const prevBtn = this.prevBtn.current;
		prevBtn.src = next_btn_hover;
	}
	onNextHover(){
		const nextBtn = this.nextBtn.current;
		nextBtn.src = next_btn_hover;
	}
	onPrevLeave(){
		const prevBtn = this.prevBtn.current;
		prevBtn.src = next_btn;
	}
	onNextLeave(){
		const nextBtn = this.nextBtn.current;
		nextBtn.src = next_btn;
	}
	render(){
		return(
			<div className="SlideShow">
				<img className="NextButton Prev Image" 
					src={next_btn} 
					ref={this.prevBtn}
					onClick={this.onPrevClicked}
					onMouseEnter={this.onPrevHover}
					onMouseLeave={this.onPrevLeave}/>
				
				<div className="SlideMainImages">
					<img className="SlideImage Image Img0" 
						src={this.curImgPath.img_path} 
						ref={this.imgRef0}
						onClick={this.onImageClick}
						alt="logo"/>
					<img className="SlideImage Image Img1" 
						src={this.props.img_paths[1].img_path} 
						ref={this.imgRef1}
						onClick={this.onImageClick}
						alt="logo"/>
				</div>
				
				<img className="NextButton Image"
					src={next_btn} 
					ref={this.nextBtn}
					onClick={this.onNextClicked}
					onMouseEnter={this.onNextHover}
					onMouseLeave={this.onNextLeave}/>
			</div>
		);
	}
}

export default withRouter(SlideShow);