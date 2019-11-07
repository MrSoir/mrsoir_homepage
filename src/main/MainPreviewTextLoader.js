import {readTextFile} from '../StaticFunctions';
import meta_info from './info.txt';


function getIndicators(programs){
	let f = (progrm)=>{
		let text_path = process.env.PUBLIC_URL + '/MainPage/indicators/' + progrm + '.txt';
		let txt = readTextFile(text_path);
		let lines = txt.split('\n').filter((tn)=>!!tn);
		return {
			heading: lines[0],
			description: lines.slice(1).join('')
		};
	};
	let indicators = programs.map(p=>f(p));
	return indicators;
}
function loadPreviews(){
	let txt = readTextFile(meta_info);
	let programs = txt.split('\n').filter((tn)=>!!tn).map((tn)=>{
		let splt = tn.split('_|_').map(v=>v.trim());
		let name = splt[0];
		let url = splt.length > 1 ? splt[1] : name.replace(' ', '');
		return {
			name,
			url
		};
	});

	let f = (pi) => {
		let text_path = process.env.PUBLIC_URL + '/MainPage/texts/' + pi.name + '.txt';
		let prev_text = readTextFile(text_path);
		return {name: pi.name,
					url: pi.url,
					image_path: process.env.PUBLIC_URL + '/MainPage/pics/' + pi.name + '.png',
					text: prev_text };
	};
	let prev_programs = programs.map( p => f(p) );

	let indicators = getIndicators(programs.map(p=>p.name));
	prev_programs.forEach((p, id)=>{
		p['heading'] = indicators[id].heading;
		p['description'] = indicators[id].description;
	});

	return prev_programs;
}

export default loadPreviews;
