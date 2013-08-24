require.config({
    paths: {
        'jquery':       'ext_libs/jquery',
        'underscore':   'ext_libs/underscore',
        'Howler':       'ext_libs/howler'
    },
    shim: {
        'howddler': {
            exports: 'Howl'
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

require(['jquery', 'game', 'add_event_capabilities'], function ($, game, addEventCapabilities) {
    
    var eventBus = {};
    addEventCapabilities(eventBus);
    
    $(function() {
        game.init($('#game'), eventBus);
    });
    
});