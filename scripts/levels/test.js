define(['../level_capabilities', 'Howler'], function (addLevelCapabilities, howler) {
    
    var Level = function (eventBus) {
        addLevelCapabilities(this, eventBus);
        this.initEvents();
    };
    
    
    Level.prototype.start = function () {
        var level = this;
        
        $('#play').click(function() {
            var sound = new howler.Howl({
              urls: ['sounds/sample.ogg']
            }).play();
        });
        
        
        setTimeout(function () {
            level.chronoStart();
        }, 1000);
        
        
        
        
    };
    
    
    Level.prototype.initEvents = function () {
        var level    = this;
        var eventBus = this.eventBus;
        
        eventBus.on('chrono started', function () {
            eventBus.emit('countdown', 10);
            level.countNextSecond(true);
        });
    };
    
    return Level;
    
});