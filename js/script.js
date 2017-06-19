
var $j  = jQuery.noConflict();

/*==========================================
=            Defining Variables            =
==========================================*/
var app = {
	vars : null,
};
app.vars = $j.extend( {}, app.vars, {

	// Global Variables
	temp                   : {},
	ieClass                : 'ie',
	mobileClass            : 'mobile',
	bodyReachedTopClass    : 'reached-top',
	bodyReachedBottomClass : 'reached-bottom',
	globalActiveClass      : 'active',
	homePageClass          : 'home_page',
	lastScrollTop          : 0,
	mediaBreakPoints       : {'tablet' : 992,},
	keys                   : {37 : 1, 38 : 1, 39 : 1, 40 : 1},
	
	
	//Global Elements
	contentWrapperElement : $j('.content_wrapper'),
	pageTitleWrapper      : $j('.page_title_wrapper'),
	pageTitleText         : $j('.page_title_wrapper .title_text'),
	pageTitleLine         : $j('.page_title_wrapper .title_underline'),
	preloaderWrapper      : $j('.preloader_wrapper'),
	secondFloor           : $j('.home_second_floor'),
	footer                : $j('footer'),


	// Full Page Slide Elements
	fullPageSliderWrapper   : $j('.fullpage_slider_wrapper'),
	fullPageSliderContainer : $j('.fullpage_slider_wrapper .owl-carousel'),
	fullpageSliderNextClass : '.slide_next_trigger',
	fullpageSliderPrevClass : '.slide_prev_trigger',
	noSlideOnElement       : '.prevent_slide',


	//Menu Elements
	menuTrigger : $j('.menu_trigger'),
	menuWrapper : $j('.menu_main_wrapper'),


	//Home Elements
	verticalSlider          : '.vertical_slider_wrapper .swiper-container',
	verticalPaginationClass : '.home_news_section .swiper-pagination',


	//Product Page Elements
	thumbnailsSlider : '.thumbnails_wrapper .swiper-container',
	thumbsUp         : '.thumbs_up',
	thumbsDown       : '.thumbs_down',


});

/*==========================================
=            Defining Functions            =
==========================================*/

