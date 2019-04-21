import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './TabBar.css';

class TabBar extends Component{
/*	constructor(props){
		super(props);
	}*/
	tabClicked(tabid, tabCallback){
		tabCallback(tabid);
	}
	render(){
    return (
      <div className="TabBar HeadingTextSize">
   		{this.props.tabs.map((tab, i) =>
				<TabElement key={i}
								tab={tab} 
								tabid={i}
								tabClicked={()=>this.tabClicked(i, this.props.tabCallback)}
								selected={(i % 2 ? true : false)}
				/>
      	)}
      </div>
    );
  }
}

class TabElement extends Component{
	constructor(props){
		super(props);
		
		this.indicator = React.createRef();
		this.tabMouseEnter = this.tabMouseEnter.bind(this);
		this.tabMouseOut = this.tabMouseOut.bind(this);
	}
	tabSelected(){
		const ind = this.indicator.current;
		if ( !this.props.tab.selected ) {
			ind.classList.add('Selected');
			ind.classList.remove('UnSelected');
		}else{
			ind.classList.add('UnSelected');
			ind.classList.remove('Selected');
		}
	}
	tabMouseEnter(){
		if ( !this.props.tab.selected ) {
			const ind = this.indicator.current;
			ind.classList.add('Hovered');
		}
	}
	tabMouseOut(){
		if ( !this.props.tab.selected ) {
			const ind = this.indicator.current;
			ind.classList.remove('Hovered');
		}
	}
	render(){
		return(
		   <div className="TabElement HeadingTextSize">
      		<div className="TabLink" key={this.props.tabid}
      			onClick={()=>this.props.tabClicked(this.props.tabid)}
      			onMouseEnter={()=>this.tabMouseEnter()}
      			onMouseOut={()=>this.tabMouseOut()}>
      			{this.props.tab.name}
      		</div>
      		<div className={"TabIndicator" + (this.props.tab.selected ? " Selected" : "")}
      			  ref={this.indicator}></div>
   		</div>
		);
	}
}

export default withRouter(TabBar);