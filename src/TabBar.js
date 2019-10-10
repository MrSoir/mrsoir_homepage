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
   		{this.props.tabs.map((tab, i) =>{
   			let isLast = (i >= (this.props.tabs.length-1));
				return <TabElement key={i}
									isLast={isLast}
									tab={tab}
									tabid={i}
									tabClicked={()=>this.tabClicked(i, this.props.tabCallback)}
									selected={(i % 2 ? true : false)}
				/>
			}
      	)}
				<div className="TabSeparator">
				</div>
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
		}else{
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
		let isLast = !!this.props.isLast;
		let tabLinkClass = "TabLink" + (isLast ? " LastTabElement" : "");
		let tabElementClass = "TabElement HeadingTextSize";
		if(this.props.tab.selected){
			tabLinkClass += ' Selected';
			tabElementClass += ' Selected';
		}

		return(
		   <div className={tabElementClass}
			 			onClick={()=>this.props.tabClicked(this.props.tabid)}
						onMouseEnter={()=>this.tabMouseEnter()}
						onMouseOut={()=>this.tabMouseOut()} >
      		<div className={tabLinkClass}
      			  key={this.props.tabid}
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