app.fn = $j.extend( {}, app.fn, {


	/*
	 * Common
	 */

	init : function () {

		app.fn.fullPageSliderFn();
		app.fn.verticalSliderFn();
		app.fn.thumbnailSliderFn();
		app.fn.menuFn();
		app.fn.fullPageScrollFn();
		app.fn.collectionFn();
		app.fn.productFn();
		app.fn.locatorFn();

	},

	setupEmitter : function () {

		function Emitter () {}
		jQuery.extend ( Emitter.prototype, jQuery.eventEmitter );
		app.emitter = new Emitter();

	},

	isMobile : function () {

		return $j( 'html' ).hasClass ( app.vars.mobileClass );

	},

	isIE : function () {

		return $j( 'html' ).hasClass ( app.vars.ieClass );

	},

	watchScroll : function () {

		app.vars.lastScrollTop = $j(window).scrollTop();

	},

	preloaderFn : function () {
		var loadingTl = new TimelineMax();
		homeIntroTl = new TimelineMax({
			paused : true,
			onStart : function() {
				console.log('intro here');
			},
		});

		loadingTl.set('.content_wrapper', {
			force3D: true,
		})
		.from('.v_line', 0.8, {
			height : '0px',
			ease: Expo.easeInOut
		})
		.from('.content_wrapper', 1.2, {
			width : '3px',
			ease : Expo.easeInOut,
		}, "+=0.3")
		.to('.content_wrapper .v_line', 0.5, {
			css: {
				background : 'rgba(255,255,255,0.7)',
				opacity: 0,
			},
		}, "-=0.7")
		.from('.content_wrapper img', 2.5, {
			x: '-70%',
			opacity: 0,
			ease: Expo.easeInOut,
		}, "-=1.8")
		.staggerFrom(['.spinner_wrapper', '.loading_text'], 1, {
			x: '-50px',
			opacity: 0,
		}, 0.1, "-=1.5")
		.set('.loading_text', {
			css:{
				animation: 'alpha 2s infinite ease-in-out',
			}
		});
		preloaderDelay = loadingTl.duration();
		loadedTl = new TimelineMax({
				paused: false,
				delay: preloaderDelay+2,
				onStart: function (){
					if($j('.fullpage_slider_wrapper').length){
						$j("#"+titleId).data('timeline').duration(0.01).reverse();
					}
				},
				onComplete: function () {
					if($j('.fullpage_slider_wrapper').length){
						$j("#"+titleId).data('timeline').duration(titleTl.duration()).restart();
					}
					if($j('body').hasClass('product_list_page')){
						collectionTilesTl.play();
					}
					if($j('body').hasClass('product_page')){
						productTl.play();
					}
					if($j('body').hasClass('locator_page')){
						locatorTl.play();
					}
					homeIntroTl.play();
				},
			});

		loadedTl.staggerTo(
			[
				'.content_wrapper img',
				'.spinner_wrapper',
				'.loading_text',
			], 1, {
				css:{
					y: '-100px',
					opacity: 0,
				},
				ease: Power4.easeOut,
			}, 0.08)
		.to('.loading_text', 0.4, {
			height: '0px',
			ease: Power4.easeOut,
		}, '-=0.8')
		.to('.loading_wrapper', 0.7, {
			height: '0px',
			ease: Power4.easeIn,
		}, "-=0.98");

		homeIntroTl.from('.slider_controll', 1.2, {
			opacity : 0,
			ease: Expo.easeInOut,
		})
		.staggerFrom(['.logo_wrapper', '.menu_trigger_container', '.lang_links_container', ], 1.5, {
			opacity: 0,
			x: '-20px',
			ease: Expo.easeInOut,
		}, 0.2, '-=1.2')
		.staggerFrom('.social_item', 1, {
			opacity: 0,
			y: '-50px',
			ease: Expo.easeInOut,
		}, 0.08, '-=1.5');

	},

	
	/*===========================================
	=            		Modules                 =
	===========================================*/


	fullPageSliderFn : function () {
		
		if( app.vars.fullPageSliderWrapper.length ){

				fpSlider = app.vars.fullPageSliderContainer;
				nextButton = $j(app.vars.fullpageSliderNextClass);
				prevButton = $j(app.vars.fullpageSliderPrevClass);
				activeSlide = '';
				titleId = '';
				slideCount = '';

			fpSlider.owlCarousel({
				items : 1,
				loop : true,
				callbacks : true,
				autoplay : false,
				mouseDrag : false,
				touchDrag : false,
				pullDrag : false,
				animateOut: 'fadeOut',
				animateIn: 'fadeIn',

				onInitialize : function() {
				},

				onInitialized : function () {

					var titleSplit = new SplitText('.fullpage_slider_wrapper .slide_title', {
						type : "words"
					});

					slideCount = 1;

					$j('.fullpage_slider_wrapper .slide-item').each( function (){

						slideTitle = $j(this).find('.slide_title');
						slideTitle.find('div').addClass('slider-title-words');
						slideTitle.attr('id', 'title-num-'+slideCount);				
						slideCount++;

						titleTl = new TimelineMax({
							paused : true,
						});

						var thisSlideWords = slideTitle.find('.slider-title-words');

						titleTl.staggerFromTo(thisSlideWords, 1.2,
						{
							overflow : 'hidden',
							x : '100px',
							opacity : 0,
						},
						{
							x : '0px',
							opacity : 1,
							ease : Expo.easeInOut,
						}, 0.1);

						$j(slideTitle).data('timeline', titleTl);

					});
					
					titleId = $j('.fullpage_slider_wrapper .active')
							.find('.slide_title')
							.attr('id');

				},

				onChange : function(owl) {

					 setTimeout(function(){

					 	titleId = $j('.fullpage_slider_wrapper .owl-item.active')
							.find('.slide_title')
							.attr('id');

						$j("#"+titleId).data('timeline').restart();

					}, 500);

				},

			});

			nextButton.click(function() {

				$j("#"+titleId).data('timeline').reverse();
				$j("#"+titleId).data('timeline').eventCallback("onReverseComplete", function(){
					fpSlider.trigger('next.owl.carousel');
				});

			});

			prevButton.click(function() {

				$j("#"+titleId).data('timeline').reverse();
				$j("#"+titleId).data('timeline').eventCallback("onReverseComplete", function(){
					fpSlider.trigger('prev.owl.carousel');
				});
			    

			});
		}
	},

	verticalSliderFn : function () {
		if( app.vars.verticalSlider.length ){
			var verticalSwiper = new Swiper( app.vars.verticalSlider, {
				pagination: app.vars.verticalPaginationClass,
		        paginationClickable: true,
		        direction: 'vertical',
		        mousewheelControl : false,
		        // mousewheelReleaseOnEdges: true,
		        paginationBulletRender : function (swiper, index, className) {
		        	var decoyIndex = index+1;
		        	if ( decoyIndex < 10 ){
		        		decoyIndex = '0' + decoyIndex;
		        	}
		            return '<span class="' + className + '">' + decoyIndex + '</span>';
		        },
			});
		}
	},

	menuFn : function () {
		var trigger = app.vars.menuTrigger;
		var wrapper = app.vars.menuWrapper;
		var body = $j('body');
		menuTl = new TimelineMax({
			paused : true,
		});

		menuTl.set('.form_inputs_container', {
			css: {
				overflow: 'hidden',
			}
		})
		.set('.menu_main_wrapper', {
			display: 'block'
		})
		.fromTo('.menu_main_wrapper', 0.6,{
			y:'-50%',
		}, {
			y: '0%',
			opacity: 1,
			ease: Expo.easeInOut,
		})
		.from('.form_header', 1, {
			width: '0px',
			ease: Expo.easeInOut,
		},'-=0.5')
		.staggerFrom($j('.form_header').children(), 1, {
			x: '-40px',
			opacity: 0,
			ease: Expo.easeInOut,
		}, 0.1, '-=0.7')
		.from('.form_inputs_container', 1, {
			height : '0px',
			ease: Expo.easeInOut,
		}, '-=0.8')
		.from('.address_block', 0.7, {
			opacity: 0,
		}, '-=0.5')
		.staggerFrom('.input_wrapper', 1, {
			y: '-20px',
			opacity: 0,
			ease: Expo.easeInOut,
		}, 0.1, '-=0.7')
		.staggerFrom('.link_item', 2, {
			opacity: 0,
			x: '30px',
			ease: Expo.easeInOut,
		}, 0.1, '-=2.2')
		;

		trigger.on('click', function () {
			if (body.hasClass('locator_page')){
				$j('header').fadeToggle('none');
			}
			trigger.toggleClass('open_menu_trigger');
			if(wrapper.hasClass('open')){
				menuTl.reverse();
				wrapper.removeClass('open');
			}
			else{
				menuTl.restart();
				wrapper.addClass('open');
			}
			body.toggleClass('noOverflow');
			// wrapper.fadeToggle('fast');

		});

	},

	fullPageScrollFn : function () {
		if( $j('#fullpage').length ){
			$j('#fullpage').fullpage({
				// normalScrollElements : app.vars.noSlideOnElement,
				afterLoad: function(anchorLink, index, direction){
					var activeAnchor = anchorLink;
					if( activeAnchor === 'last-section' ){
						$j('body').addClass(app.vars.bodyReachedBottomClass);
						$j('body').removeClass(app.vars.bodyReachedTopClass);
					}
					else if( activeAnchor === 'first-section' ){
						$j('body').addClass(app.vars.bodyReachedBottomClass);
						$j('body').removeClass(app.vars.bodyReachedBottomClass);
					}
				},
			});
		}
	},



	/*===========================================
	=            Home Page Functions            =
	===========================================*/

	// Home Page Tweens
	sliderTextTweensFn : function () {

	},


	/*===========================================
	=            Product Page Functions         =
	===========================================*/
	thumbnailSliderFn : function () {

		var slider = app.vars.thumbnailsSlider;

		var swiper = new Swiper(slider, {
	        nextButton: app.vars.thumbsDown,
	        prevButton: app.vars.thumbsUp,
	        spaceBetween: 20,
	        direction : 'vertical',
	        slidesPerView : 3,
    	});
	},


	/*===========================================
	=         Products List page Functions      =
	===========================================*/
	collectionFn: function () {
		if($j('body').hasClass('product_list_page')){
			collectionTilesTl = new TimelineMax({
				paused: true,
				onComplete : function(){
					collectionTilesTl.clear();
				},
			});
			collectionTilesTl.set('.cat_menu_wrapper', {
				css:{
					whiteSpace: 'nowrap',
					// overflowY : 'hidden', 
				}
			})
			.from('.cat_menu_wrapper', 1, {
				width: '0px',
				ease: Expo.easeInOut,
			})
			.staggerFrom('.cat_menu_item', 1, {
				y: '-20px',
				opacity: 0,
			}, 0.15, '-=0.7')
			.staggerFrom('.product_list_wrapper .col', 0.7, {
				y: '50px',
				opacity: 0,
			}, 0.1, '-=1');
		}
	},


	/*===========================================
	=        Products Single page Functions     =
	===========================================*/
	productFn : function () {
		if($j('body').hasClass('product_page')){
			productTl = new TimelineMax({
				paused: true,
			});
			productTl.set('.cat_menu_wrapper', {
				css:{
					whiteSpace: 'nowrap',
				}
			})
			.set('.detail_link', {
				transition: 'none',
			})
			.from('.cat_menu_wrapper', 1, {
				width: '0px',
				ease: Expo.easeInOut,
			})
			.staggerFrom('.cat_menu_item', 1, {
				y: '-20px',
				opacity: 0,
			}, 0.15, '-=0.7')
			.staggerFrom('.thumbnail', 0.7, {
				opacity: 0,
			}, 0.1, '-=1.3')
			.from('.thumbs_up', 0.5, {
				opacity: 0,
				// y: '-20px',
			}, '-=1.2')
			.from('.thumbs_down', 0.5, {
				opacity: 0,
				// y: '20px',
			}, '-=1.2')
			.from('.big_img_wrapper', 1.2, {
				opacity: 0,
				x: '40px',
				ease: Expo.easeInOut,
			}, '-=1.1')
			.staggerFrom(['.product_detail .title', '.product_detail .model', '.product_detail .brief'], 1.5, {
				opacity: 0,
				x: '-40px',
				ease: Expo.easeInOut,
			}, 0.1, '-=1.3')
			.staggerFrom('.detail_link', 1, {
				opacity: 0,
				y: '-15px',
			}, 0.3, '-=1')
			.set('.detail_link', {
				transition: 'all 300ms',
			})
			;
		}
	},


	/*===========================================
	=        Locator page Functions     =
	===========================================*/
	locatorFn : function () {
		if($j('body').hasClass('locator_page')){
			locatorTl = new TimelineMax({
				paused: true,
			});
			locatorTl.set('main', {
				perspective: 2000,
			})
			.from('.map_filter_wrapper', 1, {
				opacity: 0,
				rotationY: 90,
				ease: Expo.easeInOut,
			})
			;
		}
	},

});



/*=========================================
=            Calling Functions            =
=========================================*/


/**
 *
 * Document Ready
 *
 **/


;( function() {

	app.fn.preloaderFn();
	app.fn.init();

}());



/**
 *
 * Registered Events
 *
 **/

$j( window ).on ({

	'hashchange'                : function ( e ) {

	},

	'load'                      : function ( e ) {

	},

	'scroll'                    : function ( e ) {
		
		app.fn.watchScroll();

	},

	'resize'                    : function ( e ) {

	},

	'mousemove'                 : function ( e ) {

	},

	'mouseup'                   : function ( e ) {

	},

	'keypress'                  : function ( e ) {

	},

	'keydown'                   : function ( e ) {

	},

	'keyup'                     : function ( e ) {

	},

	'mousewheel DOMMouseScroll' : function ( e ) {

	}

});

/**
 *
 * Custom Events
 *
 **/

// app.emitter.on ({
	
// });
