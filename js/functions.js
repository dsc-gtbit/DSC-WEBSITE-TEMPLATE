var menu_seTimeout = '';

jQuery(document).ready(function () {

    jQuery('body').addClass('docLoaded');

    jQuery('.fancybox-media').fancybox({
        openEffect: 'fade',
        closeEffect: 'fade',

        helpers: {
            media: {},
            title: {
                type: 'inside' // 'float', 'inside', 'outside' or 'over'
            },
            overlay: {
                locked: false
            }
        },
        afterLoad: function () {

            var transcript = jQuery(this.element).attr('data-transcript'),
                transcript_link = '';

            if (transcript !== '') {
                transcript_link = '<br /><br /><a class="button small" target="_blank" href="' + transcript + '">DOWNLOAD TRANSCRIPT</a>'
            }

            var element_title = '<div class="el_title">' + jQuery(this.element).attr('data-title') + '</div><div class="el_description">' + jQuery(this.element).attr('data-description') + transcript_link + '</div>';

            this.title = element_title;
        },
        beforeShow: function () {
            jQuery('body > .fancybox-overlay').css({visibility: 'visible'}).animate({
                opacity: 1
            })

            jQuery('body >.fancybox-wrap').append('<div class="close"><a class="bit" href="javascript: void(0)" onClick="jQuery(this).closest(\'body\').find(\'.fancybox-overlay\').click()"><img class="default" src="' + template_vars.template_url + '/images/btn-close-u.png" alt="" /><img class="hover" src="' + template_vars.template_url + '/images/btn-close-o.png" alt="" /></a></div>');
        },
        beforeClose: function () {

            jQuery('body > .fancybox-overlay').stop().animate({
                opacity: 0
            }, 400, function () {
                jQuery(this).css({visibility: 'hidden'});
                jQuery.fancybox.close(true, true);
            })
            jQuery('body > .fancybox-wrap').stop().animate({
                opacity: 0
            });

            return false;
        }
    });

    jQuery('.tips, .help_tip').tipTip({
        'attribute': 'data-tip',
        'fadeIn': 50,
        'fadeOut': 50,
        'delay': 200,
        'edgeOffset': 5,
        'defaultPosition': "top"
    });

    //custom trigger for newsletter
    jQuery('#menu-top-menu li.newsletter a').click(function () {
        newsletter_layover();
    })

    var ta = document.querySelector('textarea');
    autosize(ta);

    setTimeout(function () {
        jQuery('#mobile-menu').addClass('visible');
    }, 50);

    jQuery('.flexslider').flexslider({
        animation: "fade",
        controlNav: true,
        directionNav: false,
        slideshowSpeed: 6000,
        animationSpeed: 500,
        pausePlay: true,
        pauseText: 'Pause',
        playText: 'Play',
    });


    jQuery('#back_top a').click(function () {

        jQuery('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;

    })

    jQuery('a[href*=#]').on('click', function (event) {

        event.preventDefault();

        jQuery('html,body').stop().animate({scrollTop: jQuery(this.hash).offset().top - 180}, 500);
    });


    //mobile menu
    jQuery('#mobile_main_nav > li.current-menu-ancestor, #mobile_main_nav > li.current-menu-item').each(function () {
        jQuery(this).addClass('active')
    })

    jQuery('#mobile_main_nav > li > a').click(function () {
        jQuery(this).closest('li').toggleClass('active');
    })


    //layovers
    jQuery('.layover').on('click', function (e) {
        if (e.target !== this)
            return;

        element_id = jQuery(this).attr('id');
        eval(element_id + '_layover_close()');
    });


    page_scroll();

    jQuery(window).scroll(function (event) {
        page_scroll();
    });

    var resizeTimer;

    //general on resize actions
    jQuery(window).resize(function () {
        clearTimeout(resizeTimer);
        var window_width = jQuery(window).width();
        resizeTimer = setTimeout(function () {
            do_resize_actions(window_width)
        }, 250);
    });


    var submenu_timeouts = [];
    jQuery("#main_nav > li").mouseover(function () {

        var el_index = jQuery("#main_nav > li").index(jQuery(this));

        if (submenu_timeouts.length > 0 && !(el_index in submenu_timeouts)) {
            //clear all timeouts and close the pop-ups
            for (var key in submenu_timeouts) {
                if (key != el_index) {
                    clearTimeout(submenu_timeouts[key]);
                    submenu_timeouts.splice(key, 1);
                }
            }

            //remove all visibles
            jQuery("#main_nav > li > ul.visible").removeClass('visible');
        }

        if (el_index in submenu_timeouts) {
            for (var key in submenu_timeouts) {
                if (key == el_index) {
                    clearTimeout(submenu_timeouts[key]);
                    submenu_timeouts.splice(key, 1);
                }
            }
        }

        jQuery(this).find(' > ul').stop().addClass('visible');
    })
        .mouseout(function () {

            var el_index = jQuery("#main_nav > li").index(jQuery(this));

            var element = jQuery(this);
            var VarTimeout = setTimeout(function () {
                jQuery(element).find(' > ul').stop().removeClass('visible');
                for (var key in submenu_timeouts) {
                    if (key == el_index) {
                        submenu_timeouts.splice(key, 1);
                    }
                }
            }, 300);


            submenu_timeouts[el_index] = VarTimeout;

        });

    /*
     setInterval(function() {
     var html = ' ';
     for (var key in submenu_timeouts)
     {
     html += " key:" + key + " value: " + submenu_timeouts[key];

     }

     jQuery('#debug').html(html);
     }, 50);
     */


    jQuery('#single.gateway #content .area h2').on('click', function () {
        jQuery(this).closest('.area').toggleClass('active');
    })


    jQuery("#single.gateway #sidebar").stick_in_parent({
        'offset_top': jQuery('header').height()
    });


    jQuery(document).on('keyup', '#main_nav > li > a', function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) { // tab key
            jQuery('#main_nav > li > a').trigger('mouseleave');
            jQuery('#main_nav > li > a').siblings('ul').hide();
            jQuery(this).trigger('mouseenter');
            jQuery(this).siblings('ul').show();
        }
    });


});


