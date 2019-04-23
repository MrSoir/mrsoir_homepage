import React, { Component } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import logo from './MrSoir_grass.png';
//import logo from './logo.svg';
import './App.css';
import tabs_info from './info.txt';
import TabBar from './TabBar';
import {readTextFile, arraysEqual} from './StaticFunctions';
import MainPage from './main/Main';
import Ballin from './Ballin/Ballin';
import Kubu from './Kubu/Kubu';
import ReferenceManager from './ReferenceManager/ReferenceManager';
import Notes from './Notes/Notes';
import SlideShow from './SlideShow/SlideShow';

var hist = null;

class App extends Component {
	constructor(){
		super();
		
		console.log('app-constructor');
		this.state = {
			tabs: []
		}
		
		this.tabClicked = this.tabClicked.bind(this);
		this.genTabSelection = this.genTabSelection.bind(this);
		this.updateTabSelection = this.updateTabSelection.bind(this);
		this.onScroll = this.onScroll.bind(this);
		
		this.header = React.createRef();
		this.body = React.createRef();
		this.logoHeader = React.createRef();
	}
	componentWillMount() {
		window.hist = this.props.history;
		
      let txt = readTextFile(tabs_info);
      let tabnames = txt.split('\n').filter((tn)=>!!tn);
      let newstate = this.state;

		let slctn = this.genTabSelection(tabnames);
		this.lastTabSelection = slctn;
      let f = function(v, i){
			return {name: v, selected: slctn[i]};
		};
      newstate.tabs = tabnames.map(f);

      this.setState(newstate);
      
      this.updateTabSelection();
   }
   componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			let slctn = this.genTabSelection(null);
			let updtTab = this.lastTabSelection &&  (!arraysEqual(slctn, this.lastTabSelection));
			this.lastTabSelection = slctn;
			if(updtTab){
				console.log('updating tab!');
				this.updateTabSelection();
			}
		}
	}
	getTabNames(){
		return this.state.tabs.map(v=>v.name);
	}
   updateTabSelection(){
   	let slctn = this.genTabSelection(null);
   	
   	let newstate = this.state;
   	for(let i=0; i < this.state.tabs.length; ++i){
   		newstate.tabs[i].selected = slctn[i];
   	}
   	this.lastTabSelection = slctn;
   	this.setState(newstate);
   }
   genTabSelection(tabnames){
   	if (tabnames == null){
   		tabnames = this.getTabNames();
   	}
   	let slctn = [];
   	
      let curPath = this.props.location.pathname;
      curPath = curPath.slice(1); // curPath starts with a '/'
      
   	for(let i=0; i < tabnames.length; ++i){
   		slctn.push( curPath.startsWith(tabnames[i].replace(' ', '')) );
   	}
   	if ( !slctn.some(t=>t) ){
   		slctn[0] = true;
   	}
   	return slctn;
   }
	componentDidMount() {
		window.scrollTo(0, 0);
		window.addEventListener('scroll', this.onScroll);
		this.lastYScroll = 0;
//		window.scrollY = 0;
	}
	
	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}
   tabClicked(id){
   	console.log('tab clicked: ' + id, '   ', this.state.tabs[id].name);
   	let newstate = this.state;
   	let tabs = this.state.tabs;
   	
   	tabs.forEach((t,i)=>t.selected = (id===i));
   	
   	let trmdName = this.state.tabs[id].name.replace(' ', '');
		this.props.history.push('/' + trmdName);
   	
   	this.setState(newstate);
   }
   onScroll(){
   	let y = window.scrollY;
   	const logohdr = this.logoHeader.current;
   	if (y > 30 && this.lastYScroll <= 30){
   		logohdr.style.opacity = '0';
   		logohdr.classList.add('Hide');
   		logohdr.classList.remove('Show');
   		this.lastYScroll = y;
   	}else if (y <= 30 && this.lastYScroll > 30){
   		logohdr.style.opacity = '100';
   		logohdr.classList.add('Show');
   		logohdr.classList.remove('Hide');
   		this.lastYScroll = y;
   	}
   }
	render() {
		return (
			<div className="App">
				<div className="App-header" ref={this.header}>
						  
					<TabBar tabs={this.state.tabs} tabCallback={this.tabClicked}/>
					
					<div className="LogoHeader" ref={this.logoHeader}>
						<div id="LogoHeaderText" className="MrSoirHeading">Welcome to the World of</div>
						<img id="LogoHeaderImage" src={logo} alt="logo" />
					</div>
						
					<div className="TabBarSeparator"></div>
						
				</div>
				
				<div className="TopMargin">
				</div>
					
				<div className="MainDiv" ref={this.body}>
					<Switch>
						<Route exact path='/' component={MainPage}/>
						<Route exact path='/Main' component={MainPage}/>
						<Route exact path='/Ballin' component={Ballin}/>
						<Route exact path='/Kubu' component={Kubu}/>
						<Route exact path='/ReferenceManager' component={ReferenceManager}/>
						<Route exact path='/Notes' component={Notes}/>
						<Route exact path='/SlideShow' component={SlideShow}/>
					</Switch>
				</div>
				
				<div className="ContactInfoBox">
					<div className="ContactHeading">CONTACT</div>
					_____
					<br/><br/>
					<div className="ContactText">MrSoir</div>
					<div className="ContactText">support@MrSoir.com</div>
					<div className="ContactText">Tel. +49 157 703 458 32</div>
				</div>
			</div>
		);
	}
}


export default withRouter(App);
