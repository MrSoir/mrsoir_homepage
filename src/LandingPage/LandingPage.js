import React, { useState, useEffect, useRef } from 'react';
import {FragmentImagePreview, genFadingComponent, genLabelComp, LabelComp} from '../FragmentImage/FragmentImagePreview';
import loadPreviews from '../main/MainPreviewTextLoader';
import './LandingPage.scss';


function LandingPage({onPreviewClicked}){

  const [previewComponents, setPreviewComponents] = useState([]);
  const [previews, setPreviews] = useState([]);

  function evalOffsets(id){
    switch(id){
      case 1:
        return [[0, 35, 50, 0], [0, 35, 50, 100], [false, true], [50, 25], false]; // react
      case 2:
        return [[50, 50], [50, 50, 0, 100], [true, true], [50, 25], true]; // arduino
      case 3:
        return [[50, 50], [50, 50, 0, 100], [true, true], [50, 25], true]; // Ballin
      case 4:
        return [[20, 40], [20, 40, 0, 100], [false, true], [50, 25], false]; // slideshow
      case 5:
        return [[50, 40], [50, 40, 0, 100], [true, true], [50, 25], true]; // Kubu
      case 6:
        return [[0, 60, 100], [0, 60, 100, 100], [false, true], [50, 25], false]; // notes
      case 7:
        return [[50, 50], [50, 50, 0, 100], [true, true], [50, 25], true]; // reference manager
    }
  }
  function genPreviewComponentFromPrevProgram(prevProgrm, id){
    let offsets = evalOffsets(id);
    let [x0prct, y0prct, x0px=0, y0px=0] = offsets[0];
    let [x1prct, y1prct, x1px=0, y1px=0] = offsets[1];
    const [centralizeX, centralizeY]     = offsets[2];
    const [fontSizeHdng, fontSizeDescr]  = offsets[3];
    const textAlignCenter = offsets[4];
    const headingLbl = genFadingComponent(genLabelComp(prevProgrm.heading, fontSizeHdng, textAlignCenter),      x0prct, y0prct, x0px, y0px, (id+1)%2, centralizeX, centralizeY);
    const descrLbl   = genFadingComponent(genLabelComp(prevProgrm.description, fontSizeDescr, textAlignCenter), x1prct, y1prct, x1px, y1px, (id+1)%2, centralizeX, centralizeY);
    return [headingLbl, descrLbl];
  }
  function genInfoPreviewComponents(){
    const hdngTxt = 'Welcome!';
    const dscrTxt = `
			The following shows some of the programs/projects that I've created
			over the past years. I published most of these projects on
			dedicated platforms. This website is created with the React.js-library
			and mainly serves me to test concepts of modern
			single page application development.
		`;
    const headingLbl = genFadingComponent(genLabelComp(hdngTxt, 50), 50, 20, 0, 0, true, true, true);
    const descrLbl = genFadingComponent(genLabelComp(dscrTxt, 20), 50, 20, 0, 50, true, true, false);
    return [headingLbl, descrLbl];
  }

  function loadPreviewTexts(){
    const prev_programs = loadPreviews();
    setPreviews( prev_programs );
    const previewData = prev_programs.map((prgrm, id)=>{
      return genPreviewComponentFromPrevProgram(prgrm, id+1);
    });
    previewData.unshift( genInfoPreviewComponents() );
    setPreviewComponents( previewData );
  }

  function _onPreviewClicked(id){
    if(id === 0){
      window.hist.push('/main');
    }else{
      const relURL = previews[id-1].url;
      if (!!window.hist)
      {
        window.hist.push('/' + relURL);
      }
    }
  }


  useEffect(()=>{
    loadPreviewTexts();
  }, []);

  const previewCount = 8;

  function genImgPaths(){
    const imgPaths = [];
    for(let i=0; i < previewCount; ++i){
      imgPaths.push( process.env.PUBLIC_URL + '/LandingPage/pics/img' + i + '.jpg' );
    }
    return imgPaths;
  }

  const imgPaths = genImgPaths();

  return (
    <div className="MainLP">
      <FragmentImagePreview imgPaths={imgPaths}
                            imgLabels={previewComponents}
                            onPreviewClicked={_onPreviewClicked}
      />
    </div>
  );
}

export default LandingPage;
