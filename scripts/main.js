require.config({
    paths: {
        'jquery':       'ext_libs/jquery',
        'underscore':   'ext_libs/underscore',
        'impress':      'ext_libs/impress',
        'Howler':       'ext_libs/howler'
    },
    shim: {
        'howddler': {
            exports: 'Howl'
        },
        'impress': {
            exports: 'impress'
        },
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        }
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});

require(['jquery', 'game'], function ($, game) {
    
    $(function() {
        game.init($('#game'));
    });
    
});