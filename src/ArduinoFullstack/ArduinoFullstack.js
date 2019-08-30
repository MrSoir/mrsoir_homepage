import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';
import './ArduinoFullstack.css';
import CurtainButton from '../CurtainButton';
import ReactPlayer from 'react-player';

class ArduinoFullstack extends Component{
	constructor(props){
		super(props);
		
		this.goToArduinoHomepage = this.goToArduinoHomepage.bind(this);
		
		this.state = {
		}
	}
	goToArduinoHomepage(){
		window.location.href = 'https://create.arduino.cc/projecthub/MrSoir/fullstack-restful-m-ern-irrigation-system-159338';
	}

   componentDidMount(){
		window.scrollTo(0, 0);
	}
	render(){
		let video_path = process.env.PUBLIC_URL + '/ArduinoFullstack/Fullstack.mp4';
		let video_img_path = process.env.PUBLIC_URL + '/ArduinoFullstack/irrigation.mp4';
		
		let arduinosDesrcp = (
				<ul className="ulAFS">
					<li className="liAFS">
						an irrigation system that takes care of 7 plants on my balcony
					</li>
					
					<li className="liAFS">
						two WS2812b LED-strips that illuminate my living room.
					</li>
				</ul>
		);
		let arduinoCornerstones = (
			<ul className="ulAFS">
				<li className="liAFS">
					<div className='CornerstonesNameAFS'>
						The sever/back-end: 
					</div>
					<div className='CornerstonesDescrAFS'>
						 a RaspberryPi (Zero W) that serves as a Node.js/Express server and saves all data in MongoDB database,
					</div>
				</li>
				
				<li className="liAFS">
					<div className='CornerstonesNameAFS'>
						The front-end:
					</div>
					<div className='CornerstonesDescrAFS'>
						 a React.js based website that gives you control over the irrigation system and the LED strips,
					</div>
				</li>
				
				<li className="liAFS">
					<div className='CornerstonesNameAFS'>
						The microcontrollers
					</div>
					<div className='CornerstonesDescrAFS'>
						 that make your devices 'smart' and let you control them over your browser capable devices
					</div>
				</li>
			</ul>
		);
		let infoText = <div className="ProgramDescription ArduinoFullStackInfoMargins">
			After several plants on my balcony died because I insufficiently 
			irrigated them, I decided to create an automated irrigation system. Because I 
			was already using a Raspberry Pi Zero W as a FTP-server, I decided to use the
			Raspberry to implement a server-based approach to control all the Microcontrollers
			in my household. So far, I've installed 2 Wemos D1 mini microcontrollers that
			control
				{arduinosDesrcp}
			The system is mainly based on three pillars:
				{arduinoCornerstones}
			The cool thing about this system is that it let's me control and monitor all
			microcontrollers from any device (PC, smartphone, etc.) in my houshold.
			<div className="TextBlockAFS">
			I put emphasis on writing clean, modular code. Therefore the system is
			easily extensible and makes adding additional microcontrolers a breeze.
			You can use my code as a starting point to implement your own custom solution.
			</div>
			<div className="TextBlockAFS">
			I published a detailed documentation on the official Arduino projecthub:
			</div>
		</div>;
		
		return (
			<div className="ArduinoFullStack">				
				<div className="ProgramHeading">Full stack RESTful MERN Arduino infractructure</div>

				<div id="VideoASF">
					<ReactPlayer
						playing
						url="https://youtu.be/O4mRwfDxEPg"
					/>
				</div>
				<div id="VideoDescriptionASF">
					a short video demonstrating the most siginificant features of my server-client based approach
				</div>
				
				{infoText}
				
				<div id="DocsBtnAFS">
					<CurtainButton text="go to detailed documentation"
										onClick={this.goToArduinoHomepage}/>
				</div>
			</div>
		);
	}
}



export default withRouter(ArduinoFullstack);
