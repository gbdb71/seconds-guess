define(['../level_capabilities', 'Howler'], function (addLevelCapabilities, howler) {
    
    var Level = function (params) {
        addLevelCapabilities(this, params);
        this.initEvents();
        
        this.instructions = [
            ['good', 'Trust the numbers... as long as you see them'],
            ['good', 'Trust the music... as long as you see hear it']
        ];
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        
        setTimeout(function () {
            level.sound.play();
            setTimeout(function () {
                level.chronoStart();
                setTimeout(function () {
                    level.sound.fade(1, 0, 1000);
                }, 4000);
            }, 4000);
        }, Math.random()*1000 + 500);
    };
    
    
    Level.prototype.setScore = function () {
        this.score = this.classicScore(250);
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
        
        eventBus.on('ui ready', function () {
            eventBus.emit('wait for load');
            
            level.sound = new howler.Howl({
                loop: true,
                urls: ['sounds/sample01.ogg'],
                onload: function () {
                    eventBus.emit('loading complete');
                }
            }); 
        });
        
        eventBus.on('stop all', function () {
            level.sound.stop();
        });
    };
    
    return Level;
    
});