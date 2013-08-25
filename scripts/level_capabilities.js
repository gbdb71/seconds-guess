define(function () { return function (level, params) {

    var eventBus = params.eventBus;
    
    level.startTime = null;
    level.eventBus  = eventBus;
    level.name      = params.name;
    level.title     = params.title;
    level.combo     = params.combo;
    level.score     = 0;
    
    
    eventBus.on('ui ready', function () {
        eventBus.emit('display infos', {
            title:          level.title,
            combo:          level.combo,
            instructions:   level.instructions
        });
    });
    
    eventBus.on('player ready', function () {
        if (!level.started) {
            level.start();
            level.started = true;
        }
    });
    
    
    eventBus.on('continue', function () {
        eventBus.emit('stop all');
    });
    
    
    eventBus.on('back', function () {
        eventBus.emit('stop all');
    });
    
    
    eventBus.on('chrono stop', function () {
        if (!level.startTime || level.dt) {
            return;
        }
        level.dt = level.targetTime - (new Date()).getTime();
        clearTimeout(level.tooLateTimer);
        
        level.setScore();
        eventBus.emit('scored', level.dt, level.score);
    });
    
    
    level.chronoStart = function () {
        this.startTime  = (new Date()).getTime();
        this.targetTime = this.startTime + 10000; 
        eventBus.emit('chrono started');
        
        level.tooLateTimer = setTimeout(function () {
            eventBus.emit('too late');
        }, 15000);
    };
    
    
    level.countNextSecond = function (until) {
        var untilSecond = until || 0;
        var remaining   = level.targetTime - (new Date()).getTime();
        var fullSeconds = Math.floor(remaining / 1000);
        if (fullSeconds >= untilSecond && !level.dt) {
            setTimeout(function () {
                eventBus.emit('countdown', fullSeconds);

                if (typeof until !== 'undefined') {
                    setTimeout(function () {
                        level.countNextSecond(until);
                    }, 300);
                }

            }, remaining - 1000 * fullSeconds);
        }
        return fullSeconds;
    };

    level.classicScore = function (semiWidth) {
        return Math.round(1000 * Math.pow(2, -Math.abs(level.dt/(semiWidth*0.95))));
    };
    
};});