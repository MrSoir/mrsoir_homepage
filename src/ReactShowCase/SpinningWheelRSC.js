import React, { Component } from 'react';
import SpinningWheel from '../SpinningWheel';
import './SpinningWheelRSC.css';


class SpinningWheelRSC extends Component{
	constructor(props){
		super(props);
		
		this.onTagClicked = this.onTagClicked.bind(this);
		
		this.state = {
			tags: [],//this.genTags(1),
			selectedTag: 0,
		};
	}
	getNTags(n){
		let tags = ['Sun', 'Mercury', 'Venus', 'Mother Earth', 'Moon', 'Juipter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
		return tags.slice(0,n);
	}
	genTags(){
		let i = 1;
   	let genTagsCaller = (i)=>{
   		this.setState({tags: this.getNTags(i)});
   		if(i <= 9){
   			setTimeout(()=>{genTagsCaller(i+1)}, 200);
   		}
   	};
   	genTagsCaller(i);
	}
	onTagClicked(tag, tagId){
		this.setState({selectedTag: tagId});
	}
   componentDidMount(){
   	this.genTags();
	}
	render(){
		let resultsString = 'selected: ' +this.state.tags[this.state.selectedTag];
		const heading = 'Spinner';
		const description = `
			This spinner is inspired by rotary dials and 
			lets the user select between several options.
			It takes up more space than a drop down menu but is 
			much more intuitive.
		`;
		console.log('spinninWheelSize: ', this.state.spinninWheelSize);
		return (
			<div className="SpinningWheelRSC">
				<div className="HeadingRSC">
					{heading}
				</div>
				<div className="DescriptionRSC">
					{description}
				</div>
				<div id="SpinningWheelHelperGrid">
					<div className="SpinningWheelDivRSC">
						<SpinningWheel
							tags={this.state.tags}
							onTagClicked={this.onTagClicked}
						/>
					</div>
				</div>
				<div className="SpinningWheelResultsRSC">
					{resultsString}
				</div>
			</div>
		);
	}
}

export default SpinningWheelRSC;

	