function do_resize_actions(window_width) {
    jQuery(document).trigger("resize_actions");

    if (window.matchMedia("only screen and (max-width: 800px)").matches) {
        jQuery('#all_elements').removeClass('slide-right');
        jQuery('#show_menu .hide').hide();
        jQuery('#show_menu .show').show();

        //check the sidebar stick plugin
        jQuery("#single.gateway #sidebar").trigger("sticky_kit:detach");
    }
    else {
        //check the sidebar stick plugin
        jQuery("#single.gateway #sidebar").stick_in_parent({
            'offset_top': jQuery('header').height()
        });

    }


}

function page_scroll() {
    var scroll = jQuery(window).scrollTop();
    do_page_scroll_actions(scroll);
}

function do_page_scroll_actions(scroll_position) {
    if (scroll_position > 75) {
        jQuery('body').addClass('scrolled');
        if (!jQuery('header #main_menu').hasClass('visible')) {
            jQuery('header #main_menu').removeClass('topItem');
        }

        //remove any active menu dropd-downs
        jQuery("#main_nav > li > ul.visible").removeClass('visible');
    }
    else {
        jQuery('body').removeClass('scrolled');
        jQuery('#main_menu').addClass('topItem');
    }

}

function main_menu_toggle(status) {

    switch (status) {
        case 'show' :
            jQuery('#show_menu .show').hide();
            jQuery('#show_menu .hide').css('display', 'block');
            jQuery('#main_menu').addClass('visible');

            clearTimeout(menu_seTimeout);
            menu_seTimeout = setTimeout(function () {
                jQuery('#main_menu').addClass('topItem');
            }, 500);

            //mobile
            if (window.matchMedia("only screen and (max-width: 800px)").matches) {
                jQuery('#all_elements').addClass('slide-right');
            }


            break;

        case 'hide' :
            jQuery('#show_menu .show').show();
            jQuery('#show_menu .hide').hide();
            jQuery('#main_menu').removeClass('visible');
            jQuery('#main_menu').removeClass('topItem');

            //mobile
            jQuery('#all_elements').removeClass('slide-right');

            break;

    }
}


