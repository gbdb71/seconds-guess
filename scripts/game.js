define(['underscore', 'add_event_capabilities', 'main_ui'], function (_, addEventCapabilities, ui) {
    
    var game = {};
    
    var storageKey = '10_sec_toxi';
    
    var mainEventBus = {};
    addEventCapabilities(mainEventBus);
    
    var levels = {
        'numbers_all': {
            title : 'Easy'
        },
        'numbers_5': {
            title : 'Only five'
        },
        'nothing': {
            title : 'No help'
        }
    };
    
    game.init = function (container) {
        this.loadScores();
        ui.init(container, mainEventBus, levels);
    };
    
    
    mainEventBus.on('load level', function (levelName) {
        game.loadLevel(levelName);
    });
    
    
    mainEventBus.on('ask index', function () {
        mainEventBus.emit('show index', levels);
    });
    

    game.loadLevel = function (levelName) {
        delete game.currentLevel;
        game.levelEventBus = {};
        addEventCapabilities(game.levelEventBus);
        
        
        game.levelEventBus.on('scored', function (dt, score) {
            game.recordScore(dt, score);
        });
        
        game.levelEventBus.on('close level', function () {
            mainEventBus.emit('show index', levels);
        });
        
        require(['levels/' + levelName], function (Level) {
            game.currentLevel = new Level(game.levelEventBus);
            game.currentLevel.name  = levelName;
            game.currentLevel.title = levels[levelName].title;
            mainEventBus.emit('level loaded', levelName, game.levelEventBus);
        });
    };
    
    
    game.loadScores = function () {
        if (typeof localStorage === 'undefined' || !localStorage[storageKey]) {
            return;
        }
        
        _.each(levels, function (levelInfo, levelName) {
            var key = storageKey +'_' + levelName;
            _.extend(levels[levelName], JSON.parse(localStorage[key] || '{}'));
        });
    };
    
    
    
    
    game.recordScore = function (dt, score) {
        var levelName = game.currentLevel.name;
        if (typeof localStorage === 'undefined') {
            return;
        }
        
        var time = Math.abs(dt);
        
        var key = storageKey +'_' + levelName;
        
        storage = JSON.parse(localStorage[key] || '{}');
        
        storage.scores = storage.scores || [];
        storage.scores.push(score);    
    
        lastScores = _.last(storage.scores, 10);
        storage.meanScore = Math.round(_.reduce(lastScores, function(memo, num){ return memo + num; }, 0) / lastScores.length);
        
        storage.bestScore = Math.max(storage.bestScore || 0, score);
        
        
        
        storage.times = storage.times || [];
        storage.times.push(time);    
    
        lastTimes = _.last(storage.times, 10);
        storage.meanTime = Math.round(_.reduce(lastTimes, function(memo, num){ return memo + num; }, 0) / lastTimes.length);
        
        storage.bestTime = Math.max(storage.bestTime || 0, time);
        
        
        localStorage[key] = JSON.stringify(storage);
        
                
        this.loadScores();
    };
    
    return game;
    
});