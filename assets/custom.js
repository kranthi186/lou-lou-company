/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

document.addEventListener('variant:changed', function(event) {
    var variant = event.detail.variant; // Gives you access to the whole variant details
  console.log(variant.inventory_quantity);
  if( variant.inventory_quantity < 1 ){
  $('label.SizeSwatch.block-'+variant.id).addClass('ctmSold');
  }
  else{
  $('label.SizeSwatch.block-'+variant.id).removeClass('ctmSold');
  }
});

/*document.addEventListener('cart:updated', function(event) {
  console.log('cart refreshed.........');
  calcBlanketDiscount();
});

document.addEventListener('product:added_finish', function(event) {
  console.log('product added finished.............');
  calcBlanketDiscount();
});

document.addEventListener('product:blank_added', function(event) {
  if ($('.upsell__popup').length > 0) {
    var title;
    var show_upsell = true;
    $('#sidebar-cart .CartItemWrapper').each(function(){
      title = $(this).find('.CartItem__Title a').data('swaddle');
      if (title == 'swaddles') {
        show_upsell = false;
      }
    });

    if (show_upsell) {
      $('.product__added').html("You’ve added 1 product to your cart.");
      $('.upsell__popup').show();
    }
  }
});*/

function calcBlanketDiscount() {
  var title, count = 0;
  if ($('body.template-cart').length > 0) {
    $('.Cart__ItemList .CartItem').each(function(){
      title = $(this).find('.CartItem__Title a').data('swaddle');
      if (title == 'swaddles') {
        count ++;
      }
    });
    if (count >= 2) {
      $('.Cart__ItemList .CartItem').each(function(){
        title = $(this).find('.CartItem__Title a').data('swaddle');
        if (title == 'swaddles') {
          var price_html = '';
          if ($(this).find('.CartItem__OriginalPrice.Price').length > 0) {
            price_html = $(this).find('.CartItem__OriginalPrice.Price').html();
          } else {
            price_html = $(this).find('.CartItem__Price.Price').html();
          }
          console.log(price_html);
          var price = parseFloat(price_html.replace('$', ''));
          var new_price = price * 0.9;
          $(this).find('.CartItem__LinePriceList').html('<span class="CartItem__Price Price Price--highlight">$'+new_price+'</span><span class="CartItem__OriginalPrice Price Price--compareAt">$'+price+'</span>');
        }
      });
    }
  } else {
    $('#sidebar-cart .CartItemWrapper').each(function(){
      title = $(this).find('.CartItem__Title a').data('swaddle');
      if (title == 'swaddles') {
        count ++;
      }
    });
    if (count >= 2) {
      var new_price_item, new_price_total = 0;
      $('#sidebar-cart .CartItemWrapper').each(function(){
        title = $(this).find('.CartItem__Title a').data('swaddle');
        var price_html = '';
        if ($(this).find('.CartItem__OriginalPrice.Price').length > 0) {
          price_html = $(this).find('.CartItem__OriginalPrice.Price').html();
        } else {
          price_html = $(this).find('.CartItem__Price.Price').html();
        }
        var price = parseFloat(price_html.replace('$', ''));
        if (title == 'swaddles') {
          new_price_item = price * 0.9;
          new_price_total += new_price_item;
          $(this).find('.CartItem__PriceList').html('<span class="CartItem__Price Price Price--highlight">$'+new_price_item+'</span><span class="CartItem__OriginalPrice Price Price--compareAt">$'+price+'</span>');
        } else {
          new_price_total += price;
        }
      });

      $('#sidebar-cart .Drawer__Footer .Button.Cart__Checkout .total').html('$' + new_price_total);
    }
  }
  
}

  var $announcementFlickity;
  $(document).ready(function() {
    $('body').on('click', '[name="checkout"], [name="goto_pp"], [name="goto_gc"]', function() {
      $(this).submit();
    });
    var option = $('.featured__image-with-prodcts .ProductList--carousel').data('flickity-config');
    $('.featured__image-with-prodcts .ProductList--carousel').flickity({
      cellAlign: 'left',
      contain: true,
    })

    var rotate_time = $('[data-section-type="announcement-bar"]').data('rotate_time');
    var slideIndex = 0; 
    showSlides(); // call showslide method 
      
    function showSlides() { 
      var i; 
    
      // get the array of divs' with classname image-sliderfade 
      var slides = document.getElementsByClassName("AnnouncementBar__Content");    
    
      for (i = 0; i < slides.length; i++) { 
          // initially set the display to  
          // none for every image. 
          slides[i].style.display = "none";  
      } 
    
      // increase by 1, Global variable 
      slideIndex++;  
    
      // check for boundary 
      if (slideIndex > slides.length)  
      { 
          slideIndex = 1; 
      } 
    
      slides[slideIndex - 1].style.display = "block"; 
      setTimeout(showSlides, rotate_time != '' ? Number(rotate_time) : 3000);  
    }

    $('.modal_link').on('click', function(e){
      e.preventDefault();
      var id = $(this).attr('href');
      $(id).addClass('active');
    });

    $('.upsell__popup-wrap .item').on('click', function(){
      $('.upsell__popup-wrap .item').each(function(){
        $(this).removeClass('active');
      });
      $(this).addClass('active');
      $('.upsell__popup-wrap .Button').removeClass('Button--secondary').addClass('Button--primary');
      $('.upsell__popup-wrap .add_to_cart').removeClass('disabled');
    });

    $('.upsell__popup-wrap .add_to_cart').on('click', function(){
      if (!$(this).hasClass('disabled')) {
        var variant_id = $('.upsell__popup-wrap .item.active').data('variant-id');
        var current_variant = {
          id: variant_id
        };
        $.ajax({
          url: '/cart/add.js',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: {
            quantity: 1,
            id: variant_id
          },
          success: function (data) {
            document.documentElement.dispatchEvent(new CustomEvent('product:added', {
              bubbles: true,
              detail: {
                variant: current_variant,
                quantity: 1
              }
            }));
            $('.upsell__popup').hide();
            setTimeout(function(){
              document.dispatchEvent(new CustomEvent('product:added_finish'));
            }, 1000);
          }
        });
      }
    });

    $('.upsell__popup-wrap .close').on('click', function(){
      $('.upsell__popup').hide();
    });

    $('.PageOverlay').on('click', function(){
      $('.upsell__popup').hide();
    });

    /*$('.upsell__popup').on('click', function(){
      if ($(window).width() < 600) {
        $(this).css('top', '15%');
      }
    });*/

    if ($(window).width() < 600) {
      $('.upsell__popup').on('swipeup', function(ev, touch){
        if (!$('.upsell__popup').hasClass('mobile-expanded')) {
          $('.upsell__popup').addClass('mobile-expanded');
        }
      });
      $('.upsell__popup').on('swipedown', function(ev, touch){
        var container_offset = $('.upsell__popup .Grid').offset();
        var elm_offset = $('.upsell__popup .Grid .item:first-child').offset();
        if (elm_offset.top >= container_offset.top) {
          if ($('.upsell__popup').hasClass('mobile-expanded')) {
            $('.upsell__popup').removeClass('mobile-expanded');
          }
        }
      });
    }
    
  });

  /*$(window).on('load', function(){
    setTimeout(calcBlanketDiscount, 2000);
  });*/
