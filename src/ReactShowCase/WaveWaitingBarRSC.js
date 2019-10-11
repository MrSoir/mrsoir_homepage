import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import SlideBar from '../SlideBar';
import CheckBox from '../CheckBox';
import WaveWaitingBar from '../WaveWaitingBar/WaveWaitingBar';
import './WaveWaitingBarRSC.css';

function WaveWaitingBarRSC(props){
	const mobile = window.mobilecheck();

	const [red, setRed] = useState(0);
	const [green, setGreen] = useState(1);
	const [blue, setBlue] = useState(0);
	const [elementCount, setElementCount] = useState(mobile ? 50 : 200);
	const [stopAnimation, setStopAnimation] = useState(false);
	const [roundedEdges, setRoundedEdges] = useState(false);

	const MAX_ELEMENT_COUNT = mobile ? 200 : 1000;
	const MIN_ELEMENT_COUNT = 10;

	useEffect(()=>{
		return ()=>{
			console.log('stopping animation!');
			setStopAnimation(true);
		}
	}, []);

	function setPercentageElementCount(prctg){
		setElementCount( MIN_ELEMENT_COUNT + prctg * (MAX_ELEMENT_COUNT - MIN_ELEMENT_COUNT) );
	}
	function evalPrctgElementCount(){
		return (elementCount - MIN_ELEMENT_COUNT) / (MAX_ELEMENT_COUNT - MIN_ELEMENT_COUNT);
	}

	let heading = `
		another 'waiting bar'...
	`;
	
	let description = `
		a waiting bar following no real sense, just one of those lazy days
		as a programmer where You play around and try out some new things
	`;

	return (
		<div className="MainDivWWBRSC">
			<div id="HeadingWWBRSC"className="HeadingRSC">
        {heading}
      </div>
      <div id="DescriptionWWBRSC" className="DescriptionRSC">
        {description}
      </div>
			<div id="WaitingBarWBRSC">
				<WaveWaitingBar r={red}
												g={green}
												b={blue}
												elementCount={elementCount}
												stop={stopAnimation}
												roundedEdges={roundedEdges}
				/>
			</div>
			<div className="SettingsWBRSC">
				<div className="CheckBoxFlexWB CheckBoxWWBRSC">
					<div className="CheckBoxLabelRSCWB">
						{"rounded edges:"}
					</div>
					<CheckBox
								 checked={roundedEdges}
								 onClick={ ()=>{setRoundedEdges( !roundedEdges)} }
					/>
				</div>
				<div className="SliderWBRSC">
					<SlideBar label="red"
								 sliderVal={red}
								 onMouseUp={(v)=>{setRed(v);}}/>
				</div>
				<div className="SliderWBRSC">
					<SlideBar label="green"
				 			 sliderVal={green}
				 			 onMouseUp={(v)=>{setGreen(v);}}/>
			  </div>
				<div className="SliderWBRSC">
				  <SlideBar label="blue"
					 			 sliderVal={blue}
					 			 onMouseUp={(v)=>{setBlue(v);}}/>
				</div>
				<div className="SliderWBRSC">
					<SlideBar label="element count"
				 				 sliderVal={ evalPrctgElementCount() }
				 				 onMouseUp={setPercentageElementCount}/>
				</div>
			</div>
		</div>
	)
}

export default WaveWaitingBarRSC;
