//jquery-click-scroll
//by syamsul'isul' Arifin

var sectionArray = [1, 2, 3, 4, 5];

$.each(sectionArray, function(index, value){
    const sectionId = 'section_' + value;
    const $section = $('#' + sectionId);
    
    // Only proceed if the section exists
    if ($section.length) {
        $(document).scroll(function(){
            const offsetSection = $section.offset().top - 90;
            const docScroll = $(document).scrollTop();
            const docScroll1 = docScroll + 1;
            
            if (docScroll1 >= offsetSection) {
                $('.navbar-nav .nav-item .nav-link').removeClass('active');
                $('.navbar-nav .nav-item .nav-link:link').addClass('inactive');  
                $('.navbar-nav .nav-item .nav-link').eq(index).addClass('active');
                $('.navbar-nav .nav-item .nav-link').eq(index).removeClass('inactive');
            }
        });
        
        $('.click-scroll').eq(index).click(function(e){
            const offsetClick = $section.offset().top - 90;
            e.preventDefault();
            $('html, body').animate({
                'scrollTop': offsetClick
            }, 300);
        });
    }
});

$(document).ready(function(){
    // Initialize navigation state
    $('.navbar-nav .nav-item .nav-link:link').addClass('inactive');    
    $('.navbar-nav .nav-item .nav-link').eq(0).addClass('active');
    $('.navbar-nav .nav-item .nav-link:link').eq(0).removeClass('inactive');
});