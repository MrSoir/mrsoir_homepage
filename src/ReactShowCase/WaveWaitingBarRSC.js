import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import SlideBar from '../SlideBar';
import WaveWaitingBar from '../WaveWaitingBar/WaveWaitingBar';
import './WaveWaitingBarRSC.css';

function WaveWaitingBarRSC(props){

	const [red, setRed] = useState(0);
	const [green, setGreen] = useState(1);
	const [blue, setBlue] = useState(0);
	const [elementCount, setElementCount] = useState(mobile ? 50 : 200);

	const mobile = window.mobilecheck();

	const MAX_ELEMENT_COUNT = mobile ? 200 : 1000;
	const MIN_ELEMENT_COUNT = 10;

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
				/>
			</div>
			<div className="SettingsWBRSC">
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
