import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import SlideBar from '../SlideBar';
import WaveWaitingBar from '../WaveWaitingBar';
import './WaveWaitingBarRSC.css';

function WaveWaitingBarRSC(props){

	const [red, setRed] = useState(0);
	const [green, setGreen] = useState(1);
	const [blue, setBlue] = useState(0);

	const mobile = window.mobilecheck();

	const [componentCount, setCompCount] = useState(mobile ? 50 : 200);

	const MAX_COMPONENT_COUNT = mobile ? 200 : 1000;
	const MIN_COMPONENT_COUNT = 10;

	function setPercentageComponentCount(prctg){
		setCompCount( MIN_COMPONENT_COUNT + prctg * (MAX_COMPONENT_COUNT - MIN_COMPONENT_COUNT) );
	}
	function evalPrctgComponentCount(){
		(comonentCount - MIN_COMPONENT_COUNT) / (MAX_COMPONENT_COUNT - MIN_COMPONENT_COUNT);
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
			<div className="WaitingBarWBRSC">
				<WaveWaitingBar r={red}
												g={green}
												b={blue}
												componentCount={componentCount}
				/>
			</div>
			<div className="SettingsWBRSC">
				<SlideBar label="red"
							 sliderVal={red}
							 onMouseUp={(v)=>{setRed(v);}}}/>
				<SlideBar label="red"
				 			 sliderVal={green}
				 			 onMouseUp={(v)=>{setGreen(v);}}}/>
			  <SlideBar label="red"
				 			 sliderVal={blue}
				 			 onMouseUp={(v)=>{setBlue(v);}}}/>
				<SlideBar label="red"
			 				 sliderVal={ evalPrctgComponentCount() }
			 				 onMouseUp={setPercentageComponentCount}/>
			</div>
		</div>
	)
}

export default WaveWaitingBarRSC;
