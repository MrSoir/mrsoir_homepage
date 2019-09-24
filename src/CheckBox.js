import React, { Component } from 'react';
import './CheckBox.css';


class CheckBox extends Component{
	constructor(props){
		super(props);
		
		this.onClick = this.onClick.bind(this);
	}
	onClick(){
		if( !!this.props.onClick ){
			this.props.onClick();
		}
	}
	render(){
		return (
			<div 
					className={"checkbox " + (!!this.props.checked ? "checked" : "unchecked")} 
						onClick={this.onClick}
			>
				{!!this.props.checked ? String.fromCharCode(10003) : ""}
			</div>
		);
	}
}

export default CheckBox;