import React, { Component } from 'react';
import CarrouselDiaShow from '../CarrouselDiaShow/CarrouselDiaShow';
import './CarrouselDiaShowRSC.css';


class CarrouselDiaShowRSC extends Component{
	constructor(props){
		super(props);

		this.state = {
			autoplay: false
		};
	}
  generateImagePaths(){
    // let imgGenerator = (id) => process.env.PUBLIC_URL + '/pics/testImgs/test' + id + '.png';
    let imgGenerator = (id) => process.env.PUBLIC_URL + '/SlideShow/pics/HippoPreview' + id + '.jpg';
    let imgPaths = [];
    for(let i=0; i < 6; ++i){
      imgPaths.push( imgGenerator(i) );
    }
    return imgPaths;
  }
	render(){
		const heading = 'Carousel Image Gallery';
		const description = <div>
			This responsive carousel image gallery exclusively uses html-image-tags. It
			does not use a canvas to render the images.<br/>
			It uses 5 image-tags: 3 are visible, 2 are used for caching.
			You can auto-rotate the carrousel and/or rotate the carousel left (right)
			by clicking on the left (right) aligned image.<br/>
			You can specify the rotation speed and the images' aspect ratio. In the demo the
			ratio is set to 16:9. The images are automatically resized to retain the aspect ratio
			whenever the carousel-component	is resized. It therefore relies on the ResizeObserver-interface.
			Unfortunately this interface isn't available on Safari and IE/Edge and Android Firefox as of
			this writing.<br/>
		You can jump to an image by clicking on the respective round indicator at the bottom
			of the carousel image gallery.
		</div>;

		return (
			<div id="CarrouselDiaShoMainDivwRSC">
				<div id="HeadingCDS"
             className="HeadingRSC">
					{heading}
				</div>
				<div id="DescriptionCDS"
             className="DescriptionRSC">
					{description}
				</div>
        <div id="CarrouselDiaShowRSC">
  				<CarrouselDiaShow imgPaths={this.generateImagePaths()}
                            autoplay={this.state.autoplay}
														aspectRatio={[16,9]}
          />
				</div>
				<div id="SettingsCDS">
        </div>
			</div>
		);
	}
}

export default CarrouselDiaShowRSC;
