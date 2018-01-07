window.deviceType = {
    browser: (function () {
        var ua = navigator.userAgent;
        var tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        var assign = function (obj) {
            document.documentElement.classList.add(obj.name);
            document.documentElement.classList.add(obj.name+obj.version);
            return obj;
        };
        if ( /trident/i.test(M[1]) ) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return assign({
                name:'ie',
                version:(tem[1]||'')
            });
        }
        if ( M[1] === 'Chrome' ) {
            tem = ua.match(/\bOPR\/(\d+)/);
            if ( tem!=null ) {
                return assign({
                    name:'opera',
                    version:tem[1]
                });
            }
        }
        M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if( (tem = ua.match(/version\/(\d+)/i)) != null ) {
            M.splice(1,1,tem[1]);
        }
        if ( M[0] === 'Chrome' && ua.match(/Edge/i) ) {
            return assign({
                name:'edge',
                version:M[1]
            });
        }
        return assign({
          name: M[0].toLowerCase(),
          version: M[1]
      });
    })(),
    mobile: isMobile.any,
    mouse: false,
    touch: false,
    scrollWidth: 0
};

$(function(){
    var $window = $(window);
    var docElement = document.documentElement;
    var $test = $('<div />').css({
        'position': 'absolute',
        'top': -500,
        'overflow': 'scroll'
    }).appendTo(document.body);

    deviceType.scrollWidth = $test.outerWidth();

    if ( deviceType.mobile ) {
        deviceType.touch = true;
        docElement.classList.add('device-mobile');
        docElement.classList.add('device-touch');
        docElement.addEventListener('touchstart', function(){});
        // typeEvents('mouse');
    }
    else {
        deviceType.mouse = true;
        docElement.classList.add('device-mouse');
        // typeEvents('touch');
    }

    typeEvents();

    function typeEvents (type) {
        $window.off('.detect-device-pointer');
        if ( !type || type == 'touch' ) {
            $window.one('touchstart.detect-device-pointer', function () {
                $window.off('.detect-device-pointer');
                docElement.classList.remove('device-mouse');
                docElement.classList.add('device-touch');
                deviceType.touch = true;
                deviceType.mouse = false;
                $window.trigger('pointerChanged');
                // typeEvents('mouse');
            });
        }
        if ( !type || type == 'mouse' ) {
            $window.one('mousemove.detect-device-pointer', function () {
                $window.off('.detect-device-pointer');
                docElement.classList.remove('device-touch');
                docElement.classList.add('device-mouse');
                deviceType.touch = false;
                deviceType.mouse = true;
                $window.trigger('pointerChanged');
                // typeEvents('touch');
            });
        }
    }
});
