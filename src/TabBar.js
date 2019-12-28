import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import './TabBar.scss';


function MenuButton({showButton=false,
					onMenuEntered=()=>{},
					onMenuClicked=()=>{}}){
	function genShowBarsStyle(id){
		let style = {
			top: '25%',
			left: '50%',
			width: '80%',
			opacity: '1',
			transform: 'translate(-50%, -50%)',
		};
		switch(id){
			case 1:
				style['top'] = '50%';
				break;
			case 2:
				style['top'] = '75%';
				break;
		}
		return style;
	}
	function genHideBarsStyle(id){
		let style = {
			top: '50%',
			left: '50%',
			width: '50%',
		};
		switch(id){
			case 0:
				style['top'] = '50%';
				style['transform'] = 'translate(-50%, -50%) rotate(-45deg)';
				break;
			case 1:
				style['top'] = '50%';
				style['transform'] = 'translate(-50%, -50%) rotate(45deg)';
				break;
			case 2:
				style['opacity'] = '0';
				break;
		}

		return style;
	}

	let btnStyls = [];
	for(let i=0; i < 3; ++i){
		btnStyls.push( showButton ? genShowBarsStyle(i) : genHideBarsStyle(i) );
	}
	return (
		<div className="MenuButtonTB"
				 onMouseOver={onMenuEntered}
				 onClick={onMenuClicked}>
			<div className="MenuButtonItemTB" style={btnStyls[0]}>
			</div>
			<div className="MenuButtonItemTB" style={btnStyls[1]}>
			</div>
			<div className="MenuButtonItemTB" style={btnStyls[2]}>
			</div>
		</div>
	)
}
function MinimizedTabBar({tabs, tabClicked}){
	const mainRef = useRef();
	const menuItemsDiv = useRef();
	const [showMenuItems, setShowMenuItems] = useState(false);

	function _tabClicked(id){
		setShowMenuItems( false );
		if(tabClicked){
			tabClicked(id);
		}
	}

	function onMenuEntered(){
		// if( window.mobilecheck() )return;
		// setShowMenuItems(true);
	}
	function onMenuClicked(){
		console.log('menu clicked!');
		// if( !window.mobilecheck() )return;
		setShowMenuItems(!showMenuItems);
	}
	function hideMenuItemsDiv(){
		const mid = menuItemsDiv.current;
		if(!mid)return;
		mid.style.width = '0px';
		mid.style.border = '0px solid var(--main-bg-color)';
	}
	function showMenuItemsDiv(){
		const mid = menuItemsDiv.current;
		if(!mid)return;
		mid.style.width = '200px';
		mid.style.border = '2px solid var(--main-bg-color)';
	}
	function onMouseMenuItemsLeft(){
		setShowMenuItems(false);
	}

	useEffect(()=>{
		if(showMenuItems){
			showMenuItemsDiv();
		}else{
			hideMenuItemsDiv();
		}
	}, [showMenuItems]);
	useEffect(()=>{
	}, []);

	return (
		<div className="MinimizedTabBarTB"
				 ref={mainRef}>
			<div className="MenuButtonDivTB">
				<MenuButton onMenuEntered={onMenuEntered}
					onMenuClicked={onMenuClicked}
					showButton={!showMenuItems}
				/>
			</div>
			<div className="MenuItemsDivTB"
					 ref={menuItemsDiv}
					 onMouseLeave={onMouseMenuItemsLeft}>
				<div className="MenuItemsGrid">
					<MenuButton 
						onMenuEntered={onMenuEntered}
						onMenuClicked={onMenuClicked}
						showButton={!showMenuItems}
					/>
					<div className="ListMTB">
						{tabs.map((tab, i)=>{
							return <TabElement key={i}
											isLast={true}
											tab={tab}
											tabid={i}
											tabClicked={_tabClicked}
											selected={(i % 2 ? true : false)}
							/>
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
function TabBar({tabCallback, tabs}){
	const mainRef = useRef();
	const [minimize, setMinimize] = useState( shouldMinimize() );

	function shouldMinimize(){
		const [vw, vh] = [window.innerWidth, window.innerHeight];
		const minDim = 800;
		return vh < minDim || vw < minDim;
	}
	function onResize(){
		setMinimize( shouldMinimize() );
	}

	useEffect(()=>{
		window.addEventListener('resize', onResize);
		return ()=>{
			window.removeEventListener('resize', onResize);
		}
	})

	function tabClicked(tabid){
		tabCallback && tabCallback(tabid);
	}

	function createBigTabBar(){
		return (
			<div className="TabBar HeadingTextSize"
					 ref={mainRef}>
				{tabs.map((tab, i) =>{
					let isLast = (i >= (tabs.length-1));
					return <TabElement key={i}
										isLast={isLast}
										tab={tab}
										tabid={i}
										tabClicked={()=>tabClicked(i)}
										selected={(i % 2 ? true : false)}
					/>
				}
				)}
				<div className="TabSeparator">
				</div>
			</div>
		);
	}
	function createMinimizedTabBar(){
		return (
				<MinimizedTabBar tabClicked={tabClicked}
												 tabs={tabs}
				/>
		);
	}
	return minimize ? createMinimizedTabBar() : createBigTabBar();
}

function TabElement({tab, isLast, tabid, tabClicked=()=>{}, minimized=true}){
	const indicator = React.createRef();

	function tabSelected(){
		const ind = indicator.current;
		if(!ind)return;
		if ( !tab.selected ) {
			ind.classList.add('Selected');
		}else{
			ind.classList.remove('Selected');
		}
	}
	function tabMouseEnter(){
		if ( !tab.selected ) {
			const ind = indicator.current;
			if(!ind)return;
			ind.classList.add('Hovered');
		}
	}
	function tabMouseOut(){
		if ( !tab.selected ) {
			const ind = indicator.current;
			if(!ind)return;
			ind.classList.remove('Hovered');
		}
	}

	let tabLinkClass = "TabLink" + (isLast ? " LastTabElement" : "");
	let tabElementClass = "TabElement HeadingTextSize";
	if(tab.selected){
		tabLinkClass += ' Selected';
		tabElementClass += ' Selected';
	}
	if(minimized){
		tabElementClass += ' Minimized';
	}

	const indctrComp = minimized
		? ''
		: (
			<div className={"TabIndicator" + (tab.selected ? " Selected" : "")}
				ref={indicator}>
			</div>
		);


	return(
	   <div className={tabElementClass}
		 			onClick={()=>tabClicked(tabid)}
					onMouseEnter={()=>tabMouseEnter()}
					onMouseOut={()=>tabMouseOut()} >
    		<div className={tabLinkClass}
    			  key={tabid}
						onMouseEnter={()=>tabMouseEnter()}
						onMouseOut={()=>tabMouseOut()}>
    			{tab.name}
    		</div>
			{indctrComp}
 		</div>
	);
}

export default withRouter(TabBar);
