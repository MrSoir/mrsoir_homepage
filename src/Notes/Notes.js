import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import meta_info from './info.txt';
import ImagedPreviews from '../ImagedPreviews/ImagedPreviews';
import './Notes.css';
import CurtainButton from '../CurtainButton';

class Notes extends Component{
	constructor(args){
		super(args);
		this.downloadNotes = this.downloadNotes.bind(this);
	}
	componentDidMount(){
		window.scrollTo(0, 0);
	}
	downloadNotes(){
		window.open('https://github.com/MrSoir/HandWriting/archive/master.zip', '_blank');
	}
	render(){
		let installationInfo = <p>
									  		The Program is written in Python3 making it a cross platform application. It runs on Windows, Mac and Linux.
									  		 <br/>
									  		 Just make sure Python3 alonside the famous python-packages Numpy, Scipy and PyQt5 is installed on your system.
									  </p>;
		return (
			<div className="Notes">
				<div className="ProgramHeading">
					Notes
				</div>
				
				<ImagedPreviews baseName="Notes"
									meta_info_path={meta_info}
				/>
				
				<div className="SmallSeparator"/>
				
				<CurtainButton text="Download"
									onClick={this.downloadNotes}/>
				
				<div className="FootNote">
					{installationInfo}
				</div>
			</div>
		);
	}
}

export default withRouter(Notes);
