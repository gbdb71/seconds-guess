define(function () { return function (level, eventBus) {

    level.eventBus  = eventBus;
    level.startTime = null;
    
    eventBus.on('ui ready', function (container) {
        level.$container = container;
        level.start();
    });
    
    level.chronoStart = function () {
        this.startTime = (new Date()).getTime();
        this.eventBus.emit('chrono started');
    };
    
    level.chronoStop = function () {
        var dt = (new Date()).getTime() - this.startTime - 10000;
        this.eventBus.emit('chrono stopped', dt);
        return dt;
    };
    
    
};});