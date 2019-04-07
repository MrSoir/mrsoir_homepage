import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import meta_info from './info.txt';
import ImagedPreviews from '../ImagedPreviews/ImagedPreviews';
import KubuIcon from './Kubu_icon.png';
import './Kubu.css';

class Kubu extends Component{
/*	constructor(props){
		super(props);
	}*/
	render(){
		let programDescription = <div id="KubuProgramDescription">
											<div className="Separator"/>
											<p className="ProgramDescription">
											Kubu is a lightweight file system viewer. Its' special features 
											make working with files easier and much more efficient. You don't 
											have to look up dozens of different folders to find a file - simply
											 load the entire content of a directory and observe all files at once.
											</p>
											<div className="Separator"/>
										</div>
		return (
			<div className="Kubu">
				<div id="KubuIconContainer">
					<img id="KubuIcon"
						  src={KubuIcon} 
						  alt='KubuIcon'/>
				</div>
				
				{programDescription}
				
				
				<ImagedPreviews baseName="Kubu"
									 meta_info_path={meta_info}
				/>
			</div>
		);
	}
}

export default withRouter(Kubu);
