$(document).ready(function(){
    //Banner
    if($("#categories")){
        $("#categories").prepend("<div class='category-banner'><h2 class='category-banner_title text-light'>Categories</h2></div>");
    }

    $(window).on("scroll", function(){
        $scroll = $(this).scrollTop();
        
        if($scroll >= 1000){
            $(".category-banner").animate({bottom:"100%"}, 600,function(){
                $(this).remove();
            });
        }
    });

});