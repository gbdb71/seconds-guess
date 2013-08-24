define(['underscore', 'jquery', 'level_ui'], function (_, $, LevelUI) {
    
    var ui = {};

    var eventBus;
    
    
    ui.init = function (container, _eventBus) {
        eventBus = _eventBus;
        
        this.$container = container;
        container.html(_.template($('#mainTemplate').html()));
        
        this.$infoBar        = container.find('.infoBar');
        this.$mainContainer  = container.find('.main');
        this.$levelContainer = container.find('.level');
        
        this.loadBehaviours();
        this.initEvents();
    };
    
    
    
    ui.loadLevelIndex = function (levels) {
        this.$infoBar.hide();
        this.$levelContainer.hide();
        this.$mainContainer.show().html(_.template($('#levelIndexTemplate').html()));
        _.each(levels, function (levelTitle, levelName) {
            $('#levelIndex').append(_.template($('#levelInList').html(), {
                title: levelTitle,
                name:  levelName
            }));
        });
    };
    
    
    ui.loadLevel = function (levelName) {
        eventBus.emit('load level', levelName);
        this.$mainContainer.hide();
        this.$levelContainer.show().html(_.template($('#levelTemplate').html()));
        var template = $('#'+levelName+'Template').html();
        if (template) {
            this.$levelContainer.find('.levelContent').html(_.template($('#'+levelName+'Template').html()));
        }
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
        
        $(window).resize(function () {
            ui.levelEventBus.emit('resize');
        });
        
    };
    
    
    ui.initEvents = function () {

        eventBus.on('show index', function (levels) {
            ui.loadLevelIndex(levels);
        });

        eventBus.on('level loaded', function (levelCode, levelEventBus) {
            ui.levelEventBus = levelEventBus;
            ui.$infoBar.show().find('.message').html(levelCode);
            new LevelUI(ui.$levelContainer, levelEventBus);
        });
        
    };
    

    
    
    return ui;
    
});