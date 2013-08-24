define(['underscore', 'jquery'], function (_, $) {
    
    var LevelUI = function (container, eventBus) {
        this.eventBus   = eventBus;
        this.$container = container;
        
        this.initEvents();
        
        eventBus.emit('ui ready', this.$container);
        
    };
    
    
    LevelUI.prototype.initEvents = function () {
        
        this.eventBus.on('chrono started', function () {
            console.log('Chrono started');
        });
        
    };

    return LevelUI;
    
});