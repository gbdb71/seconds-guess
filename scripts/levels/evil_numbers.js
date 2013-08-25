define(['../level_capabilities'], function (addLevelCapabilities) {
    
    var Level = function (params) {
        addLevelCapabilities(this, params);
        this.initEvents();
        
        this.instructions = [
            ['bad', 'DON \' T trust the numbers !']
        ];
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        
        setTimeout(function () {
            level.chronoStart();
        }, Math.random()*1000 + 500);
        
    };
    
    
    Level.prototype.setScore = function () {
        this.score = this.classicScore(500);
    };
    
    Level.prototype.emitFake = function (seconds) {
        var level = this;
        setTimeout(function () {
            seconds -= 1;
            level.eventBus.emit('countdown', seconds);
            if (seconds > 0) {
                level.emitFake(seconds);
            }
        }, 600 + Math.random() * 500);
    };
    
    Level.prototype.initEvents = function () {
        var level    = this;
        var eventBus = this.eventBus;
        
        eventBus.on('chrono started', function () {
            eventBus.emit('countdown', 10);
            level.emitFake(10);
        });
    };
    
    return Level;
    
});