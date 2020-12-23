jQuery(document).ready(function($){

    var body = $('body');
    var main = $('#main');
    var overflowContainer = $('#overflow-container');
    var maxWidth = $('#max-width');
    var headerImage = $('#header-image');
    var toggleNavigation = $('#toggle-navigation');
    var menuPrimaryContainer = $('#menu-primary-container');
    var menuPrimaryItems = $('#menu-primary-items');
    var toggleDropdown = $('.toggle-dropdown');
    var sidebar = $('#main-sidebar');
    var sidebarPrimaryContainer = $('#sidebar-primary-container');
    var sidebarInner = $('#sidebar-inner');
    var adminBar = 0;
    if ( body.hasClass('admin-bar') ) {
        adminBar = 32;
    }
    var adjustment = 24;
    var lastScrollTop = 0;
    var scrollTracking = false;

    assignMenuItemDelays();
    setMainMinHeight();
    setupSidebar();
    objectFitAdjustment();
    sidebarAdjustment();
    menuKeyboardAccess();

    toggleNavigation.on('click', openPrimaryMenu);
    toggleDropdown.on('click', openDropdownMenu);

    $(window).on('resize', function(){
        objectFitAdjustment();
        setupSidebar();
        sidebarAdjustment();
        setMainMinHeight();
    });

    // Jetpack infinite scroll event that reloads posts.
    $( document.body ).on( 'post-load', function () {
        objectFitAdjustment();
    } );

    $('.post-content').fitVids({
        customSelector: 'iframe[src*="dailymotion.com"], iframe[src*="slideshare.net"], iframe[src*="animoto.com"], iframe[src*="blip.tv"], iframe[src*="funnyordie.com"], iframe[src*="hulu.com"], iframe[src*="ted.com"], iframe[src*="wordpress.tv"]'
    });

    function setupSidebar(){

        if ( window.innerWidth > 899 ) {

            // if sidebar height is less than window, fixed position and quit
            if ( sidebarInner.outerHeight(true) < window.innerHeight && headerImage.length == 0 ) {
                sidebar.addClass('fixed');
                sidebarAdjustment();
            } else {
                // don't bind more than once
                if ( scrollTracking == false ) {
                    $(window).on('scroll resize', positionSidebar);
                    scrollTracking = true;
                }
            }
        } else {
            scrollTracking = false;
        }
    }

    function openPrimaryMenu() {

        if( menuPrimaryContainer.hasClass('open') ) {
            menuPrimaryContainer.removeClass('open');
            $(this).removeClass('open');
            sidebarPrimaryContainer.removeClass('open');

            // change screen reader text
            $(this).children('span').text(ct_cele_objectL10n.openMenu);

            // change aria text
            $(this).attr('aria-expanded', 'false');

        } else {
            menuPrimaryContainer.addClass('open');
            $(this).addClass('open');
            sidebarPrimaryContainer.addClass('open');

            // change screen reader text
            $(this).children('span').text(ct_cele_objectL10n.closeMenu);

            // change aria text
            $(this).attr('aria-expanded', 'true');
        }
    }

    function openDropdownMenu() {

        // get the buttons parent (li)
        var menuItem = $(this).parent();
        var subMenu = $(this).siblings('ul');
        var parentList = menuItem.parent();

        // if already opened
        if( menuItem.hasClass('open') ) {

            // remove open class
            menuItem.removeClass('open');

            // change screen reader text
            $(this).children('span').text(ct_cele_objectL10n.openMenu);

            // change aria text
            $(this).attr('aria-expanded', 'false');

            subMenu.css('max-height', '0');

            subMenu.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                function(e) {
                    // in case sidebar now shorter than .main
                    setMainMinHeight();
                    // update sidebar to switch from 'fixed' if necessary
                    setupSidebar();
                });

            // make child links/buttons keyboard inaccessible
            menuKeyboardAccess(menuItem, 'close');
        } else {

            // add class to open the menu
            menuItem.addClass('open');

            // change screen reader text
            $(this).children('span').text(ct_cele_objectL10n.closeMenu);

            // change aria text
            $(this).attr('aria-expanded', 'true');

            var subMenuHeight = 0;
            subMenu.children('li').each(function(){
                subMenuHeight = subMenuHeight + $(this).height();
            });
            subMenu.css('max-height', subMenuHeight);

            // parent ul - expand to include open child submenu
            if ( parentList.hasClass('sub-menu') ) {
                parentList.css('max-height', parseInt(parentList.css('max-height')) + subMenuHeight + 'px');
            }
            parentList.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                function(e) {
                    // in case sidebar now taller than .main
                    setMainMinHeight();
                    // update sidebar to switch from 'fixed' if necessary
                    setupSidebar();
                });

            // make child links/buttons keyboard accessible
            menuKeyboardAccess(menuItem, 'open');
        }
    }

    function assignMenuItemDelays(){
        var counter = 0;
        menuPrimaryItems.find('ul').each(function() {
            $(this).children('li').each(function(){
                $(this).css('transition-delay', '0.' + counter + 's');
                counter++;
            });
            counter = 0;
        });

        // open the menu to display the current page if inside a dropdown menu
        var currentMenuItem = $( '.current-menu-ancestor');
        currentMenuItem.addClass('open');

        currentMenuItem.children('ul').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function(e) {
                // in case sidebar now taller than .main
                setMainMinHeight();
                // update sidebar to switch from 'fixed' if necessary
                setupSidebar();
            });
    }

    function positionSidebar() {

        if ( window.innerWidth < 900 ) {
            return;
        }

        var windowBottom = $(window).scrollTop() + window.innerHeight;
        var sidebarBottom = sidebarInner.offset().top + sidebarInner.outerHeight(true);
        var scrolledUp = false;
        var st = $(this).scrollTop();
        var rtl = false;
        if (body.hasClass('rtl')) {
            rtl = true;
        }

        function sidePositioning(rtl, offset) {
            if (rtl && offset) {
                sidebar.css('right', maxWidth.offset().left);
            } else if (rtl) {
                sidebar.css('right', '');
            } else if (offset) {
                sidebar.css('left', maxWidth.offset().left);
            } else {
                sidebar.css('left', '');
            }
        }

        if (st < lastScrollTop){
            scrolledUp = true;
        }
        lastScrollTop = st;

        // if fixed to bottom and scrolling back up
        if ( scrolledUp == true && sidebar.hasClass('fixed-bottom') ) {
            sidebar.css('top', sidebar.offset().top - adjustment + 'px');
            sidePositioning(rtl, false);
            sidebar.addClass('down-page');
            sidebar.removeClass('fixed-bottom');
        }
        // fix to top of screen until scrolled all the way up
        else if ( scrolledUp == true && sidebar.hasClass('down-page') && (sidebar.offset().top - adminBar) >= $(window).scrollTop() ) {
            sidebar.removeClass('down-page');
            sidebar.addClass('fixed-top');
            // b/c max-width won't always be all the way left
            sidebar.css('top', '');
            sidePositioning(rtl, true);
        }
        // scrolled to top, reset
        else if ( sidebar.hasClass('fixed-top') && $(window).scrollTop() <= parseInt(overflowContainer.offset().top) ) {
            sidebar.removeClass('fixed-top');
            sidePositioning(rtl, false);
        }
        // if fixed to top, but now scrolling down
        else if ( ( sidebar.hasClass('fixed-top') || sidebar.hasClass('fixed') ) && scrolledUp == false ) {
            sidebar.css('top', sidebar.offset().top - adjustment + 'px');
            sidePositioning(rtl, false);
            sidebar.removeClass('fixed-top');
            sidebar.removeClass('fixed');
            sidebar.addClass('down-page');
        }
        // if the bottom of the window is as low or lower than the bottom of the sidebar
        else if ( windowBottom >= sidebarBottom && scrolledUp == false && ($(window).scrollTop() >= adjustment) ) {
            sidebar.addClass('fixed-bottom');
            if (sidebarInner.outerHeight(true) >= window.innerHeight) {
                sidebar.css('top', '');
            } else {
                sidebar.css('top', -24);
            }
            // b/c max-width won't always be all the way left
            sidePositioning(rtl, true);
            sidebar.removeClass('down-page');
        }
    }

    function sidebarAdjustment() {
        // adjustment for how far sidebar is from the top of the page (admin bar + margins)
        if ( window.innerWidth >= 1100 ) {
            adjustment = 24;
        } else if ( window.innerWidth >= 1000 ) {
            adjustment = 12;
        } else if ( window.innerWidth >= 890 ) {
            adjustment = 0;
        }
        if ( $('#wpadminbar').length > 0 ) {
            adjustment += 32;

            if ( sidebar.hasClass('fixed') ) {
                sidebar.css('top', '32px');
            }
        }
        if ( headerImage.length > 0 ) {
            adjustment += headerImage.outerHeight(true);
        }

        if ( sidebar.hasClass('fixed') ) {
            // b/c max-width won't always be all the way left
            sidebar.css('left', maxWidth.offset().left);
        }
    }

    // increase main height when needed so fixed sidebar can be scrollable
    function setMainMinHeight() {
        var sidebarHeight = sidebarInner.outerHeight(true) + sidebar.offset().top;
        if ( sidebarHeight < window.innerHeight ) {
            main.css('min-height', window.innerHeight);
        } else {
            main.css('min-height', sidebarHeight);
        }
    }

    // mimic cover positioning without using cover
    function objectFitAdjustment() {

        // if the object-fit property is not supported
        if( !('object-fit' in document.body.style) ) {

            $('.featured-image').each(function () {

                if ( !$(this).parent().parent('.entry').hasClass('ratio-natural') ) {

                    var image = $(this).children('img').add($(this).children('a').children('img'));

                    // don't process images twice (relevant when using infinite scroll)
                    if ( image.hasClass('no-object-fit') ) {
                        return;
                    }

                    image.addClass('no-object-fit');

                    // if the image is not wide enough to fill the space
                    if (image.outerWidth() < $(this).outerWidth()) {

                        image.css({
                            'width': '100%',
                            'min-width': '100%',
                            'max-width': '100%',
                            'height': 'auto',
                            'min-height': '100%',
                            'max-height': 'none'
                        });
                    }
                    // if the image is not tall enough to fill the space
                    if (image.outerHeight() < $(this).outerHeight()) {

                        image.css({
                            'height': '100%',
                            'min-height': '100%',
                            'max-height': '100%',
                            'width': 'auto',
                            'min-width': '100%',
                            'max-width': 'none'
                        });
                    }
                }
            });
        }
    }

    function menuKeyboardAccess(listItem, status){

        var tabindex = 0;
        if ( status == 'close' ) {
            tabindex = -1;
        }

        if ( listItem) {
            listItem.children('ul').children('li').children('a, button').attr('tabindex', tabindex);
        } else {
            menuPrimaryItems.find('ul').each(function() {
                $(this).children('li').children().attr('tabindex', -1)
            });
        }
    }

    // ===== Scroll to Top ==== //

    if ( $('#scroll-to-top').length !== 0 ) {
        $(window).on( 'scroll', function() {
            if ($(this).scrollTop() >= 200) {        // If page is scrolled more than 50px
                $('#scroll-to-top').addClass('visible');    // Fade in the arrow
            } else {
                $('#scroll-to-top').removeClass('visible');   // Else fade out the arrow
            }
        });
        $('#scroll-to-top').click(function(e) {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 600);
            $(this).blur();
        });
    }
});

/* fix for skip-to-content link bug in Chrome & IE9 */
window.addEventListener("hashchange", function(event) {

    var element = document.getElementById(location.hash.substring(1));

    if (element) {

        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
            element.tabIndex = -1;
        }

        element.focus();
    }

}, false);