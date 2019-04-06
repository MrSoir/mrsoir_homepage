import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';
import MainImage from './MainImage.png';
import SecondImage from './SecondImage.png';
import './ReferenceManager.css';

class ReferenceManager extends Component{
	constructor(){
		super();
	}
	render(){
		let programInfo = <p>My Reference Manager does an entirely different job compared to the other reference 
									managers out there. Most reference Manger list your literature sources alphabetically 
									- not really intuitive. This Manager organizes your references like a mind map. Thus, 
									you can organize your literature sources by topic, content or whatever makes sense to 
									you. Additionally, you can add plenty of personal notes to each reference and specify 
									to which page this note refers to. You can even link references with one another: which 
									literature source references another, on what page does it cite the other source and why 
									is that important to you - just add another personal note.
								</p>;
		let mainImageInfo = <p>The screenshot gives you an idea of how the Reference Manager works. 
									  References are grouped together by topics (green boxes). Each Topic can 
									  contain any number of references (blue boxes).
									  <br/>
									  You can read the screenshot as follows: The Topic 
									  'Domestic Effects of Multinationals' contains one reference: 
									  'Domestic Effects of the Foreign Activities of U.S. Multinationals' 
									  by Deasi et. al, published in 2009. The article is cited by 'A Modern 
									  Corporate Tax' by Auerbach on page 15 and itself cites 'The Use Of 
									  Neturalities in International Tax Policy' by David A. Weisbach on page 21.'
								 </p>;
		let scndImgLst = ["Title", 
								"Author",
								"Year of publication",
								"Details about the journal/book that published the article: Title, year, page numbers etc.",
								"Local file path: If you have stored the file on your local drive, e.g. as a PDF, EPUB etc. you can open the file by clicking on the path, so you don't have to lookup the file on your filesystem.",
								"Personal notes: Each note is made up of the page numbers to which the note refers to and the actual note."];
		let installationInfo = <p>
										The Program is written in Java, so it is cross platform an runs on Windows, Mac and Linux. 
										Just make sure you have installed Java version 8 or higher on your computer.
										<br/>
										Click on the download-button and it will download a zipped file: 
										'ReferenceManager.zip'. Extract the zip-file in a folder of your choice. 
										The zip contains a file called 'RefManager.jar'. This a runnable jar file. 
										There are plenty of ways of launching a .jar-file, e.g. have a look at:&nbsp;
										<a href="https://www.youtube.com/watch?v=Glhw_wZ36oI">
											www.youtube.com/watch?v=Glhw_wZ36oI
										</a>. 
										For Linux-Users it's pretty simple: You can run the application by simply 
										double clicking on it. If it doesn't work you maybe have to add permission 
										to execute the file: right-click on RefManager.jar -> Properties -> 
										Permissions-tab -> check 'Allow executing file as program'.
									  </p>;
		return (
			<div>
				<div className="Heading">
					Reference Manager
				</div>
				
				<div className="InfoText">
					{programInfo}
				</div>
				
				<div className="RefManSeparator"/>
				
				<img className="MainImage"
					  src={MainImage}
					  alt="logo"
				/>
				
				<div className="InfoText">
					{mainImageInfo}
				</div>
				
				<div className="RefManSeparator"/>
				
				<div className="SecondImageBlock">
					<img className="SecondImage"
						  src={SecondImage}
						  alt="logo"
					/>
					<div className="SecondImageInfo">
						<div className="SecondImageHeading">
							Here is a detailed example of a reference. It's content is divided into the following topics:
						</div>
						<ol className="SecondImageList">
							{scndImgLst.map((itm, id)=><li className="SecondImageListInfo" key={id}>{itm}</li>)}
						</ol>
					</div>
				</div>
				
				<div className="RefManSeparator"/>
				
				<div className="DownloadButton">
					Download
				</div>
				
				<div className="InfoText InstallationInfo">
					{installationInfo}
				</div>
			</div>
		);
	}
}

export default withRouter(ReferenceManager);
