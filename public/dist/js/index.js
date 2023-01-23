var variableImagenSeleccionado = 0;

window.onload = function () {
    quotes();
    car();
    partnersCar()

}

    // ** ESTE ES EL CARRUSEL DEL QUOTE **
function quotes() {  
    $("#testimonios").slick({
    dots: false,
    arrows: false,
    autoplay: true,
    draggable: true,
    fade: true,
    infinite: true,
    autoplaySpeed: 1000,
    speed: 2000,
  });
}
      // **** ESTE ES EL CARRUSEL DEL INDEX ****
 function car() {     
     $("#carousel-landing").slick({
        dots: false,
        arrows: false,
        autoplay: true,
        draggable: true,
        fade: true,
        lazyLoad: 'progressive',
        infinite: true,
        autoplaySpeed: 4000,
        speed: 4000,
    });
 }
       // **** ESTE ES EL CARRUSEL DEL Partners ****
       function partnersCar() {     
        $("#carousel-partners").slick({
           dots: false,
           slidesToShow: 3,
           slidesToScroll: 2,
           arrows: false,
           autoplay: true,
           draggable: true,
           fade: false,
           lazyLoad: 'progressive',
           infinite: true,
           autoplaySpeed: 4000,
           speed: 4000,
       });
    }
   

function ejecutarAcciones() {


    // **** ESTE ES EL CARRUSEL DE LOS PRODUCTOS ****
    $(".carousel-product").slick({
        dots: true,
        arrows: true,
        autoplay: true,
        draggable: true,
        fade: true,
        lazyLoad: 'progressive',
        infinite: true,
        autoplaySpeed: 5000,
        speed: 3000,
    });

    // **** ESTO ES EL TOGGLER DEL MENU PARA VERSION MOBILE ****
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // **** ACTIVA EL SCROLLREVEALER WOW ****
    var wow = new WOW({
        boxClass: 'wow', // animated element css class (default is wow)
        animateClass: 'animate__animated', // animation css class (default is animated)
        offset: 15, // distance to the element when triggering the animation (default is 0)
        mobile: false, // trigger animations on mobile devices (default is true)
        live: true, // act on asynchronously loaded content (default is true)
        callback: function (box) {
            // the callback is fired every time an animation is started
            // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null, // optional scroll container selector, otherwise use window,
        resetAnimation: true, // reset animation on end (default is true)
    });
    wow.init();
}



