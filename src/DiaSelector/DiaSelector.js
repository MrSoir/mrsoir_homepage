import React, { Component } from 'react';
import './DiaSelector.css';


class DiaSelector extends Component{
	constructor(props){
		super(props);
		
		this.previewBarDSRef 	  = React.createRef();
		this.previewBarShowBtnRef = React.createRef();
		this.mainWindowRef 		  = React.createRef();
		
		this.onOverPreviewBarShowBtn = this.onOverPreviewBarShowBtn.bind(this);
		this.onPreviewClicked = this.onPreviewClicked.bind(this);
		
		this.state = {
			showPreviewBar: true,
			imgPaths: this.props.previewImagePaths
		};
	}
   componentDidMount(){
   	
	}
	onOverPreviewBarShowBtn(){
		let showPreviewBar = !this.state.showPreviewBar;
		
		console.log('showPreviewBar: ', showPreviewBar);
		
		let previewBarDSRef = this.previewBarDSRef.current;
		let previewBarShowBtnRef = this.previewBarShowBtnRef.current;
		
		if(showPreviewBar){
			previewBarDSRef.style.width = '25%';
			previewBarDSRef.style.minWidth = '100px';
			previewBarDSRef.style.maxWidth = '250px';
			previewBarShowBtnRef.style.opacity = '0';
			setTimeout(()=>{
				previewBarShowBtnRef.innerHTML = '⮜';
				previewBarShowBtnRef.style.opacity = '1';
			}, 500);
		}else{
			previewBarDSRef.style.width = '0px';
			previewBarDSRef.style.minWidth = '0px';
			previewBarShowBtnRef.style.opacity = '0';
			setTimeout(()=>{
				previewBarShowBtnRef.innerHTML = '⮞';
				previewBarShowBtnRef.style.opacity = '1';
			}, 500);
		}
		
		this.setState({showPreviewBar});
	}
	onPreviewClicked(id){
		let mainWindowRef = this.mainWindowRef.current;
		mainWindowRef.style.opacity = '0';
		mainWindowRef.style.transform = 'scale(0)';
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
					  ref={this.previewBarDSRef}>
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
				
				<div className="PreviewBarShowBtnDS">
						<div className="PreviewBarShowBtnTxtDS"
							  ref={this.previewBarShowBtnRef}
							  onMouseOver={()=>{if(!window.mobilecheck()){this.onOverPreviewBarShowBtn();}}}
							  onClick    ={()=>{if( window.mobilecheck()){this.onOverPreviewBarShowBtn();}}}>
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

