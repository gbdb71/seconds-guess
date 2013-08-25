define(['underscore', 'jquery', 'impress', 'level_ui'], function (_, $, impress, LevelUI) {
    
    var ui = {};

    var eventBus;
    var levelToScreen = {};

    
    ui.init = function (container, _eventBus, levels) {
        eventBus = _eventBus;
        
        this.$container = container;
        container.html(_.template($('#mainTemplate').html(), {
            email: 'pierre' + '@toxicode.fr'
        }));

        
        this.$homeContainer         = container.find('#home');
        this.$levelsIndexContainer  = container.find('#levels');
        this.$comboEndContainer     = container.find('#comboEnd');
        
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
        eventBus.emit('player wants level', levelName);
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
        
        $('.playCombo').click(function () {
            eventBus.emit('play combo');
        });
        
        this.$container.on('click', '.gotoHome', function () {
            ui.goTo('home');
        });
    };
    
    
    ui.loadLevel = function (levelName, levelEventBus) {
        var levelElemID = levelToScreen[levelName];
        this.$levelContainer = $('#'+levelElemID);

        this.$levelContainer.html(_.template($('#levelTemplate').html()));
        
        this.goTo(levelElemID);
        
        var template = $('#'+levelName+'Template').html();
        if (template) {
            this.$levelContainer.find('.levelContent').html(_.template($('#'+levelName+'Template').html()));
        }
        
        this.levelEventBus = levelEventBus;
        new LevelUI(this.$levelContainer, levelEventBus);
    };
    
    
    
    ui.showComboEnd = function (score, time) {
        this.$comboEndContainer.html(_.template($('#comboEndTemplate').html(), {
            score: score,
            time: time
        }));
        
        var $cont = this.$comboEndContainer.find('.endContainer');
        $cont.css({
            'margin-top': (0.4 * (this.$comboEndContainer.height() - $cont.height()))+'px'
        });
        
        this.goTo('comboEnd');
    };
    
    
    
    ui.initEvents = function () {

        eventBus.on('show index', function (levels) {
            ui.loadLevelIndex(levels);
        });

        eventBus.on('level loaded', function (levelName, levelEventBus) {
            ui.loadLevel(levelName, levelEventBus);
        });
        
        eventBus.on('combo end', function (score, time) {
            ui.showComboEnd(score, time);
        });
        
    };
    

    
    
    return ui;
    
});