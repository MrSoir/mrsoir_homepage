import React, {Component} from 'react';
import {Switch, Route, withRouter} from "react-router-dom";
import './App.scss';
import tabs_info from './info.txt';
import TabBar from './TabBar';
import {readTextFile, arraysEqual} from './StaticFunctions';
import MainPage from './main/Main';
import Ballin from './Ballin/Ballin';
import Kubu from './Kubu/Kubu';
import ReferenceManager from './ReferenceManager/ReferenceManager';
import Notes from './Notes/Notes';
import SlideShow from './SlideShow/SlideShow';
import ArduinoFullstack from './ArduinoFullstack/ArduinoFullstack';
import LineAnimation from './LineAnimation/LineAnimation';
import ReactShowCase from './ReactShowCase/ReactShowCase';
import LandingPage from './LandingPage/LandingPage';

class App extends Component {
  constructor() {
    super();

    this.state = {
      tabs: []
    }

    this.tabClicked = this.tabClicked.bind(this);
    this.initTabs = this.initTabs.bind(this);
    this.updateTabSelection = this.updateTabSelection.bind(this);
    this.onPreviewClicked = this.onPreviewClicked.bind(this);
  }
  initTabs() {
    window.hist = this.props.history;

    let txt = readTextFile(tabs_info);

    let tabInfos = txt.split('\n').filter((tn) => !!tn);
    let tabs = tabInfos.map(ti => {
      let [name, path] = ti.split(' | ');
      return {name, path, selected: false};
    });
    // if (tabs.length > 0) {
    //   tabs[0].selected = true;
    // }
    this.setState({tabs: tabs});
    this.updateTabSelection();
  }
  componentDidUpdate(prevProps) {
    //		if (this.props.location !== prevProps.location) {
    this.updateTabSelection();
    //		}
  }
  updateTabSelection() {
    let tabs = this.state.tabs;
    let curRelPath = this.getCurrentRelPath();

    let selectionChanged = false;

    if(!curRelPath){
      // landing page - curRelPath is empty!
      // if(tabs.length > 0 && !tabs[0].selected){
      //   tabs[0].selected = true;
      //   selectionChanged = true;
      // }
    }else{
      tabs.forEach(t => {
        let slctd = curRelPath.startsWith(t.path);
        if (slctd !== t.selected) {
          selectionChanged = true;
        }
        t.selected = slctd;
      });
    }

    if (selectionChanged) {
      this.setState(tabs);
    }
  }
  getCurrentRelPath() {
    return this.props.location.pathname.slice(1);
  }
  componentDidMount() {
    this.initTabs();

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
  }
  tabClicked(id) {
    let tabs = this.state.tabs;

    tabs.forEach((t, i) => t.selected = (id === i));

    // if(!this.state || 
    //    !this.state.tabs ||
    //    !this.state.tabs.length || 
    //     this.state.tabs.length >= id ||
    //    !this.state.tabs[id])return;

    let path = this.state.tabs[id].path;
    this.props.history.push('/' + path);

    this.setState(tabs);
  }
  onPreviewClicked(id){
    this.tabClicked(id);
  }
  render() {
    return (<div className="App">

      <div className="LinaAnimationDivApp">
      {
        window.mobilecheck()
          ? ""
          : ''//<LineAnimation/>
      }
      </div>
      <div className="ContentDivApp">
        <div className="App-header">
          <TabBar tabs={this.state.tabs} tabCallback={this.tabClicked}/>
        </div>

        <div className="MainDivAPP">
          <Switch>
            <Route exact={true} path='/Main' component={MainPage}/>
            <Route exact={true} path='/ReactShowCase' component={ReactShowCase}/>
            <Route exact={true} path='/ArduinoFullstack' component={ArduinoFullstack}/>
            <Route exact={true} path='/Ballin' component={Ballin}/>
            <Route exact={true} path='/Kubu' component={Kubu}/>
            <Route exact={true} path='/ReferenceManager' component={ReferenceManager}/>
            <Route exact={true} path='/Notes' component={Notes}/>
            <Route exact={true} path='/SlideShow' component={SlideShow}/>
            <Route exact={false} path='/' render={()=><LandingPage onPreviewClicked={this.onPreviewClicked}/>}/>
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


    </div>);
  }
}

export default withRouter(App);
