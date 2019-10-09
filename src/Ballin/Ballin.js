import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import SlideShow from '../SlideShow';
import CarrouselDiaShow from '../CarrouselDiaShow/CarrouselDiaShow';
import meta_info from './info.txt';
import './Ballin.css';
import CurtainButton from '../CurtainButton';

class Ballin extends Component {
  constructor(props) {
    super(props);

    this.onImageClick = this.onImageClick.bind(this);
    this.launchBallinGL = this.launchBallinGL.bind(this);
    this.downloadBallinOriginal = this.downloadBallinOriginal.bind(this);

    this.BallinMainRef = React.createRef();
    this.BallinOrigCarrouselDiv = React.createRef();
    this.BallinGLCarrouselDiv = React.createRef();

    const {ballin_gl_pics, ballin_orig_pics} = this.evalBallinImages();
    this.state = {
      ballin_gl_pics,
      ballin_orig_pics,
      glCarrouselAspectRatio: [
        16, 9
      ],
      origCarrouselAspectRatio: [4, 3]
    };
  }
  launchBallinGL() {
    window.location.href = 'https://ballingl.firebaseapp.com/';
  }
  downloadBallinOriginal() {
    window.open('https://github.com/MrSoir/Ballin_2D/archive/master.zip', '_blank');
  }
  evalBallinImages() {
    let txt = readTextFile(meta_info);

    let info_lines = txt.split('\n').filter((tn) => !!tn);
    // first line in info_lines gives the number of images to render for Ballin'GL
    let ballinGL_imgCount = parseInt(info_lines[0].split(' ').filter(s => !!s).slice(-1)[0]);
    let ballinOrig_imgCount = parseInt(info_lines[1].split(' ').filter(s => !!s).slice(-1)[0]);

    let ballin_gl_pics = [];
    let ballin_orig_pics = [];
    let f = (pth) => {
      return {img_path: pth};
    };
    for (let i = 0; i < ballinGL_imgCount; ++i) {
      ballin_gl_pics.push(f(process.env.PUBLIC_URL + '/Ballin/pics/BallinGL_preview_' + i + '.png'));
    }
    for (let i = 0; i < ballinOrig_imgCount; ++i) {
      ballin_orig_pics.push(f(process.env.PUBLIC_URL + '/Ballin/pics/BallinOrig_preview_' + i + '.png'));
    }
    return {ballin_gl_pics, ballin_orig_pics};
  }
  componentDidMount() {
    window.scrollTo(0, 0);

    this.resizeCarrouselDivs();

    try {
      if (ResizeObserver) {
        this.resizeObserver = new ResizeObserver(entries => {
          this.resizeCarrouselDivs();
        });
        this.resizeObserver.observe(this.BallinMainRef.current);
      }
    } catch (error) {
      console.log('ResizeObserver error: ', error);
    }
  }
  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
  resizeCarrouselDivs() {
    const mainDiv = this.BallinMainRef.current;
    const [mdw, mdh] = [mainDiv.offsetWidth, mainDiv.offsetHeight];

    let BallinGLCarrouselDiv = this.BallinGLCarrouselDiv.current;
    let [glw, glh] = [BallinGLCarrouselDiv.offsetWidth, BallinGLCarrouselDiv.offsetHeight];

    let BallinOrigCarrouselDiv = this.BallinOrigCarrouselDiv.current;
    let [origw, origh] = [BallinOrigCarrouselDiv.offsetWidth, BallinOrigCarrouselDiv.offsetHeight];

    let glTarh = 0;
    let origTarh = 0;

    let glStyle = {};
    let origStyle = {};

    glTarh = (glw - 20) * 0.6 / this.state.glCarrouselAspectRatio[0] * this.state.glCarrouselAspectRatio[1];
    glStyle = {
      height: `${glTarh}px`
    };

    origTarh = (origw - 20) * 0.6 / this.state.origCarrouselAspectRatio[0] * this.state.origCarrouselAspectRatio[1];
    origStyle = {
      height: `${origTarh}px`
    };

    Object.assign(BallinGLCarrouselDiv.style, glStyle);
    Object.assign(BallinOrigCarrouselDiv.style, origStyle);
  }
  onImageClick(id) {
    this.launchBallinGL();
  }
  render() {
    let infoText_GL = <div className="ProgramDescription BallinInfoMargins">Ballin' GL is a browser game written in JavaScript. Although the gameplay is 2D, the game is rendered in 3D powered by the WebGL2 technology. The game is totally free, there are no in-app-purchases or advertisement. The reason I wrote this game was to learn programming 3D-graphics using WebGL and to improve my skills in linear algebra.
      <br/><br/>
      Ballin' GL runs on most common browsers: Chrome, Chromium, Firefox, Opera, Safari. Ensure you're running your browsers latest version. Older browser versions most likely won't support WebGL2 (unfortunately Ballin' GL does not run on Mircosoft's IE and Edge - as far as I know these browsers don't support WebGL2 at all).
      <br/><br/>
      Go get the most fun out of Ballin' GL I recommend playing it on your smartphone. On smartphones the game is controlled by the smartphone's motion sensors &#x2192; the device as a whole becomes the controller!</div>;

    let infoText_Orig = <div className="ProgramDescription BallinInfoMargins">I wrote the first version of Ballin' in Java in the course of a college assignment. Compared to the original Ballin', Ballin'GL is much more advanced. Ballin'GL is running a 3D-engine with lightning effects and other fancy stuff. But sometimes the beauty lies in it's simplicity.</div>;

    return (<div className="Ballin" ref={this.BallinMainRef}>
      <div className="ProgramHeading">Ballin' GL</div>

      <div className="CarrouselDiaShowBallin" ref={this.BallinGLCarrouselDiv}>
        <CarrouselDiaShow imgPaths={this.state.ballin_gl_pics.map(pathObj => pathObj.img_path)} autoplay={true} aspectRatio={this.glCarrouselAspectRatio}/>
      </div>

      {infoText_GL}

      <CurtainButton text="Click me to play Ballin' GL!" onClick={this.launchBallinGL}/>

      <div className="BallinSeparator"/> {/* -------------------- */}

      <div className="ProgramHeading">Ballin' Original</div>

      <div className="CarrouselDiaShowBallin" ref={this.BallinOrigCarrouselDiv}>
        <CarrouselDiaShow imgPaths={this.state.ballin_orig_pics.map(pathObj => pathObj.img_path)} autoplay={true} aspectRatio={this.origCarrouselAspectRatio}/>
      </div>

      {infoText_Orig}

      <CurtainButton text="Download" onClick={this.downloadBallinOriginal}/>
    </div>);
  }
}

export default withRouter(Ballin);
