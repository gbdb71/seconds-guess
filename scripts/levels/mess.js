define(['../level_capabilities', 'Howler'], function (addLevelCapabilities, howler) {
    
    var Level = function (params) {
        addLevelCapabilities(this, params);
        this.initEvents();
        this.badNumbers = true;
        
        this.instructions = [
            ['bad', 'DON \' T trust anything !'],
            ['good', 'except, if you must, the first music...']
        ];
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        setTimeout(function () {
            level.sound.play();
            setTimeout(function () {
                level.sound2.play();
            }, 3600);
            setTimeout(function () {
                level.sound3.play();
            }, 6000 + Math.random() * 500);
            setTimeout(function () {
                level.chronoStart();
            }, 3000);
        }, Math.random()*1000); 
    };
    
    
    
    Level.prototype.setScore = function () {
        this.score = this.classicScore(1500);
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
        
        
        eventBus.on('ui ready', function () {
            eventBus.emit('wait for load');
            
            level.sound = new howler.Howl({
                loop: true,
                volume: 0.6,
                urls: ['sounds/sample02.ogg'],
                onload: function () {
                    level.sound2 = new howler.Howl({
                        loop: true,
                        volume: 0.4,
                        urls: ['sounds/sample02.ogg'],
                        onload: function () {
                            level.sound3 = new howler.Howl({
                                loop: true,
                                volume: 0.6,
                                urls: ['sounds/sample03.ogg'],
                                onload: function () {
                                    eventBus.emit('loading complete');
                                }
                            });
                        }
                    });
                }
            });
            
        });
        
        eventBus.on('stop all', function () {
            level.sound.fade(0.6, 0, 2000);
            level.sound2.fade(0.4, 0, 500);
            level.sound3.fade(0.6, 0, 500);
            /*level.sound3.fade(1, 0, 1500);*/
        });
        
    };
    
    return Level;
    
});