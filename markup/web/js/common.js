'use strict';

$(function () {
    $('[js-rating]').each(function () {
        var $root = $(this);

        console.log($root);
        var $inputs = $root.find('[js-rating-item]');
        var $inputHidden = $root.find('[js-rating-input]');

        $inputs.on('click', function () {
            var $root = $(this);
            var value = $root.data('value');
            $inputHidden.val(value);
            $inputs.removeClass('rating__item_active');

            $root.addClass('rating__item_active');
            $inputs.each(function () {
                var $root = $(this);

                if ($root.data('value') == value) {
                    return false;
                }
                $root.addClass('rating__item_active');
            });
        });
    });
});

$(function () {
    $(function () {

        var $sliders = $('[js-film-recommend]');

        $sliders.each(function () {

            var $slider = $(this);
            var $sliderList = $slider.find('[js-film-recommend-list]');
            var $sliderPrev = $slider.find('[js-film-recommend-prev]');
            var $sliderNext = $slider.find('[js-film-recommend-next]');
            var $sliderDots = $slider.find('[js-film-slider-dots]');

            var $sliderItems = 5;

            if ($sliderList[0].hasAttribute('data-items')) {

                $sliderItems = $sliderList.data('items');

                console.log($sliderItems);
            }

            initSlider($sliderList, $sliderDots, $sliderNext, $sliderPrev, $sliderItems);
        });

        function initSlider($slider, $sliderDots, $sliderNext, $sliderPrev, $sliderItems) {
            $slider.addClass('owl-carousel owl-theme');
            $slider.owlCarousel({
                loop: false,
                dots: false,
                center: false,
                nav: false,
                margin: 10,
                autoHeight: true,
                mouseDrag: true,
                items: $sliderItems,
                responsive: {
                    // breakpoint from 0 up
                    0: {
                        items: 1
                    },
                    750: {
                        items: 3
                    },
                    1000: {
                        items: $sliderItems
                    }
                }
            });

            $sliderNext.on('click', function () {
                $slider.trigger('next.owl.carousel');
            });

            $sliderPrev.on('click', function () {
                $slider.trigger('prev.owl.carousel');
            });
        }
    });
});
"use strict";
//# sourceMappingURL=common.js.map
