define(['../level_capabilities', 'Howler'], function (addLevelCapabilities, howler) {
    
    var Level = function (params) {
        addLevelCapabilities(this, params);
        this.initEvents();
        
        this.instructions = [
            ['bad', 'DON \' T trust the music !']
        ];
        
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        setTimeout(function () {
            level.sound.play();
            setTimeout(function () {
                level.chronoStart();
            }, 3000);
        }, Math.random()*1000); 
    };
    
    
    Level.prototype.setScore = function () {
        this.score = this.classicScore(800);
    };
    
    
    Level.prototype.initEvents = function () {
        var level    = this;
        var eventBus = this.eventBus;
        
        eventBus.on('chrono started', function () {
            var seconds = level.countNextSecond(8);
            if (seconds < 10) {
                eventBus.emit('countdown', 10);
            }
        });
        
        eventBus.on('ui ready', function () {
            eventBus.emit('wait for load');
            
            level.sound = new howler.Howl({
                loop: true,
                urls: ['sounds/sample02_fast.ogg'],
                onload: function () {
                    eventBus.emit('loading complete');
                }
            });
            
        });
        
        eventBus.on('stop all', function () {
            level.sound.fade(1, 0, 1500);
        });
        
    };
    
    return Level;
    
});