import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';
import './ArduinoFullstack.css';
import CurtainButton from '../CurtainButton';
import ReactPlayer from 'react-player';

class ArduinoFullstack extends Component {
  constructor(props) {
    super(props);

    this.goToArduinoHomepage = this.goToArduinoHomepage.bind(this);

    this.state = {}
  }
  goToArduinoHomepage() {
    window.location.href = 'https://create.arduino.cc/projecthub/MrSoir/fullstack-restful-m-ern-irrigation-system-159338';
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    let video_path = process.env.PUBLIC_URL + '/ArduinoFullstack/Fullstack.mp4';
    let video_img_path = process.env.PUBLIC_URL + '/ArduinoFullstack/irrigation.mp4';

    let arduinosDesrcp = (<ul className="ulAFS">
      <li className="liAFS">
        an irrigation system that takes care of 7 plants on my balcony
      </li>

      <li className="liAFS">
        two WS2812b LED-strips that illuminate my living room.
      </li>
    </ul>);
    let arduinoCornerstones = (<ul className="ulAFS">
      <li className="liAFS">
        <div className='CornerstonesNameAFS'>
          Node.js/Express.js server:
        </div>
        <div className='CornerstonesDescrAFS'>
          The server is running on a RaspberryPi (Zero W), saves all settings in a MongoDB database and forwards any changes in settings to the respective microcontrollers.
        </div>
      </li>

      <li className="liAFS">
        <div className='CornerstonesNameAFS'>
          Front-end:
        </div>
        <div className='CornerstonesDescrAFS'>
          a React.js based website. On the website you can control the microcontrollers and track sensor data in real time.
        </div>
      </li>

      <li className="liAFS">
        <div className='CornerstonesNameAFS'>
          WiFi-capable Microcontrollers
        </div>
        <div className='CornerstonesDescrAFS'>
          that make the devices 'smart' using relays and several sensors (moisture sensors, motion sensors etc.)
        </div>
      </li>
    </ul>);
    let disadvantages = (<ul id="DisadvantagesUlAFS" className="ulAFS">
      <li className="liAFS DisadvantagesLiAFS">
        <div className='CornerstonesDescrAFS'>
          Whenever you unplug an Arduino from the power supply, all settings will be lost and you have to re-configure the Arduino with the smartphone.
        </div>
      </li>

      <li className="liAFS DisadvantagesLiAFS">
        <div className='CornerstonesDescrAFS'>
          If you want to control the Arduino with multiple devices (smarphone, latop, tablet), you have to install and configure the app on every device. And you will probably run into compatibility issues - one app won't work on all of your devices (MS Windows computer vs Android Phone vs Mac Os Tablet).
        </div>
      </li>

      <li className="liAFS DisadvantagesLiAFS">
        <div className='CornerstonesDescrAFS'>
          There's no chance to keep the devices synchronized.
        </div>
      </li>
    </ul>);
    let advantages = (<ul id="DisadvantagesUlAFS" className="ulAFS">
      <li className="liAFS AdvantagesLiAFS">
        <div className='CornerstonesDescrAFS'>
          The first thing an Arduino does when it (re)boots is to automatically and autonomously request it's settings from the server.
        </div>
      </li>

      <li className="liAFS AdvantagesLiAFS">
        <div className='CornerstonesDescrAFS'>
          Because everything is controlled over the React.js website there's no need to install any software on the devices. Additionally, you don't need to update the devices' software after modifying the website or the server software.
        </div>
      </li>

      <li className="liAFS AdvantagesLiAFS">
        <div className='CornerstonesDescrAFS'>
          All devices are kept synchronzied. Even when multiple devices simultaneously operate on the website, updated data is instantaneously pushed to each device whenever any device modifies settings using technologies like Socket.io.
        </div>
      </li>
    </ul>);
    let infoText = <div className="ProgramDescription ArduinoFullStackInfoMargins">
      After several plants on my balcony died because I insufficiently irrigated them, I decided to create an automated irrigation system. Therefore I implemented a server-based approach to control several Microcontrollers in my household. The server runs on a Raspberry Pi Zero W. Arduino-compatible microcontrollers operate devices like a water pump and several sensors. So far, I've installed 2 Wemos D1 mini microcontrollers that control {arduinosDesrcp}
      This is a three-tier system: {arduinoCornerstones}
      The cool thing about this system is it let's you control and monitor all microcontrollers from any device that is connected to your local WiFi (laptop, smartphone, tablet, etc.). Usually Arduinos are controlled over the smartphone using thrid party apps link Blynk. This has several disadvantages. {disadvantages}
      My MERN implementation overcomes all these issues. {advantages}
      <div className="TextBlockAFS">
        I put emphasis on writing clean, modular code. The code that runs on the Arduinos is modularized and much of the code is exported to external libraries. The microcontrollers share a large portion of code despite the entirely different requirements (irrigation vs. LED-strips). Therefore the system is easily extensible and makes adding additional microcontrolers a breeze. You can use my code as is or as a starting point to implement your own custom solution.
      </div>
    </div>;

    return (<div className="ArduinoFullStack">
      <div className="ProgramHeading">Full stack RESTful MERN Arduino infrastructure</div>

      {infoText}

      <div id="VideoASF">
        <ReactPlayer width='100%' height='100%' playing="playing" url="https://youtu.be/O4mRwfDxEPg"/>
      </div>
      <div id="VideoDescriptionASF">
        a short video demonstrating the most siginificant features of my server-client based approach
      </div>

      <div id="DocBtnDescrAFS" className="ProgramDescription ProgramDescriptionAFS">
        I published a detailed documentation on the official Arduino projecthub:
      </div>

      <div id="DocsBtnAFS">
        <CurtainButton text="go to detailed documentation" onClick={this.goToArduinoHomepage}/>
      </div>
    </div>);
  }
}

export default withRouter(ArduinoFullstack);
