define(function () { return function (level, eventBus) {

    level.startTime = null;
    level.eventBus  = eventBus;
    
    eventBus.on('ui ready', function (container) {
        level.$container = container;
        level.start();
    });
    
    
    eventBus.on('chrono stop', function () {
        if (!level.startTime || level.stopTime) {
            return;
        }
        level.stopTime = (new Date()).getTime();
        eventBus.emit('chrono stopped', level.stopTime - level.targetTime);
        clearTimeout(this.tooLateTimer);
    });
    
    
    level.chronoStart = function () {
        this.startTime  = (new Date()).getTime();
        this.targetTime = this.startTime + 10000; 
        eventBus.emit('chrono started');
        
        level.tooLateTimer = setTimeout(function () {
            eventBus.emit('too late');
        }, 15000);
    };
    
    
    level.countNextSecond = function (andAgain) {
        var remaining   = level.targetTime - (new Date()).getTime();
        var fullSeconds = Math.floor(remaining / 1000);
        if (fullSeconds < 0 || level.stopTime) {
            return;
        }
        setTimeout(function () {
            eventBus.emit('countdown', fullSeconds);
            
            if (andAgain) {
                setTimeout(function () {
                    level.countNextSecond(andAgain);
                }, 300);
            }
            
        }, remaining - 1000 * fullSeconds);
    };

    
};});