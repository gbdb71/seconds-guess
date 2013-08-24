define(['underscore'], function (_) {
    
    var game = {};
    
    game.init = function (container) {
        this.$container = container;
        
        container.html(_.template($('#startPageTemplate').html()));
    };
    
    return game;
    
});