import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';
import ImagedPreviews from '../ImagedPreviews/ImagedPreviews';
import './Notes.css';

class Notes extends Component{
	constructor(){
		super();
	}
	render(){
		let installationInfo = <p>
									  		The Program is written in Python3, so it is cross platform
									  		 an runs on Windows, Mac and Linux.
									  		 <br/>
									  		 Just make sure you have installed Python3 and alonside 
									  		 the famous python-packages Numpy, Scipy and PyQt5.
									  </p>;
		return (
			<div className="Notes">
				<div className="Heading">
					Notes
				</div>
				
				<ImagedPreviews baseName="Notes"
									meta_info_path={meta_info}
				/>
				
				<div className="SmallSeparator"/>
				
				<div className="DownloadButton">
						Download
				</div>
				
				<div className="InstallationInfo">
					{installationInfo}
				</div>
			</div>
		);
	}
}

export default withRouter(Notes);
