define(['underscore', 'add_event_capabilities', 'main_ui'], function (_, addEventCapabilities, ui) {
    
    var game = {};
    
    var mainEventBus = {};
    addEventCapabilities(mainEventBus);
    
    var levels = {
        'test': 'Test Level'
    };
    
    
    game.init = function (container) {
        ui.init(container, mainEventBus);
        ui.loadLevelIndex(levels);
    };
    
    
    mainEventBus.on('load level', function (levelName) {
        game.loadLevel(levelName);
    });
    

    game.loadLevel = function (levelName) {
        delete game.currentLevel;
        game.levelEventBus = {};
        addEventCapabilities(game.levelEventBus);
        
        require(['levels/' + levelName], function (Level) {
            game.currentLevel = new Level(game.levelEventBus);
            mainEventBus.emit('level loaded', levelName, game.levelEventBus);
        });
    };

    
    return game;
    
});