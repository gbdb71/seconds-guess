define(['underscore', 'jquery', 'level_ui'], function (_, $, LevelUI) {
    
    var ui = {};

    var eventBus;
    
    
    ui.init = function (container, _eventBus) {
        eventBus = _eventBus;
        
        this.$container = container;
        container.html(_.template($('#mainTemplate').html()));
        
        this.$infoBar        = container.find('#infoBar');
        this.$levelContainer = container.find('#level');
        
        ui.loadBehaviours();
        ui.initEvents();
    };
    
    
    
    ui.loadLevelIndex = function (levels) {
        this.$levelContainer.html(_.template($('#levelIndexTemplate').html()));
        _.each(levels, function (levelTitle, levelName) {
            $('#levelIndex').append(_.template($('#levelInList').html(), {
                title: levelTitle,
                name:  levelName
            }));
        });
    };
    
    
    ui.loadLevel = function (levelName) {
        eventBus.emit('load level', levelName);
        this.$levelContainer.html(_.template($('#'+levelName+'Template').html()));
    };
    
    
    ui.loadBehaviours = function () {
        
        this.$container.on('click', '.levelItem', function (e) {
            ui.loadLevel($(this).data('level'));
        });
        
        $('body').on('keydown', function (e) {
            if (e.keyCode === 32) {
                ui.levelEventBus.emit('chrono stop');
            }
        });
        
    };
    
    
    ui.initEvents = function () {

        eventBus.on('level loaded', function (levelCode, levelEventBus) {
            ui.levelEventBus = levelEventBus;
            ui.$infoBar.html("Loaded level " + levelCode);
            new LevelUI(this.$levelContainer, levelEventBus);
        });
        
    };
    

    
    
    return ui;
    
});