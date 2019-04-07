import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';
import './Main.css';

class MainPage extends Component{
	constructor(){
		super();
		this.onImageClick = this.onImageClick.bind(this);
		
		this.state = {
			previews: []
		}
	}
	componentWillMount() {
		let txt = readTextFile(meta_info);
		console.log(txt);
		let programs = txt.split('\n').filter((tn)=>!!tn);
		console.log(programs);
   	let f = (pi) => {
   		let text_path = process.env.PUBLIC_URL + '/MainPage/texts/' + pi + '.txt';
   		console.log(text_path);
   		let prev_text = readTextFile(text_path);
   		return {name: pi,
   				  image_path: process.env.PUBLIC_URL + '/MainPage/pics/' + pi + '.png',
   				  text: prev_text };
   	};
   	let prev_programs = programs.map( p => f(p) );
   	console.log(prev_programs);
   	let newstate = this.state;
   	newstate.preview = prev_programs;
   	this.setState(newstate);
   }
	onImageClick(id){
		
	}
	render(){
		return (
		<div className="PreviewsDiv">
			{this.state.preview.map((pi, id)=>
				<Preview key={id} 
							name={pi.name}
							image_path={pi.image_path}
							text={pi.text}
							separator={id < this.state.preview.length-1}
				/>
			)}
		</div>
		);
	}
}

class Preview extends Component{
	constructor(){
		super();
		
		this.loadPath = this.loadPath.bind(this);
	}
	loadPath(){
		let name = this.props.name;
		console.log(name);
		if (!!window.hist)
		{
			console.log('pushing: ', '/' + name);
			window.hist.push('/' + name.replace(' ', ''));
		}
	}
	
	render(){
		let sep = this.props.separator ? <div className="MainSeparator"></div> : '';
		return (
			<div className="">
				<div className="MainPreviewContainer">
					<img 	src={this.props.image_path} 
							alt="logo"
							className="MainPreviewImage"
							onClick={this.loadPath} />
					<div className="MainPreviewText">
						<u className="MainPreviewTextHeading Cursor" 
							onClick={this.loadPath}>
							{this.props.name}
						</u>
						&nbsp;- {this.props.text}
					</div>
				</div>
				{sep}
			</div>
		);
	}
}

export default withRouter(MainPage);

