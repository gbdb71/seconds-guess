define(['../level_capabilities', 'Howler'], function (addLevelCapabilities, howler) {
    
    var Level = function (eventBus) {
        addLevelCapabilities(this, eventBus);
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
    
    return Level;
    
});