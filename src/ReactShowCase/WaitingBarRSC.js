import React, { Component } from 'react';
import * as WAITINGBAR from '../WaitingBar/WaitingBar';
import CheckBox from '../CheckBox';
import SlideBar from '../SlideBar';
import './WaitingBarRSC.css';


class WaitingBarRSC extends Component{
	constructor(props){
		super(props);
		
		this.updateValue = this.updateValue.bind(this);
		this.changeFadingState = this.changeFadingState.bind(this);
		
		this.state = {
			fading: true,
			
			fragmentCount: {
				val: 8,
				min: 3,
				max: 100
			},
			fragmentPadding: {
				val: (Math.PI * 2 / 300),
				min: 0,
				max: (Math.PI * 2 / 20)
			},
			progressSpeed: {
				val: 0.02,
				min: 0.005,
				max: 0.25
			},
			scaleSpeed: {
				val: 0.005,
				min: 0.001,
				max: 0.05
			},
			innerRadius: {
				val: 220,
				min: 100,
				max: 300
			},
			outerRadius: {
				val: 250,
				min: 110,
				max: 330
			}
		};
	}
   componentDidMount(){
	}
	changeFadingState(){
		this.setState({fading: !this.state.fading});
	}
	//----------------------------
	updateValue(stateObj, val){
		stateObj.val = val;
		this.setState(stateObj);
	}
	updatePercentageValue(prctg, stateObj, floor=false){
		this.updateValue(stateObj, this.evalRangeValue(prctg, stateObj, floor));
	}
	evalRangeValue(prctg, stateObj, floor=false){
		let x =  stateObj.min + prctg * (stateObj.max - stateObj.min);
		return !!floor ? Math.floor(x) : x;
	}
	genPercentageSetter(stateObj, floor=false){
		return (prctg)=>{this.updatePercentageValue(prctg, stateObj, floor)}
	}
	//----------------------------
	evalRangePercentage(stateObj){
		return (stateObj.val - stateObj.min) / (stateObj.max - stateObj.min);
	}
	evalRangePercentageInt(stageObj){
		return Math.floor( this.evalRangePercentage(stageObj) );
	}
	render(){
		const heading = 'A customizable waiting "bar"';
		return (
			<div className="WaitingBarRSC">
				<div className="HeadingRSC">
					{heading}
				</div>
				<div className="WaitingBarDivRSC">
					<WAITINGBAR.WaitingBar
						innerRadius={this.state.innerRadius.val}
						outerRadius={this.state.outerRadius.val}
						fading={this.state.fading}
						fragmentCount={this.state.fragmentCount.val}
						fragmentPadding={this.state.fragmentPadding.val}
						progressSpeed={this.state.progressSpeed.val}
						scaleSpeed={this.state.scaleSpeed.val}
						fillColor={new WAITINGBAR.Color(80,80,80)}
						selectedFillColor={new WAITINGBAR.Color(0,180,0)}
					/>
				</div>
				<div className="SettingsDivRSC">
					<div className="CheckBoxDivRSC">
						<div className="CheckBoxLabelRSC">
							{"fading:"}
						</div>
						<div className="CheckBoxRSC">
							<CheckBox checked={this.state.fading}
										 onClick={this.changeFadingState}
							/>
						</div>
					</div>
					<div className="SliderContainerRSC">
						<div className="SliderDivRSC">
							<SlideBar label="inner radius"
										 sliderVal={this.evalRangePercentage(this.state.innerRadius)}
										 onMouseUp={this.genPercentageSetter(this.state.innerRadius)}/>
						</div>
						<div className="SliderDivRSC">
							<SlideBar label="outer radius"
										 sliderVal={this.evalRangePercentage(this.state.outerRadius)}
										 onMouseUp={this.genPercentageSetter(this.state.outerRadius)}/>
						</div>
						<div className="SliderDivRSC">
							<SlideBar label="fragment count"
										 sliderVal={this.evalRangePercentageInt(this.state.fragmentCount)}
										 onMouseUp={this.genPercentageSetter(this.state.fragmentCount, true)}/>
						</div>
						<div className="SliderDivRSC">
							<SlideBar label="fragment padding"
										 sliderVal={this.evalRangePercentage(this.state.fragmentPadding)}
										 onMouseUp={this.genPercentageSetter(this.state.fragmentPadding)}/>
						</div>
						<div className="SliderDivRSC">
							<SlideBar label="progress speed"
										 sliderVal={this.evalRangePercentage(this.state.progressSpeed)}
										 onMouseUp={this.genPercentageSetter(this.state.progressSpeed)}/>
						</div>
						<div className="SliderDivRSC">
							<SlideBar label="scale speed"
										 sliderVal={this.evalRangePercentage(this.state.scaleSpeed)}
										 onMouseUp={this.genPercentageSetter(this.state.scaleSpeed)}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default WaitingBarRSC;

	