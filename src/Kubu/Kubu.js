import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import Carousel from '../CarouselDiaShow/Carousel';
import KubuIcon from './Kubu_icon.png';
import {WaitingBar} from '../WaitingBar/WaitingBar';
import AnimatedGif from '../AnimatedGif';
import AnimatedVideo from '../AnimatedVideo';
import './Kubu.scss';


function kubuImageGnrtr(tag, fileType){
	return process.env.PUBLIC_URL + '/Kubu/pics/Kubu' + tag + fileType;
}
function kubuVideoGnrtr(tag, fileType){
	return process.env.PUBLIC_URL + '/Kubu/videos/Kubu' + tag + fileType;
}
function getCheckImgPath(){
	return process.env.PUBLIC_URL + '/icons/check.png';
}
function getRightArrowImgPath(){
	return process.env.PUBLIC_URL + '/icons/right-arrow.png';
}
function getAppImageIconPath(){
	return process.env.PUBLIC_URL + '/Kubu/downloadIcons/appimage.png';
}
function getDebIconPath(){
	return process.env.PUBLIC_URL + '/Kubu/downloadIcons/deb.png';
}

function GiffedDescription({descrOnLeft, imgPath, gifPath, heading, descrComps}){

	const headingDiv = (
		<div className="HeadingGFDDSCR">
			{heading}
		</div>
	);
	const gif = (
		<div className="GifGFDDSCR">
			<AnimatedGif imgPath={imgPath}
						 gifPath={gifPath}
			/>
		</div>
	);
	const descr = (
		<div className="DescrGFDDSCR">
			{descrComps}
		</div>
	);

	const mainCls = 'MainGFDDSCR' + (descrOnLeft ? ' descrOnLeft' : ' descrOnRight');
	return (
		<div className={mainCls}>
			{headingDiv}
			{gif}
			{descr}
		</div>
	)
}
function VideodDescription({descrOnLeft, imgPath, videoPath, heading, descrComps}){

	const headingDiv = (
		<div className="HeadingGFDDSCR">
			{heading}
		</div>
	);
	const video = (
		<div className="GifGFDDSCR">
			<AnimatedVideo imgPath={imgPath}
						   videoPath={videoPath}
			/>
		</div>
	);
	const descr = (
		<div className="DescrGFDDSCR">
			{descrComps}
		</div>
	);

	const mainCls = 'MainGFDDSCR' + (descrOnLeft ? ' descrOnLeft' : ' descrOnRight');
	return (
		<div className={mainCls}>
			{headingDiv}
			{video}
			{descr}
		</div>
	)
}

