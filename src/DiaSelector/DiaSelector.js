import React, { Component } from 'react';
import './DiaSelector.css';


class DiaSelector extends Component{
	constructor(props){
		super(props);

		this.previewBarDSRef 	  		= React.createRef();
		this.previewBarShowBtnLblRef  = React.createRef();
		this.mainWindowRef 		  		= React.createRef();

		this.onOverPreviewBarShowBtn = this.onOverPreviewBarShowBtn.bind(this);
		this.onClickedPreviewBarShowBtn = this.onClickedPreviewBarShowBtn.bind(this);
		this.closePrevBar = this.closePrevBar.bind(this);
		this.onPreviewClicked = this.onPreviewClicked.bind(this);
		this.activatePrevBar = this.activatePrevBar.bind(this);

		this.executingPrevBarAnimation = false;

		this.prevBarActive = false;

		this.state = {
			showPreviewBar: true,
			imgPaths: this.props.previewImagePaths
		};
	}
	activatePrevBar(){
		this.prevBarActive = true;
	}
	closePrevBar(){
		this.executingPrevBarAnimation = true;
		this.activatePrevBar();

		let showPreviewBar = !this.state.showPreviewBar;

		let previewBarDSRef = this.previewBarDSRef.current;
		let previewBarShowBtnLblRef = this.previewBarShowBtnLblRef.current;

		if(showPreviewBar){
			previewBarDSRef.style.width = '25%';
			previewBarDSRef.style.minWidth = '100px';
			previewBarDSRef.style.maxWidth = '250px';
			previewBarShowBtnLblRef.style.opacity = '0';
			setTimeout(()=>{
				previewBarShowBtnLblRef.innerHTML = '⮜';
				previewBarShowBtnLblRef.style.opacity = '1';
				this.executingPrevBarAnimation = false;
			}, 500);
		}else{
			previewBarDSRef.style.width = '0px';
			previewBarDSRef.style.minWidth = '0px';
			previewBarShowBtnLblRef.style.opacity = '0';
			setTimeout(()=>{
				previewBarShowBtnLblRef.innerHTML = '⮞';
				previewBarShowBtnLblRef.style.opacity = '1';
				this.executingPrevBarAnimation = false;
			}, 500);
		}

		this.setState({showPreviewBar});
	}
	onClickedPreviewBarShowBtn(){
		this.closePrevBar();
	}
	onOverPreviewBarShowBtn(){
		if(this.executingPrevBarAnimation){
			return;
		}
		if( !this.prevBarActive && !window.mobilecheck() ){
			return;
		}
		this.closePrevBar();
	}
	onPreviewClicked(id){
		let mainWindowRef = this.mainWindowRef.current;
		mainWindowRef.style.opacity = '0';
		mainWindowRef.style.transform = 'scale(0)';
		mainWindowRef.scrollTo(0,0);
		setTimeout(()=>{
			if(!!this.props.previewSelected){
				this.props.previewSelected(id);
			}
			setTimeout(()=>{
				mainWindowRef.style.opacity = '1';
				mainWindowRef.style.transform = 'scale(1)';
			}, 10);
		}, 500);
	}
	render(){
		return (
			<div className="DiaSelector">
				<div className="PreviewBarDS"
					  ref={this.previewBarDSRef}
					  onMouseEnter={()=>{if(!window.mobilecheck()){this.activatePrevBar();}}}>
					<div className="PreviewBarImgContainerDS">
						<div className="PreviewBarImgFlexDS">
							{this.state.imgPaths.map((imgPath,id)=>{
								return <img className={"PreviewImgDS" + ((id===this.props.selectedId) ? " chckd" : " unchckd")}
												key={id}
												onClick={()=>{this.onPreviewClicked(id)}}
												src={imgPath}
												width={'80%'}
												height={'150px'}/>;
							})}
						</div>
					</div>
				</div>

				<div className="PreviewBarShowBtnDS"
					  onMouseOver={()=>{if(!window.mobilecheck()){this.onOverPreviewBarShowBtn();}}}
					  onClick    ={this.onClickedPreviewBarShowBtn}>
						<div className="PreviewBarShowBtnTxtDS"
							  ref={this.previewBarShowBtnLblRef}
							  onMouseOver={()=>{if(!window.mobilecheck()){this.onOverPreviewBarShowBtn();}}}
					  		  onClick    ={this.onClickedPreviewBarShowBtn}>
							⮜
						</div>
				</div>
				<div className="MainWindowContainerDS">
					<div className="MainWindowDS"
						  ref={this.mainWindowRef}>
						{this.props.mainContent}
					</div>
				</div>
			</div>
		);
	}
}

export default DiaSelector;
