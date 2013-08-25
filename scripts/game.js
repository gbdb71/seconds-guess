define(['underscore', 'add_event_capabilities', 'main_ui'], function (_, addEventCapabilities, ui) {
    
    var game = {};
    
    var storageKey = '10_sec_toxi';
    
    var mainEventBus = {};
    addEventCapabilities(mainEventBus, 'Game');
    
    var levels = {
        'numbers_all': {
            title : 'Easy'
        },
        'music_numbers_all': {
            title : 'Easy in music'
        },
        'numbers_5': {
            title : 'Only five'
        },
        'nothing': {
            title : 'No help'
        },
        'bad_music_good_numbers': {
            title : 'Love numbers'
        },
        'only_bad_music': {
            title : 'Only bad music'
        },
        'evil_numbers': {
            title : 'Evil numbers'
        }
    };
    
    game.init = function (container) {
        this.loadScores();
        ui.init(container, mainEventBus, levels);
    };
    
    
    mainEventBus.on('player wants level', function (levelName) {
        game.comboIndex = false;
        game.loadLevel(levelName);
    });
    
    mainEventBus.on('player wants index', function () {
        game.unloadLevel();
        mainEventBus.emit('show index', levels);
    });
    
    mainEventBus.on('player wants scores', function () {
        mainEventBus.emit('show scores', game.comboScores);
    });
    
    mainEventBus.on('play combo', function () {
        game.initCombo();
    });
    
    
    game.initCombo = function () {
        this.comboList      = _.keys(levels);
        this.comboScore     = 0;
        this.comboTime      = 0;
        this.comboIndex     = 0;
        this.comboLength    = this.comboList.length;
        this.comboNext();
    };
    
    
    game.comboNext = function () {
        this.comboIndex += 1;
        if (this.comboIndex <= this.comboLength) {
            this.loadLevel(this.comboList[this.comboIndex - 1]);
        } else {
            this.comboEnd();
        }
    };
    
    
    game.comboEnd = function () {
        game.recordScore('combo', this.comboTime, this.comboScore);
        mainEventBus.emit('combo end', this.comboScore, this.comboTime);
        this.comboIndex = false;
    };
    
    game.comboAbort = function () {
        this.comboIndex = false;
        mainEventBus.emit('combo aborted');
    };
    
    game.unloadLevel = function () {
        mainEventBus.emit('level unloaded');
        delete game.currentLevel;
        delete game.levelEventBus;
    };

    game.loadLevel = function (levelName) {
        this.unloadLevel();
        game.levelEventBus = {};
        addEventCapabilities(game.levelEventBus, levelName);
        
        
        game.levelEventBus.on('scored', function (dt, score) {
            game.recordScore(game.currentLevel.name, dt, score);
            if (game.comboIndex) {
                game.comboScore += score;
                game.comboTime  += Math.abs(dt);
            }
        });
        
        game.levelEventBus.on('back', function () {
            if (game.comboIndex) {
                game.comboAbort();
            } else {
                mainEventBus.emit('show index', levels);
            }
        });
        
        game.levelEventBus.on('continue', function () {
            if (game.comboIndex) {
                game.comboNext();
            } else {
                mainEventBus.emit('show index', levels);
            }
        });
        
        require(['levels/' + levelName], function (Level) {
            game.currentLevel = new Level({
                name:       levelName,
                title:      levels[levelName].title,
                eventBus:   game.levelEventBus,
                combo:      !game.comboIndex ? false : {
                    index: game.comboIndex,
                    total: game.comboLength
                }
            });
            mainEventBus.emit('level loaded', levelName, game.levelEventBus);
        });
    };
    
    
    game.loadScores = function () {
        if (typeof localStorage === 'undefined') {
            return;
        }
        
        _.each(levels, function (levelInfo, levelName) {
            var key = storageKey +'_' + levelName;
            try {
                _.extend(levels[levelName], JSON.parse(localStorage[key] || '{}'));
            } catch (e) {
                
            }
        });
        
        
        
        try {
            this.comboScores = JSON.parse(localStorage[storageKey + '_combo'] || '{}');
        } catch (e) {
            this.comboScores = {};
        }
    };
    
    
    
    
    
    
    game.recordScore = function (levelName, dt, score) {
        if (typeof localStorage === 'undefined') {
            return;
        }
        
        var time = Math.abs(dt);
        
        var key = storageKey +'_' + levelName;
        
        storage = JSON.parse(localStorage[key] || '{}');
        
        storage.scores = storage.scores || [];
        storage.scores.push(score);    
    
        lastScores = _.last(storage.scores, 5);
        if (lastScores.length >= 5) {
            storage.meanScore = Math.round(_.reduce(lastScores, function(memo, num){ return memo + num; }, 0) / lastScores.length);
        }
        storage.bestScore = Math.max(storage.bestScore || 0, score);
        
        
        
        storage.times = storage.times || [];
        storage.times.push(time);    
    
        lastTimes = _.last(storage.times, 5);
        if (lastTimes.length >= 5) {
            storage.meanTime = Math.round(_.reduce(lastTimes, function(memo, num){ return memo + num; }, 0) / lastTimes.length);
        }
        storage.bestTime = Math.max(storage.bestTime || 0, time);
        
        
        localStorage[key] = JSON.stringify(storage);
        
                
        this.loadScores();
    };
    
    return game;
    
});