import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';
import ImagedPreviews from '../ImagedPreviews/ImagedPreviews';

class Kubu extends Component{
	constructor(){
		super();
	}
	render(){
		return (
			<ImagedPreviews baseName="Kubu"
								meta_info_path={meta_info}
			/>
		);
	}
}

export default withRouter(Kubu);
