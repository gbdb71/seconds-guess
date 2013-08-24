define(['underscore', 'jquery'], function (_, $) {
    
    var LevelUI = function (container, eventBus) {
        this.eventBus   = eventBus;
        this.$container = container;
        
        this.$chronoContainer = $('#chrono'); //FIXME
        this.$chronoMessage   = this.$chronoContainer.find('.message');
        this.$count           = this.$chronoContainer.find('.countdown');
        
        this.$levelEnd        = $('#levelEnd'); //FIXME
        
        this.initEvents();
        
        eventBus.emit('ui ready', this.$container);
        
    };
    
    
    LevelUI.prototype.initEvents = function () {
        
        var ui = this;
        var eventBus = this.eventBus;
        
        
        eventBus.on('chrono started', function () {
            ui.$chronoMessage.show().html('Chrono started... type space to guess');
        });
        
        eventBus.on('countdown', function (time) {
            ui.$count.html(time);
        });
        
        eventBus.on('chrono stopped', function (dt) {
            ui.displayEnd('You stopped', dt);
        });
        
        eventBus.on('too late', function () {
            ui.displayEnd('Bad timing - more than 15 seconds !', '');
        });
        
    };
    
    LevelUI.prototype.displayEnd = function (message, time) {
        this.$chronoContainer.hide();
        this.$levelEnd.html(message + '<br />'+ time);
    };

    return LevelUI;
    
});