define(['underscore', 'jquery', 'impress', 'level_ui'], function (_, $, impress, LevelUI) {
    
    var ui = {};

    var eventBus;

    
    ui.init = function (container, _eventBus, levels) {
        eventBus = _eventBus;
        
        this.$container = container;
        container.html(_.template($('#mainTemplate').html()));
        
        
        
        this.$mainContainer  = container.find('.main');
        
        this.loadLevelTemplates(levels);
        
        $('.step').css({
            width:  ($(window).width()  * 0.9)+'px',
            height: ($(window).height() * 0.9)+'px'
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
    
    
    ui.loadLevelTemplates = function (levels) {
        _.each(levels, function (levelInfo, levelName) {
            var elem = $('<div id="level-'+levelName+'" class="step level"></div>');
            
            elem.attr('data-x', 1000).attr('data-y', -1500);
            ui.$container.append(elem);
        });
    };
    
    
    ui.loadLevelIndex = function (levels) {
        this.$mainContainer.html(_.template($('#levelIndexTemplate').html()));
        _.each(levels, function (levelInfo, levelName) {
            $('#levelIndex').append(_.template($('#levelInList').html(), {
                level:  levelInfo,
                name:   levelName
            }));
        });
        
        this.goTo('home');
    };
    
    
    ui.gotoLevel = function (levelName) {
        eventBus.emit('load level', levelName);
       
        var levelElemID = 'level-'+levelName;
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
            new LevelUI(ui.$levelContainer, levelEventBus);
        });
        
    };
    

    
    
    return ui;
    
});