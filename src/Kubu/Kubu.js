import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import meta_info from './info.txt';
import ImagedPreviews from '../ImagedPreviews/ImagedPreviews';
import './Kubu.css';

class Kubu extends Component{
/*	constructor(props){
		super(props);
	}*/
	render(){
		return (
			<div className="Kubu">
				<ImagedPreviews baseName="Kubu"
									 meta_info_path={meta_info}
				/>
			</div>
		);
	}
}

export default withRouter(Kubu);
