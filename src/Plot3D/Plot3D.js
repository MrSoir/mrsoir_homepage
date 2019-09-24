import React, { Component } from 'react';
import './Plot3D.css';
import Plot3DThree from './Plot3DThree';

class Plot3D extends Component{
	constructor(props){
		super(props);
		
		this.onResize = this.onResize.bind(this);
		
		this.canvas = React.createRef();
	}
	goToArduinoHomepage(){
	}
   componentDidMount(){
   	this.setCanvasSize();
   	
   	let props3D = {
   		onLoaded: 			 this.props.onLoaded,
   		data: 				 this.props.data,
   		axisLabels: 		 this.props.axisLabels,
   		dataLabelFontSize: this.props.dataLabelFontSize,
   		axisLabelFontSize: this.props.axisLabelFontSize
   	};
   	
   	/*let plot = */new Plot3DThree(this.canvas.current, props3D);
   	
   	window.addEventListener('resize', 				this.onResize);
		window.addEventListener('orientationchange', this.onResize);
	}
	onResize(){
		let canvas = this.canvas.current;
		if( !canvas ){
			return;
		}
		this.setCanvasSize();
	}
	setCanvasSize(){
		let canvas = this.canvas.current;
		if( !canvas ){
			return;
		}
		let style = canvas.style;
		style.width = '100%';
		style.height = '100%';
		style.minWidth  = this.props.minWidth ? this.props.minWidth + 'px' : '600px';
		style.maxWidth  = this.props.maxWidth ? this.props.maxWidth + 'px' : '100%';
		style.minHeight = this.props.minHeight ? this.props.minHeight + 'px' : '400px';
		style.maxHeight = this.props.maxHeight ? this.props.maxHeight + 'px' : '600px';
	}
	render(){
		this.setCanvasSize();
		return (
			<canvas className="ThreeCanvasRSC"
					  ref={this.canvas}>
			</canvas>
		);
	}
}



export default Plot3D;

