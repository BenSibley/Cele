jQuery(document).ready(function($){

    var body = $('body');
    var main = $('#main');
    var overflowContainer = $('#overflow-container');
    var maxWidth = $('#max-width');
    var siteHeader = $('#site-header');
    var titleContainer = $('#title-container');
    var toggleNavigation = $('#toggle-navigation');
    var menuPrimaryContainer = $('#menu-primary-container');
    var menuPrimary = $('#menu-primary');
    var menuPrimaryItems = $('#menu-primary-items');
    var toggleDropdown = $('.toggle-dropdown');
    var sidebar = $('#main-sidebar');
    var sidebarPrimary = $('#sidebar-primary');
    var sidebarPrimaryContainer = $('#sidebar-primary-container');
    var sidebarInner = $('#sidebar-inner');
    var menuLink = $('.menu-item').children('a');

    assignMenuItemDelays();
    setMainMinHeight();
    objectFitAdjustment();

    toggleNavigation.on('click', openPrimaryMenu);
    toggleDropdown.on('click', openDropdownMenu);

    $(window).resize(function(){
        objectFitAdjustment();
    });

    // Jetpack infinite scroll event that reloads posts.
    $( document.body ).on( 'post-load', function () {
        objectFitAdjustment();
    } );

    $('.post-content').fitVids({
        customSelector: 'iframe[src*="dailymotion.com"], iframe[src*="slideshare.net"], iframe[src*="animoto.com"], iframe[src*="blip.tv"], iframe[src*="funnyordie.com"], iframe[src*="hulu.com"], iframe[src*="ted.com"], iframe[src*="wordpress.tv"]'
    });

    // if sidebar height is less than window, fixed position and quit
    if ( sidebarPrimary.outerHeight(true) < window.innerHeight ) {
        sidebar.addClass('fixed');
    } else {
        // start watching scroll
        $(window).on('scroll resize', positionSidebar);
        var lastScrollTop = 0;
    }

    /* allow keyboard access/visibility for dropdown menu items */
    menuLink.focus(function(){
        $(this).parents('ul').addClass('focused');
    });
    menuLink.focusout(function(){
        $(this).parents('ul').removeClass('focused');
    });

    function openPrimaryMenu() {

        if( menuPrimaryContainer.hasClass('open') ) {
            menuPrimaryContainer.removeClass('open');
            $(this).removeClass('open');
            sidebarPrimaryContainer.removeClass('open');

            // change screen reader text
            $(this).children('span').text(objectL10n.openMenu);

            // change aria text
            $(this).attr('aria-expanded', 'false');

        } else {
            menuPrimaryContainer.addClass('open');
            $(this).addClass('open');
            sidebarPrimaryContainer.addClass('open');

            // change screen reader text
            $(this).children('span').text(objectL10n.closeMenu);

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
            $(this).children('span').text(objectL10n.openMenu);

            // change aria text
            $(this).attr('aria-expanded', 'false');

            subMenu.css('max-height', '0');

            subMenu.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                function(e) {
                    // in case sidebar now shorter than .main
                    setMainMinHeight();
                });
        } else {

            // add class to open the menu
            menuItem.addClass('open');

            // change screen reader text
            $(this).children('span').text(objectL10n.closeMenu);

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
                });
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
    }

    function positionSidebar() {

        if ( window.innerWidth < 900 ) {
            return;
        }
        var windowBottom = $(window).scrollTop() + window.innerHeight;
        var sidebarBottom = sidebarInner.offset().top + sidebarInner.outerHeight(true);
        var scrolledUp = false;
        var st = $(this).scrollTop();

        if (st < lastScrollTop){
            scrolledUp = true;
        }
        lastScrollTop = st;

        // adjustment for how far sidebar is from the top of the page (admin bar + margins)
        var adjustment = 24;
        if ( window.innerWidth < 1100 ) {
            adjustment = 12;
        }
        if ( window.innerWidth < 1000 ) {
            adjustment = 0;
        }
        if ( $('#wpadminbar').length > 0 ) {
            adjustment = adjustment + 32;
        }

        // account for the admin bar
        var adminBar = 0;
        if ( body.hasClass('admin-bar') ) {
            adminBar = 32;
        }

        // if fixed to bottom and scrolling back up
        if ( scrolledUp == true && sidebar.hasClass('fixed-bottom') ) {
            sidebar.css({
                'top': sidebar.offset().top - adjustment + 'px',
                'left': ''
            });
            sidebar.addClass('down-page');
            sidebar.removeClass('fixed-bottom');
        }
        // fix to top of screen until scrolled all the way up
        else if ( scrolledUp == true && sidebar.hasClass('down-page') && (sidebar.offset().top - adminBar) >= $(window).scrollTop() ) {
            sidebar.removeClass('down-page');
            sidebar.addClass('fixed-top');
            // b/c max-width won't always be all the way left
            sidebar.css({
                'top': '',
                'left': maxWidth.offset().left
            });
        }
        // scrolled to top, reset
        else if ( sidebar.hasClass('fixed-top') && $(window).scrollTop() <= parseInt(sidebar.css('margin-top')) ) {
            sidebar.removeClass('fixed-top');
            sidebar.css({
                'left': ''
            });
        }
        // if fixed to top, but now scrolling down
        else if ( sidebar.hasClass('fixed-top') && scrolledUp == false ) {
            sidebar.css({
                'top': sidebar.offset().top - adjustment + 'px',
                'left': ''
            });
            sidebar.removeClass('fixed-top');
            sidebar.addClass('down-page');
        }
        // if the bottom of the window is as low or lower than the bottom of the sidebar
        else if ( windowBottom >= sidebarBottom && scrolledUp == false ) {
            sidebar.addClass('fixed-bottom');
            // b/c max-width won't always be all the way left
            sidebar.css({
                'top': '',
                'left': maxWidth.offset().left
            });
            sidebar.removeClass('down-page');
        }
    }

    // increase main height when needed so fixed sidebar can be scrollable
    function setMainMinHeight() {
        main.css('min-height', sidebarInner.outerHeight(true) + sidebar.offset().top);
    }

    // mimic cover positioning without using cover
    function objectFitAdjustment() {

        // if the object-fit property is not supported
        if( !('object-fit' in document.body.style) ) {

            $('.featured-image').each(function () {

                if ( !$(this).parent().parent('.post').hasClass('ratio-natural') ) {

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