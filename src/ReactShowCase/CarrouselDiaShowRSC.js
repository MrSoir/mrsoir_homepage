import React, {Component} from 'react';
import Carousel from '../CarouselDiaShow/Carousel';
import './CarrouselDiaShowRSC.css';

class CarrouselDiaShowRSC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stopAnimation: false
    };
  }
  generateImagePaths() {
    // let imgGenerator = (id) => process.env.PUBLIC_URL + '/pics/testImgs/test' + id + '.png';
    let imgGenerator = (id) => process.env.PUBLIC_URL + '/SlideShow/pics/HippoPreview' + id + '.jpg';
    let imgPaths = [];
    for (let i = 0; i < 6; ++i) {
      imgPaths.push(imgGenerator(i));
    }
    return imgPaths;
  }
  render() {
    const heading = 'Carousel Image Gallery';
    const description = <div>
      This responsive carousel image gallery uses a canvas to render the images.<br/>
      The user can click on the images to scroll back and forth and let the carousel rotate automatically.<br/>
      You can specify the rotation speed and the image ratio. In the demo the ratio is set to 16:9. The images are automatically resized to retain the ratio whenever the carousel-component is resized.<br/>
      You can jump to a specific image by clicking on the respective indicator at the bottom section of the carousel.
    </div>;

    return (<div id="CarrouselDiaShoMainDivwRSC">
      <div id="HeadingCDS" className="HeadingRSC">
        {heading}
      </div>
      <div id="CarouselDivRSC">
        <Carousel imgPaths={this.generateImagePaths()}
                  stopAnimation={this.state.stopAnimation}
                  imgRatio={ {w:16, h:9} }/>
      </div>
      <div id="DescriptionCDS" className="DescriptionRSC">
        {description}
      </div>
      <div id="SettingsCDS"></div>
    </div>);
  }
}

export default CarrouselDiaShowRSC;
