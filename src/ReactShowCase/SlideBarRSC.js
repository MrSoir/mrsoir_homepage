import React, { Component } from 'react';
import SlideBar from '../SlideBar';
import './SlideBarRSC.css';


class SlideBarRSC extends Component{
	constructor(props){
		super(props);
		
		this.setSlideBarValue = this.setSlideBarValue.bind(this);
		
		this.state = {
			slideBarValue: 0.5,
			indicatorValue: 0.25
		};
	}
	setSlideBarValue(val){
		console.log('slideBarValue: ', val);
		this.setState({slideBarValue: val});
	}
   componentDidMount(){
   	setInterval(()=>{
   		let oldVal = this.state.indicatorValue;
   		let offs = Math.random() * 0.2;
   		let sign = Math.random() > 0.5 ? -1 : 1;
   		let val = Math.min(Math.max(oldVal + offs * sign, 0.1), 0.9);
   		this.setState({indicatorValue: val});
   	}, 1000);
	}
	numberToShortString(x){
		let s = '' + x;
		if(s.length > 3){
			s = s.substr(0,4);
		}
		return s;
	}
	render(){
		let slideBarValue = this.state.slideBarValue;
		let indicatorValue = this.state.indicatorValue;
		let selectedValue = 'selected value: ' + this.numberToShortString(slideBarValue) + ' %';
		let refValue = 'reference value: ' + this.numberToShortString(indicatorValue) + ' %';
		
		const heading = 'SlideBar';
		const description = <div>
			This is an advanced range slider. In addition to the range slider html tag,
			you can add a label that is rendered at the center of it.
			You can also add a reference value. This comes in handy when you,
			for example, need to display real time values like sensor data.
		</div>;
		
		return (
			<div className="SlideBarRSC">
				<div className="HeadingRSC">
					{heading}
				</div>
				<div className="DescriptionRSC">
					{description}
				</div>
				<div className="SlideBarDivRSC">
					<SlideBar
						sliderVal={this.state.slideBarValue}
						indicatorValue={this.state.indicatorValue}
						label='some demo SlideBar'
						onMouseUp={(val)=>{this.setState({slideBarValue: val})}}
					/>
				</div>
				<div className="SlideBarResultsRSC">
					<div>
						{selectedValue}
					</div>
					<div>
						{refValue}
					</div>
				</div>
			</div>
		);
	}
}

export default SlideBarRSC;

	