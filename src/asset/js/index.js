require('../scss/main.scss')
require('../scss/index.scss')

class home {
    constructor(){
        this.banner();
        this.imgNoDrag();
        this.entryBtn();
    };

    banner() {
        let rsbanner = new Swiper('.banner-data', {
            wrapperClass: 'img-box',
            slideClass: 'img-slide',
            pagination: '.img-pagination',
            paginationClickable: true,
            autoplay: 5000,
            loop: true
        });
    };

    imgNoDrag(){
        $('img').prop('draggable',false)
    };
    
    entryBtn(){
        let _this = this;
       let $entry =  $('.entry-btn button'),
        $top = $('.rs-road').offset().top;
       $entry.on('click',()=>{
            if(_this.isWeixin()){
                window.location.href = 'http://app.realfood.cn'
            }else{
                $('html,body').animate({scrollTop:$top},1000)
            }
       })
        
    };
    isWeixin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }

}
let homepage = new home();