function page_print() {
    window.print();

}


function font_size_change(type) {
    jQuery('.font-resize').each(function () {

        jQuery(this).find('p, a, li, h1, h2, h3, h4, h5, h6').each(function () {
            var current_size = parseInt(jQuery(this).css('font-size'));
            var current_line_height = parseInt(jQuery(this).css('line-height'));

            switch (type) {
                case 'increase' :
                    current_size++;
                    current_line_height = current_line_height + 1;
                    break;

                case 'decrease' :
                    current_size--;
                    current_line_height = current_line_height - 1;
                    break;
            }


            jQuery(this).css('font-size', current_size);
            jQuery(this).css('line-height', current_line_height + 'px');

            jQuery(document).trigger("resize_actions");
        })

    })


}


function calculate_items_in_row(elements_list) {
    var lisInRow = 0;

    jQuery(elements_list).each(function () {
        if (jQuery(this).prev().length > 0) {
            if (jQuery(this).position().top != jQuery(this).prev().position().top) return false;
            lisInRow++;
        }
        else {
            lisInRow++;
        }
    });

    var lisInLastRow = jQuery(elements_list).length % lisInRow;
    if (lisInLastRow == 0) lisInLastRow = lisInRow;

    return [lisInRow, lisInLastRow];
}


function share_layover() {
    jQuery('#share').css({visibility: 'visible'}).animate({
        opacity: 1
    })
}

function share_layover_close() {
    jQuery('#share').stop().animate({
        opacity: 0
    }, 400, function () {
        jQuery(this).css({visibility: 'hidden'});
    })
}


function newsletter_layover() {
    jQuery('#newsletter').css({visibility: 'visible'}).animate({
        opacity: 1
    }, 400, function () {
        jQuery('#newsletter').find('#fieldName').focus();
    })
}

function newsletter_layover_close() {
    jQuery('#newsletter').stop().animate({
        opacity: 0
    }, 400, function () {
        jQuery(this).css({visibility: 'hidden'});
    })
}

function newsletter_process() {
    var field_name = jQuery('#newsletter #fieldName').val();
    var field_email = jQuery('#newsletter #fieldEmail').val();

    var queryString = {"action": "newsletter_submit", "cm-name": field_name, "cm-ikdjwd-ikdjwd": field_email};

    //send the data through ajax
    jQuery.ajax({
        type: 'POST',
        url: template_vars.ajax_url,
        data: queryString,
        cache: false,
        dataType: "json",
        success: function (data) {
            if (data.status == 'success') {
                var url = window.location.href;
                window.location.replace(url + "/thankyou/");
            }
            else {
                alert('Unexpected Error. Please try again later.');
            }

        },
        error: function (html) {
        }
    });

    return false;
}


function search_layover() {
    jQuery('#search').css({visibility: 'visible'}).animate({
        opacity: 1
    }, 400, function () {
        jQuery('#search').find('textarea').focus();
    })
}

function search_layover_close() {
    jQuery('#search').stop().animate({
        opacity: 0
    }, 400, function () {
        jQuery(this).css({visibility: 'hidden'});
    })
}

function search_process() {
    var text = jQuery('#search').find('textarea').val();

    if (text == '')
        return false

    jQuery('#search').find('input[type=text]').val(text);
    jQuery('#search').find('textarea').replace();

    return true;
}

function search_textarea_keydown(event, element) {
    if (event.keyCode == 13) {
        return false;
    }


    return true;

}
   