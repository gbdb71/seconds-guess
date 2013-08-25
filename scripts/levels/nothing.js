define(['../level_capabilities'], function (addLevelCapabilities) {
    
    var Level = function (params) {
        addLevelCapabilities(this, params);
        this.initEvents();
        
        this.instructions = [
            ['neutral', 'No help here, you are all alone !']
        ];
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        
        setTimeout(function () {
            level.chronoStart();
        }, Math.random()*1000 + 600);
        
    };
    
    
    Level.prototype.setScore = function () {
        this.score = this.classicScore(700);
    };
    
    
    Level.prototype.initEvents = function () {
        var level    = this;
        var eventBus = this.eventBus;
        
        eventBus.on('chrono started', function () {
            eventBus.emit('countdown', 10);
        });
    };
    
    return Level;
    
});