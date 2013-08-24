require.config({
    shim: {
        'ext_libs/jquery': {
            exports: '$'
        }
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});

require(['ext_libs/jquery', 'game'], function ($, game) {
    
    $(function() {
        game.init($('#game'));
    });
    
});