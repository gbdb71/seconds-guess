define(['underscore', 'jquery', 'impress', 'level_ui'], function (_, $, impress, LevelUI) {
    
    var ui = {};

    var eventBus;
    var levelToScreen = {};

    
    ui.init = function (container, _eventBus, levels) {
        eventBus = _eventBus;
        
        this.$container = container;
        container.html(_.template($('#mainTemplate').html()));

        
        this.$homeContainer         = container.find('#home');
        this.$levelsIndexContainer  = container.find('#levels');
        
        this.associateLevelsWithScreens(levels);
        
        var width  =  $(window).width()  * 0.9;
        var height =  $(window).height() * 0.9;
        
        this.$container.attr('data-width', width).attr('data-height', height);
        this.$container.css('font-size', Math.round(Math.min(width/30, height/10))+'px');
        
        
        $('.step').css({
            width:  width+'px',
            height: height+'px'
        });
        
        this.loadBehaviours();
        
        this.impress = impress('game');
        this.impress.init();
        this.goTo(0, 0);
        
        
        this.initEvents();
    };
    
    
    ui.goTo = function (pageName, duration) {
        setTimeout(function () {
            ui.impress['goto'](pageName, duration);
        }, 1);
    };
    
    
    ui.associateLevelsWithScreens = function (levels) {
        var i = 0;
        _.each(levels, function (levelInfo, levelName) {
            levelToScreen[levelName] = 'levelScreen_1';
            i += 1;
        });
    };
    
    
    ui.loadLevelIndex = function (levels) {
        this.$levelsIndexContainer.html(_.template($('#levelIndexTemplate').html()));
        _.each(levels, function (levelInfo, levelName) {
            $('#levelIndex').append(_.template($('#levelInList').html(), {
                level:  levelInfo,
                name:   levelName
            }));
        });
        
        this.goTo('levels');
    };
    
    
    ui.gotoLevel = function (levelName) {
        eventBus.emit('load level', levelName);
       
        var levelElemID = levelToScreen[levelName];
        this.$levelContainer = $('#'+levelElemID);

        this.$levelContainer.html(_.template($('#levelTemplate').html()));
        
        this.goTo(levelElemID);
        
        var template = $('#'+levelName+'Template').html();
        if (template) {
            this.$levelContainer.find('.levelContent').html(_.template($('#'+levelName+'Template').html()));
        }
        
    };
    
    
    ui.loadBehaviours = function () {
        
        this.$container.on('click', '.levelItem', function (e) {
            ui.gotoLevel($(this).data('level'));
        });
        
        $('body').on('keydown', function (e) {
            if (e.keyCode === 32) {
                if (ui.levelEventBus) {
                    ui.levelEventBus.emit('player action');
                }
            }
        });
        
        $(window).resize(function () {
            ui.levelEventBus.emit('resize');
        });
        
        $('.gotoLevels').click(function () {
            eventBus.emit('ask index');
        });
        
        this.$container.on('click', '.gotoHome', function () {
            ui.goTo('home');
        });
    };
    
    
    ui.initEvents = function () {

        eventBus.on('show index', function (levels) {
            ui.loadLevelIndex(levels);
        });

        eventBus.on('level loaded', function (levelCode, levelEventBus) {
            ui.levelEventBus = levelEventBus;
            new LevelUI(ui.$levelContainer, levelEventBus);
        });
        
    };
    

    
    
    return ui;
    
});