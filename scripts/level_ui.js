define(['underscore', 'jquery'], function (_, $) {
    
    
    var LevelUI = function (container, eventBus) {
        this.eventBus   = eventBus;
        this.$container = container;
        
        this.$content         = this.$container.find('.levelContent');
        this.$chronoContainer = this.$container.find('.chrono');
        this.$chronoMessage   = this.$chronoContainer.find('.message');
        this.$count           = this.$chronoContainer.find('.countdown');
        
        this.$levelEnd        = this.$container.find('.levelEnd');
        
        this.initEvents();
        this.initBehaviours();
        
        this.resize();
        
        eventBus.emit('ui ready');
    };
    
    
    LevelUI.prototype.resize = function () {
        var h = $(window).height() - this.$content.offset().top;
        this.$content.css({
            height: h+'px'
        });
    };
    
    
    LevelUI.prototype.initBehaviours = function () {
        var ui = this;
        var eventBus = this.eventBus;
        
        this.$container.on('click', '.back', function () {
            eventBus.emit('close level');
        });
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
        
        eventBus.on('scored', function (dt, score) {
            ui.displayEnd('You stopped', dt, score);
        });
        
        eventBus.on('too late', function () {
            ui.displayEnd('Bad timing - more than 15 seconds !', '', 0);
        });
        
        eventBus.on('resize', function () {
            ui.resize();
        });
        
    };
    
    
    LevelUI.prototype.displayEnd = function (message, time, score) {
        this.$chronoContainer.hide();
        this.$levelEnd.show().html(_.template($('#levelEndTemplate').html(), {
            message: message,
            time:  time,
            score: score
        }));
    };


    return LevelUI;
    
});