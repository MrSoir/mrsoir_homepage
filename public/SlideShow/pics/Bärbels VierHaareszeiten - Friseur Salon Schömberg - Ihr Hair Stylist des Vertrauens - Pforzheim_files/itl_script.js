/**
 *------------------------------------------------------------------------------
 * @package       Menz Saloon By iThemesLab!
 *------------------------------------------------------------------------------
 * @copyright     Copyright (C) 2013-2016 iThemesLab.com. All Rights Reserved.
 * @Link:         http://ithemeslab.com
 */


( function ( $ ) {
	"use strict";

	//Preloader Start
	$( window )
		.load( function () {
			$( '#preloader' )
				.fadeOut( 'slow', function () {
					$( this )
						.remove();
				} );
		} );
	//Preloader End
	//Fixed Navigation on Scroll Start
	$( window )
		.on( 'scroll', function () {
			if ( $( window )
				.scrollTop() > 55 ) {
				$( '#t3-mainnav' )
					.addClass( 'navbar-fixed-top' );
				$( '#back-to-top' )
					.addClass( 'reveal' );
			} else {
				$( '#t3-mainnav' )
					.removeClass( 'navbar-fixed-top' );
				$( '#back-to-top' )
					.removeClass( 'reveal' );
			}
		} );
	//Fixed Navigation on Scroll Ends


	//Popover
	$( '[data-toggle="popover"]' )
		.popover();

	$( document )
		.ready( function () {


			//back to top button start
			$( '#back-to-top' )
				.on( 'click', function () {
					$( "html, body" )
						.animate( {
							scrollTop: 0
						}, 1000 );
					return false;
				} );
			//back to top button end

		} );

} )( jQuery );
