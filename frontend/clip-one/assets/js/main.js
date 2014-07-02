var win = $(window), body = $('body'), scroll_top = win.scrollTop(), screen_height = win.height(), screen_width = win.width(), navbar_height = $('.navbar').outerHeight(), logo_font_size = Math.ceil(parseInt($('.navbar-brand').css('font-size'))), min_height = 40, size = [], navigation_position_top = $('.navbar').position().top, navbar = $('.navbar'), navbar_brand = $('.navbar-brand'), isMobile = false;
// Debounce Function
(function($, sr) {
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function(func, threshold, execAsap) {
		var timeout;
		return function debounced() {
			var obj = this, args = arguments;

			function delayed() {
				if(!execAsap)
					func.apply(obj, args);
				timeout = null;
			};
			if(timeout)
				clearTimeout(timeout);
			else if(execAsap)
				func.apply(obj, args);
			timeout = setTimeout(delayed, threshold || 100);
		};
	};
	// smartresize
	jQuery.fn[sr] = function(fn) {
		return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
	};
})(jQuery, 'clipresize');
//Main Function
var Main = function() {
	//function to detect mobile or explorer browser and its version
	var runInit = function() {
		if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
			var ieversion = new Number(RegExp.$1);
			if(ieversion == 8) {
				isIE8 = true;
			} else if(ieversion == 9) {
				isIE9 = true;
			}
		};
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			isMobile = true;
			body.addClass('isMobile');
		};
		navbar_brand.contents().filter(function() {
			return this.nodeType !== 3;
		}).each(function(i) {
			if($(this).is('img')) {
				size[i] = Math.ceil(parseInt($(this).height()));
			} else if($(this).css('font-size')) {
				size[i] = Math.ceil(parseInt($(this).css('font-size')));
			}
		});
	};
	var runDropdownToggle = function(func, threshold, execAsap) {
		if(isMobile == false) {
			$('.dropdown-toggle').dropdownHover({
				delay: 0
			});
		}
	};
	//Window Resize Function
	var runWindowResize = function(func, threshold, execAsap) {
		//wait until the user is done resizing the window, then execute
		$(window).clipresize(function() {
			screen_height = win.height();
			screen_width = win.width();
			if(screen_width < 979) {
				$('.navbar-default').removeAttr('style');
				navbar_brand.removeAttr('style');
				navbar_brand.contents().filter(function() {
					return this.nodeType !== 3;
				}).each(function(i) {
					$(this).removeAttr('style');
				});
			} else {
				navigation_position_top = $('#topbar').outerHeight();

			}
			runElementsPosition();

			animateElements();
		});
	};
	//Set all Animated Elements
	var setAnimations = function() {
		$('.animate-group').each(function() {
			$(this).find('.animate').each(function() {
				runElementsAnimation($(this));
			});
		});
		$('.animate-if-visible').each(function() {
			runElementsAnimation($(this));
		});
	};
	//Search Box Function
	var setSearchMenu = function() {
		$('.menu-search > a').bind('click', function(e) {
			if($('.search-box').is(":hidden")) {
				$('.search-box').css({
					scale: 0.8,
					opacity: 0,
					display: 'block'
				}).transition({
					scale: 1,
					opacity: 1
				}, 200, 'easeOutBack');
			} else {
				$('.search-box').transition({
					scale: 0.9,
					opacity: 0
				}, 200, 'easeInBack', function() {
					$(this).hide();
				});
			}
			return false;
			e.stopPropagation();
		});
		$('.menu-search').bind('click', function(e) {
			e.stopPropagation();
		});
		$('html').click(function() {
			if($('.search-box').is(":visible")) {
				$('.search-box').transition({
					scale: 0.9,
					opacity: 0
				}, 200, 'easeInBack', function() {
					$(this).hide();
				});
			}
		});
	};
	//Function to shrink navigation menu when scrolling down
	var runElementsPosition = function() {
		scroll_top = win.scrollTop();
		screen_height = win.height();
		new_navbar_height = navbar_height - scroll_top;
		if(isMobile == false && screen_width > 979) {
			new_logo_font_size = logo_font_size * navbar.outerHeight() / navbar_height;
			if(navigation_position_top > 0) {
				sticky_navigation();
			}
			if(scroll_top == 0) {
				navbar.css({
					'height': navbar_height,
					'line-height': (navbar_height - 2) + 'px'
				});
				navbar.find('.navbar-nav').children('li').children('a').css({
					'height': navbar_height,
					'line-height': (navbar_height - 2) + 'px'
				});
				body.css({
					'padding-top': navbar_height + $('#topbar').outerHeight()
				});
				navbar_brand.css('font-size', logo_font_size + 'px');
				navbar_brand.contents().filter(function() {
					return this.nodeType !== 3;
				}).each(function(i) {
					if($(this).is('img')) {
						$(this).css({
							'height': size[i] + 'px',
							'width': 'auto'
						});
					} else if($(this).css('font-size')) {
						$(this).css('font-size', size[i] + 'px');
					}
				});
			} else if(scroll_top < navbar_height && new_navbar_height >= min_height) {
				navbar_brand.css('font-size', new_logo_font_size + 'px');
				navbar_brand.contents().filter(function() {
					return this.nodeType !== 3;
				}).each(function(i) {
					if($(this).is('img')) {
						$(this).css({
							'height': Math.ceil(size[i] * navbar.outerHeight() / navbar_height) + 'px',
							'width': 'auto'
						});
					} else if($(this).css('font-size')) {
						$(this).css('font-size', Math.ceil(size[i] * navbar.outerHeight() / navbar_height) + 'px');
					}
				});
				navbar.css({
					'height': new_navbar_height,
					'line-height': (new_navbar_height - 2) + 'px'
				});
				navbar.find('.navbar-nav').children('li').children('a').css({
					'height': new_navbar_height,
					'line-height': (new_navbar_height - 2) + 'px'
				});
				body.css({
					'padding-top': new_navbar_height + $('#topbar').outerHeight()
				});
			} else {
				navbar.css({
					'height': min_height,
					'line-height': (min_height - 2) + 'px'
				});
				navbar.find('.navbar-nav').children('li').children('a').css({
					'height': min_height,
					'line-height': (min_height - 2) + 'px'
				});
				body.css({
					'padding-top': min_height + $('#topbar').outerHeight()
				});
				new_logo_font_size = logo_font_size * navbar.outerHeight() / navbar_height;
				navbar_brand.css('font-size', Math.ceil(new_logo_font_size) + 'px');
				navbar_brand.contents().filter(function() {
					return this.nodeType !== 3;
				}).each(function(i) {
					if($(this).is('img')) {
						$(this).css({
							'height': Math.ceil(size[i] * navbar.outerHeight() / navbar_height) + 'px',
							'width': 'auto'
						});
					} else if($(this).css('font-size')) {
						$(this).css('font-size', Math.ceil(size[i] * navbar.outerHeight() / navbar_height) + 'px');
					}
				});
			}
		}
	};
	//Set of functions to manage the animations of the elements
	var animateElements = function() {
		if($('.animate-if-visible').length) {
			$('.animate-if-visible').appear();
			$(document.body).on('appear', '.animate-if-visible', function(e, $affected) {
				// this code is executed for each appeared element
				var element = $(this);
				var animationOptions = element.data('animation-options');
				runAnimationTransition(element, animationOptions);
			});
		}
		if($('.animate-group').length) {
			$('.animate-group').appear();
			$(document.body).on('appear', '.animate-group', function(e, $affected) {
				var element = $(this);
				var animationInterval = 200;
				if( typeof $(this).data('animation-interval') !== 'undefined') {
					animationInterval = parseInt($(this).data('animation-interval'));
				}
				var totalAnimations = 0;
				var elements = [];

				element.find('.animate').each(function(n) {
					elements[n] = $(this);
					totalAnimations++;
				});
				runAnimationGroup(elements, totalAnimations, 0, animationInterval);

			});
		}
		// Force appear. This is suitable in cases when page is in initial state (not scrolled and not resized)
		$.force_appear();
	};
	var sticky_navigation = function() {
		if(scroll_top == 0) {
			navbar.css({

				'top': navigation_position_top + 'px'
			});
		} else if(scroll_top > navigation_position_top) {
			navbar.css({
				'top': 0
			});
		} else if(scroll_top < navigation_position_top && scroll_top > 0) {
			navbar.css({
				'top': navigation_position_top - scroll_top + 'px'
			});
		}
	};
	var runAnimationGroup = function(element, totalAnimations, actual, animationInterval) {
		if(actual < totalAnimations) {
			var animationOptions = element[actual].data('animation-options');
			setTimeout(function() {
				runAnimationTransition(element[actual], animationOptions);
				actual++;
				runAnimationGroup(element, totalAnimations, actual, animationInterval);
			}, animationInterval);
		}
	};
	var runElementsAnimation = function(element) {
		var animationOptions = element.data('animation-options');
		if( typeof animationOptions == 'undefined') {
			animationOptions = new Object;
			animationOptions.animation = "Fade";
		}
		switch (animationOptions.animation) {
			case 'scaleIn':
				element.css({
					opacity: 0,
					scale: 0.6
				});
				break;
			case 'scaleToBottom':

				original_height = element.height();

				element.data('original-height', original_height).data('original-width', element.width()).css({
					opacity: 0,
					transform: 'translateY(-' + original_height / 2 + 'px); scaleY(0.001)'
				});
				break;
			case 'scaleToRight':

				original_width = element.width();

				element.data('original-height', element.height()).data('original-width', original_width).css({
					opacity: 0,
					transform: 'translateX(-' + original_width / 2 + 'px); scaleX(0.001)'
				});
				break;
			case 'scaleToTop':

				original_height = element.height();

				element.data('original-height', original_height).data('original-width', element.width()).css({
					opacity: 0,
					transform: 'translateY(' + original_height / 2 + 'px); scaleY(0.001)'
				});
				break;
			case 'scaleToLeft':

				original_width = element.width();

				element.data('original-height', element.height()).data('original-width', original_width).css({
					opacity: 0,
					transform: 'translateX(' + original_width / 2 + 'px); scaleX(0.001)'
				});
				break;
			default :
				element.css({
					opacity: 0
				});
				break;
		}
	};
	var runAnimateProgressBar = function() {
		if($('.animate-bar').length) {
			$('.animate-bar').appear();
			$(document.body).on('appear', '.animate-bar', function(e, $affected) {
				$(this).progressbar({
					display_text: 'center',
					use_percentage: true
				});
			});
		}
	};
	var runAnimationTransition = function(element, animationOptions) {
		if( typeof animationOptions == 'undefined') {
			animationOptions = new Object;
			animationOptions.animation = "fadeIn";
		}
		var animationType = animationOptions.animation;
		var animationDelay = animationOptions.delay;
		var animationDuration = animationOptions.duration;
		var animationEasing = animationOptions.easing;
		if( typeof animationType === 'undefined') {
			animationType = "fadeIn";
		}
		if( typeof animationDelay === 'undefined') {
			animationDelay = 0;
		}
		if( typeof animationDuration === 'undefined') {
			animationDuration = 300;
		}
		if( typeof animationEasing === 'undefined') {
			animationEasing = 'linear';
		}
		switch (animationType) {
			case 'scaleIn':
				element.transition({
					opacity: 1,
					scale: 1,
					duration: animationDuration,
					delay: animationDelay,
					easing: animationEasing
				});
				break;
			case 'scaleToRight':
			case 'scaleToLeft':
				element.transition({
					opacity: 1,
					transform: 'scaleX(1)',
					duration: animationDuration,
					delay: animationDelay,
					easing: animationEasing
				});
				break;
			case 'scaleToBottom':
			case 'scaleToTop':
				element.transition({
					opacity: 1,
					transform: 'scaleY(1)',
					duration: animationDuration,
					delay: animationDelay,
					easing: animationEasing
				});
				break;
			default:

				animationDuration = animationDuration / 1000 * 2 + 's';
				animationDelay = animationDelay / 1000 * 2 + 's';
				element.css({
					opacity: 1,
					'animation-fill-mode': 'both',
					'animation-duration': animationDuration,
					'animation-delay': animationDelay,
					'animation-name': animationType
				});
				break;
		}
	};
	// Function to display an icon on the images on hover
	var runImageOverlay = function() {
		if($('.image-overlay').length && !$('body').hasClass('isMobile')) {
			$('.image-overlay').hover(function() {
				$(this).transition({
					opacity: 0.7
				}).find('.circle-icon').css({
					rotate: '-90deg'
				}).transition({
					rotate: '0deg',
					easing: 'easeOutBack'
				}, 400);
				;
			}, function() {
				$(this).transition({
					opacity: 0
				});
			});
		}
	};
	// function to initiate FlexSlider
	var runFlexSlider = function(options) {
		$(".flexslider").each(function() {
			var slider = $(this);
			var defaults = {
				animation: "slide",
				animationLoop: false,
				controlNav: true,
				directionNav: false,
				slideshow: false,
				prevText: "",
				nextText: ""
			};
			var config = $.extend({}, defaults, options, slider.data("plugin-options"));
			if( typeof config.sync !== 'undefined') {
				var carousel = {
					animation: "slide",
					controlNav: false,
					animationLoop: false,
					slideshow: false,
					prevText: "",
					nextText: "",
					asNavFor: slider
				};
				var configCarousel = $.extend({}, carousel, $(config.sync).data("plugin-options"));
				$(config.sync).flexslider(configCarousel);
			}
			// Initialize Slider
			slider.flexslider(config);
		});
	};
	// function to handle SlideBar Toggle
	var runSideBarToggle = function() {
		$(".sb_toggle").click(function() {
			sb_toggle = $(this);
			$("#slidingbar").slideToggle("fast", function() {
				if(sb_toggle.hasClass('open')) {
					sb_toggle.removeClass('open');
				} else {
					sb_toggle.addClass('open');
				}
			});
		});
	};
	// function to handle Scroll Top button
	var runScrollTop = function() {
		scroll_top = win.scrollTop();
		scroll_top_button = $('#scroll-top');
		if(scroll_top > 300) {
			scroll_top_button.fadeIn();
		} else {
			scroll_top_button.fadeOut();
		};
		scroll_top_button.off("click").on("click", function(e) {
			$("html, body").animate({
				scrollTop: 0
			}, "slow");
			e.preventDefault();
		});
	};
	// function to be activated when you scroll the page
	var runWindowScroll = function() {
		$(window).scroll(function(e) {
			runScrollTop();
			runElementsPosition();

		});
	};
	//Set of functions for Style Selector
	var runStyleSelector = function() {
		$('.style-toggle').bind('click', function() {
			if($(this).hasClass('open')) {
				$(this).removeClass('open').addClass('close');
				$('#style_selector_container').hide();
			} else {
				$(this).removeClass('close').addClass('open');
				$('#style_selector_container').show();
			}
		});
		setColorScheme();
	};
	var setColorScheme = function() {
		$('.icons-color a').bind('click', function() {
			$('.icons-color img').each(function() {
				$(this).removeClass('active');
			});
			$(this).find('img').addClass('active');
			$('#skin_color').attr("href", "assets/css/theme_" + $(this).attr('id') + ".css");

		});
	};
	//function to save user settings
	var runSaveSetting = function() {
		$('.save_style').bind('click', function() {
			var clipSetting = new Object;

			clipSetting.skinClass = $('#skin_color').attr('href');
			$.cookie("clip-front-setting", JSON.stringify(clipSetting));
			var el = $('#style_selector_container');
			el.block({
				overlayCSS: {
					backgroundColor: '#fff'
				},
				message: '<img src="assets/images/loading.gif" />',
				css: {
					border: 'none',
					color: '#333',
					background: 'none'
				}
			});
			window.setTimeout(function() {
				el.unblock();
			}, 1000);
		});
	};
	//function to load user settings
	var runCustomSetting = function() {
		if($.cookie("clip-front-setting")) {
			var loadSetting = jQuery.parseJSON($.cookie("clip-front-setting"));

			if($('#style_selector').length) {
				$('#skin_color').attr('href', loadSetting.skinClass);
			};
		};
	};
	//function to clear user settings
	var runClearSetting = function() {
		$('.clear_style').bind('click', function() {
			$.removeCookie("clip-front-setting");
			$('.icons-color img').first().trigger('click');

		});
	};

	//function to activate the Tooltips, if present
	var runTooltips = function() {
		if($(".tooltips").length) {
			$('.tooltips').tooltip();
		}
	};
	//function to activate the Popovers, if present
	var runPopovers = function() {
		if($(".popovers").length) {
			$('.popovers').popover();
		}
	};
	return {
		//main function to initiate template pages
		init: function() {
			runInit();
			animateElements();
			setSearchMenu();
			runDropdownToggle();
			runFlexSlider();
			sticky_navigation();
			setAnimations();
			runImageOverlay();
			runAnimateProgressBar();
			runWindowScroll();
			runWindowResize();
			runTooltips();
			runPopovers();
			runStyleSelector();
			runElementsPosition();
			animateElements();
			runSideBarToggle();
			runScrollTop();
			runSaveSetting();
			runCustomSetting();
			runClearSetting();
		}
	};
}();
