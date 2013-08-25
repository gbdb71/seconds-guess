define(['../level_capabilities', 'Howler'], function (addLevelCapabilities, howler) {
    
    var Level = function (params) {
        addLevelCapabilities(this, params);
        this.initEvents();
        
        this.instructions = [
            ['good', 'Trust the numbers'],
            ['good', 'Trust the music']
        ];
        
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        setTimeout(function () {
            level.sound.play();
            level.chronoStart();
        }, Math.random()*1000 + 500); 
    };
    
    
    Level.prototype.setScore = function () {
        this.score = this.classicScore(85);
    };
    
    
    Level.prototype.initEvents = function () {
        var level    = this;
        var eventBus = this.eventBus;
        
        eventBus.on('chrono started', function () {
            var seconds = level.countNextSecond(0);
            if (seconds < 10) {
                eventBus.emit('countdown', 10);
            }
        });
        
        eventBus.on('ui ready', function () {
            eventBus.emit('wait for load');
            
            level.sound = new howler.Howl({
              urls: ['sounds/sample.ogg']
            });
            
            level.sound.on('load', function () {
                eventBus.emit('loading complete');
            });    
        });
        
        eventBus.on('stop all', function () {
            level.sound.fade(1, 0, 1500);
        });
        
    };
    
    return Level;
    
});