function Kubu({}){
	const [imgPaths, setImgPaths] = useState([]);
	const [imgRatio, setImgRatio] = useState({w: 16, h: 9});

	useEffect(()=>{
		window.scrollTo(0, 0);

		setImgPaths( getImagePaths() );
	}, []);

	function getImagePaths(){
		const pths = [];
		for(let i=0; i < 5; ++i){
			pths.push( kubuImageGnrtr(i, '.jpg') );
		}
		console.log('pths: ', pths);
		return pths;
	}

	
	function genSeparator(){
		return <div className="Separator KubuSeparator"/>;
	}

	function genIconDescrArg(iconPath, argTxtBold, argTxtPlain){
		return (
			<p className="CheckedDescrArg">
				<img src={iconPath} className="IconCHCKDDESCRARG"/>
				<span className="BoldCHCKDDESCRARG">
					{argTxtBold}
				</span>
				<span className="PlainCHCKDDESCRARG">
					{argTxtPlain}
				</span>
			</p>
		);
	}
	function genRightArrowDescrArg(argTxtBold, argTxtPlain){
		return genIconDescrArg(getRightArrowImgPath(), argTxtBold, argTxtPlain);
	}
	function genCheckedDescrArg(argTxtBold, argTxtPlain){
		return genIconDescrArg(getCheckImgPath(), argTxtBold, argTxtPlain);
	}
	function genElapsingDescr(){
		const dscr = (
			<>with Kubu you can load an inspect not just the content
			  of the current directory but also the content of
			  all its sub directories and its ancestors. <br/>
			  This makes working in directories much more comfortable,
			  especially in cases where you want to copy/move/drag&drop files from
			  one folder to another.
			</>);
		return (
			<div className="DescrKubu">
				{dscr}
			</div>
		);
	}
	function genFileManipDescr(){
		const dscr0 = genCheckedDescrArg('zip', '- zip files located in different folders');
		const dscr1 = genCheckedDescrArg('extract', '- extract zip files');
		const dscr2 = genCheckedDescrArg('drag & drop', '- move files comfortably from one folder to another via drag & drop');
		const dscr3 = genCheckedDescrArg('rename', '- rename files and folders');
		const dscr4 = genCheckedDescrArg('terminal', '- open terminals of selected folders');
		const dscr5 = genRightArrowDescrArg('all with just a few clicks!');
		return (
			<div className="DescrKubu">
				{dscr0}
				{dscr1}
				{dscr2}
				{dscr3}
				{dscr4}
				{dscr5}
			</div>
		);
	}
	function genDeepSearchDescr(){
		const dscr = (
			<>you can search for files in the current directory and Kubu
			  opens the tree structure with all the matches. <br/>
			  This way you retrieve all matching files and at the same
			  time you can see where they are located.
			</>);
		return (
			<div className="DescrKubu">
				{dscr}
			</div>
		);
	}
	function genMultiWindowingDescr(){
		const dscr = (
			<>in Kubu you can split the main window into as many subwindows
			  as you wish and freely resize them. <br/>
			  Kubu also supports tabs to simultaneously work in as many
			  folders as possible.
			</>);
		return (
			<div className="DescrKubu">
				{dscr}
			</div>
		);
	}
	function genDescrHeading(hdng){
		return (
			<div className="DescrHeadingKubu">
				{hdng}
			</div>
		)
	}

	function genSnapStoreDownloadButton(){
		return (
			<a href="https://snapcraft.io/kubu">
				<img alt="Get it from the Snap Store" src="https://snapcraft.io/static/images/badges/en/snap-store-black.svg" />
			</a>
		);
	}

	function genDownloadButton(button, descr){
		return (
			<div className="DownloadBtnKUBU">
				{button}
				<div className="DownloadBtnTxtKUBU">
					{descr}
				</div>
			</div>
		);
	}
	const elapsingDescrHdng = genDescrHeading('Inspect Subfolders');
	const elapsingDescr = genElapsingDescr();
	
	const fileManipHdng = genDescrHeading('File Manipulation');
	const fileManipDescr = genFileManipDescr();

	const deepSearchHdng = genDescrHeading('Deep Search');
	const deepSearchDescr = genDeepSearchDescr();

	const mltiWndwHdng = genDescrHeading('Tabs & Split Windows');
	const mltiWndwDescr = genMultiWindowingDescr();

	const appImgBtn = (
		<div className="DownloadBtnImgDivKUBU">
			<img 
				src={getAppImageIconPath()}
				className="DownloadBtnImgKUBU"
			/>
		</div>
	);
	const debBtn = (
		<div className="DownloadBtnImgDivKUBU">
			<img 
				src={getDebIconPath()}
				className="DownloadBtnImgKUBU"
			/>
		</div>
	);

	return (
		<div className="MainKUBU">
		
			<div id="KubuIconContainer">
				<img id="KubuIcon"
						src={KubuIcon} 
						alt='KubuIcon'/>
			</div>
			
			{genSeparator()}
			
			<div id="CarouselDivKUBU">
				<div id="CarouselKUBU">
					<Carousel
						imgPaths={ getImagePaths() }
						imgRatio={imgRatio}
						delay={3000}
					/>
				</div>
				
				<div id="CarouselDescrKubu">
					<div id="DescrHeadingKUBU">
						<span className="ProgramNameKUBU">
							Kubu
						</span>
						<span className="ProgramHeadingKUBU">
							file manager
						</span>
					</div>
					<div className="CarouselDescrTxtKubu">
						Kubu is a powerful cross platform file manager.
						It puts emphasis on a clean look and ease of use.
						Being a Electron.js-application, you can
						experience the same look and feel on all common platforms.
					</div>
				</div>
			</div>
			
			<div className="GifedDescrDivKUBU even">
				<VideodDescription
					descrOnLeft={false}
					videoPath={ kubuVideoGnrtr('_elapse', '.mp4') }
					imgPath={ kubuImageGnrtr('_inspect', '.jpg') }
					heading={elapsingDescrHdng}
					descrComps={elapsingDescr}
				/>
			</div>

			<div className="GifedDescrDivKUBU odd">
				<VideodDescription
					descrOnLeft={true}
					videoPath={ kubuVideoGnrtr('_fileManip', '.mp4') }
					imgPath={ kubuImageGnrtr('_inspect', '.jpg') }
					heading={fileManipHdng}
					descrComps={fileManipDescr}
				/>
			</div>

			<div className="GifedDescrDivKUBU even">
				<VideodDescription
					descrOnLeft={false}
					videoPath={ kubuVideoGnrtr('_elapse', '.mp4') }
					imgPath={ kubuImageGnrtr('_search', '.jpg') }
					heading={deepSearchHdng}
					descrComps={deepSearchDescr}
				/>
			</div>


			<div className="GifedDescrDivKUBU odd">
				<VideodDescription
					descrOnLeft={true}
					videoPath={ kubuVideoGnrtr('_windowing', '.mp4') }
					imgPath={ kubuImageGnrtr('_windowing', '.jpg') }
					heading={mltiWndwHdng}
					descrComps={mltiWndwDescr}
				/>
			</div>

			<div id="DownloadsDivKUBU">
				<div id="DownloadsHeadingKUBU">
					Downloads
				</div>
				<div id="DownloadButtonsGrid">
					{genDownloadButton(genSnapStoreDownloadButton(), 'Linux 64-bit')}
					{genDownloadButton(appImgBtn, 'Linux AppImage 64-bit')}
					{genDownloadButton(debBtn, 'Linux deb-package 64-bit')}
				</div>
				<div id="DownloadsFooterKUBU">
					(Kubu will soon be available for Windows and iOS)
				</div>
			</div>
		</div>

		
	);
}

export default withRouter(Kubu);
