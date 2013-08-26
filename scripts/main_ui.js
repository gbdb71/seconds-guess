define(['underscore', 'jquery', 'impress', 'level_ui', 'Howler'], function (_, $, impress, LevelUI, howler) {
    
    var ui = {};

    var eventBus;
    var levelToScreen = {};
    
    
    /*var bip1 = new howler.Howl({
        volume: 0.2,
        urls: ['sounds/click01.ogg']
    });
    
    var bip2 = new howler.Howl({
        volume: 0.2,
        urls: ['sounds/click02.ogg']
    });*/

    
    ui.init = function (container, _eventBus, levels) {
        eventBus = _eventBus;
        
        this.$container = container;
        container.html(_.template($('#mainTemplate').html(), {
            email: 'pierre' + '@toxicode.fr'
        }));

        
        this.$homeContainer         = container.find('#home');
        this.$scoresContainer       = container.find('#scores');
        this.$levelsIndexContainer  = container.find('#levels');
        this.$comboEndContainer     = container.find('#comboEnd');
        
        this.associateLevelsWithScreens(levels);
        
        
        var height =  $(window).height() * 0.9;
        var width  =  Math.min($(window).width()*0.9, height * 2);
        
        this.$container.attr('data-width', width).attr('data-height', height);
        this.$container.css('font-size', Math.round(Math.min(width/26, height/8))+'px');
        
        
        $('.step').css({
            width:  width+'px',
            height: height+'px'
        });
        
        this.loadBehaviours();
        
        this.impress = impress('game');
        this.impress.init();
        this.goTo('help', 0);
        $('.play').delay(1000).fadeIn(1000);
        
        
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
            levelToScreen[levelName] = 'levelScreen_'+(i%4);
            i += 1;
        });
    };
    
    
    function getUrlParameter (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    };
    
    ui.loadLevelIndex = function (levels) {
        
        var showTimes = getUrlParameter('score') === 'time';
        this.$levelsIndexContainer.html(_.template($('#levelIndexTemplate').html()));
        _.each(levels, function (levelInfo, levelName) {
            $('#levelIndex').append(_.template($('#levelInList').html(), {
                level:      levelInfo,
                name:       levelName,
                showTimes:  showTimes
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
        
        $('body').on('click', function (e) {
            if (ui.levelEventBus) {
                ui.levelEventBus.emit('player action');
            }
        });
        
        $(window).resize(function () {
            if (ui.levelEventBus) {
                ui.levelEventBus.emit('resize');
            }
        });
        
        $('.gotoLevels').click(function () {
            eventBus.emit('player wants index');
        });
        
        $('.gotoScores').click(function () {
            eventBus.emit('player wants scores');
        });
        
        $('.playCombo').click(function () {
            eventBus.emit('play combo');
        });
        
        this.$container.on('click', '.gotoHome, .play', function () {
            ui.goTo('home');
        });
    };
    
    
    
    ui.loadLevel = function (levelName, levelEventBus) {
        var levelElemID = levelToScreen[levelName];

        this.levelEventBus = levelEventBus;
        new LevelUI(levelElemID, levelName, levelEventBus);
        
        this.goTo(levelElemID);
    };
    
    
    
    ui.showComboEnd = function (score, time, nickname) {
        this.$comboEndContainer.html(_.template($('#comboEndTemplate').html(), {
            score:      score,
            time:       time,
            nickname:   nickname
        }));
        
        var $cont = this.$comboEndContainer.find('.endContainer');
        $cont.css({
            'margin-top': (0.4 * (this.$comboEndContainer.height() - $cont.height()))+'px'
        });
        
        $('.sendScore').click(function () {
            $('.submit').fadeOut(500);
            eventBus.emit('submit score', $('.submit input').val());
        });
        
        this.goTo('comboEnd');
    };
    
    
    ui.showScores = function (yours, others) {
        this.$scoresContainer.html(_.template($('#scoresTemplate').html(), {
            yourScore: yours,
            others: others
        }));
        
        this.goTo('scores');
    };
    
    
    
    ui.initEvents = function () {

        eventBus.on('show index', function (levels) {
            ui.loadLevelIndex(levels);
        });
        
        eventBus.on('show scores', function (yours, data) {
            ui.showScores(yours, data);
        });

        eventBus.on('level loaded', function (levelName, levelEventBus) {
            ui.loadLevel(levelName, levelEventBus);
        });
        
        eventBus.on('level unloaded', function (score, time) {
            delete ui.levelEventBus;
        });
        
        eventBus.on('combo end', function (score, time, nickname) {
            ui.showComboEnd(score, time, nickname);
        });
        
        eventBus.on('combo aborted', function (score, time) {
            ui.goTo('home');
        });
        
    };
    

    
    
    return ui;
    
});