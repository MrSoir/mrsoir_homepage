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
			outerCurved: true,
			innerCurved: true,

			fragmentCount: {
				val: 4,
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
				val: 0.015,
				min: 0.001,
				max: 0.05
			},
			innerRadius: {
				val: 0.4,
				min: 0.0,
				max: 0.5
			},
			outerRadius: {
				val: 0.45,
				min: 0.0,
				max: 0.5
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
		console.log('x: ', x);
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
				<div className="HeadingRSCWB">
					{heading}
				</div>
				<div className="WaitingBarDivRSC">
					<WAITINGBAR.WaitingBar
						innerRadius={this.state.innerRadius.val}
						outerRadius={this.state.outerRadius.val}
						fading={this.state.fading}
						fragmentCount={Math.floor(this.state.fragmentCount.val)}
						fragmentPadding={this.state.fragmentPadding.val}
						progressSpeed={this.state.progressSpeed.val}
						scaleSpeed={this.state.scaleSpeed.val}
						fillColor={new WAITINGBAR.Color(80,80,80)}
						selectedFillColor={new WAITINGBAR.Color(0,180,0)}
						outerCurved={this.state.outerCurved}
						innerCurved={this.state.innerCurved}
					/>
				</div>

				<div className="SettingsDivRSC">
					<div className="CheckBoxFlexWB">
						<div className="CheckBoxLabelRSCWB">
							fading:
						</div>
						<CheckBox
									 checked={this.state.fading}
									 onClick={this.changeFadingState}
						/>
					</div>
					<div className="CheckBoxFlexWB">
						<div className="CheckBoxLabelRSCWB">
							{"outer border curved:"}
						</div>
						<CheckBox
									 checked={this.state.outerCurved}
									 onClick={ (()=>{this.setState({outerCurved: !this.state.outerCurved})}).bind(this) }
						/>
					</div>
					<div className="CheckBoxFlexWB">
						<div className="CheckBoxLabelRSCWB">
							{"inner border curved:"}
						</div>
						<CheckBox
									 checked={this.state.innerCurved}
									 onClick={ (()=>{this.setState({innerCurved: !this.state.innerCurved})}).bind(this) }
						/>
					</div>
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
									 sliderVal={this.evalRangePercentage(this.state.fragmentCount)}
									 onMouseUp={this.genPercentageSetter(this.state.fragmentCount)}/>
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
		);
	}
}

export default WaitingBarRSC;
