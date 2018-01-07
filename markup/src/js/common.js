$(function () {
    $('[js-rating]').each(function () {
        let $root = $(this);

        console.log($root);
        let $inputs = $root.find('[js-rating-item]');
        let $inputHidden = $root.find('[js-rating-input]');

        $inputs.on('click', function () {
            let $root = $(this);
            let value = $root.data('value');
            $inputHidden.val(value);
            $inputs.removeClass('rating__item_active');

            $root.addClass('rating__item_active');
            $inputs.each(function () {
                let $root = $(this);

                if ($root.data('value') == value) {
                    return false
                }
                $root.addClass('rating__item_active');
            });
        })
    })

})

$(function () {
    $(function () {

        let $sliders = $('[js-film-recommend]');

        $sliders.each(function () {

            let $slider = $(this);
            let $sliderList = $slider.find('[js-film-recommend-list]');
            let $sliderPrev = $slider.find('[js-film-recommend-prev]');
            let $sliderNext = $slider.find('[js-film-recommend-next]');
            let $sliderDots = $slider.find('[js-film-slider-dots]');

            let $sliderItems = 5;

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
                mouseDrag: true,/
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
})