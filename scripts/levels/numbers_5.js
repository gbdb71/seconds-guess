define(['../level_capabilities'], function (addLevelCapabilities) {
    
    var Level = function (eventBus) {
        addLevelCapabilities(this, eventBus);
        this.initEvents();
        
        this.instructions = [
            ['good', 'Trust the numbers... as long as you see them']
        ];
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        
        setTimeout(function () {
            level.chronoStart();
        }, Math.random()*700 + 300);
        
    };
    
    
    Level.prototype.setScore = function () {
        this.score = this.classicScore(400);
    };
    
    
    Level.prototype.initEvents = function () {
        var level    = this;
        var eventBus = this.eventBus;
        
        eventBus.on('chrono started', function () {
            var seconds = level.countNextSecond(5);
            if (seconds < 10) {
                eventBus.emit('countdown', 10);
            }
        });
    };
    
    return Level;
    
});