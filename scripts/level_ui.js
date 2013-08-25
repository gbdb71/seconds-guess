define(['underscore', 'jquery'], function (_, $) {
    
    
    var LevelUI = function (container, eventBus) {
        this.eventBus   = eventBus;
        this.$container = container;
        
        this.$infoBar         = this.$container.find('.infoBar');
        this.$content         = this.$container.find('.levelContent');
        this.$levelStart      = this.$container.find('.levelStart');
        this.$levelEnd        = this.$container.find('.levelEnd');
        this.$explanations    = this.$container.find('.explanations');
        
        this.$chronoContainer = this.$container.find('.chrono');
        this.$chronoMessage   = this.$chronoContainer.find('.message');
        this.$count           = this.$chronoContainer.find('.countdown');
        
        
        
        this.initEvents();
        this.initBehaviours();
        
        
        this.resize();
        
        eventBus.emit('ui ready');
    };
    
    
    LevelUI.prototype.resize = function () {
    };
    
    
    LevelUI.prototype.initBehaviours = function () {
        var ui = this;
        var eventBus = this.eventBus;
        
        this.$container.on('click', '.back', function () {
            eventBus.emit('close level');
        });
        
        this.$container.on('click', '.go', function () {
            ui.$levelStart.hide();
            eventBus.emit('player ready');
        });
        
        eventBus.on('player action', function () {
            if (ui.chronoStopped) {
                eventBus.emit('close level');
            } else if (ui.chronoStarted) {
                eventBus.emit('chrono stop');
            } else {
                ui.$levelStart.hide();
                eventBus.emit('player ready');
            }
        });
    };
    
    
    LevelUI.prototype.initEvents = function () {
        var ui = this;
        var eventBus = this.eventBus;
        
        eventBus.on('chrono started', function () {
            ui.chronoStarted = true;
            ui.$chronoMessage.show();
        });
        
        eventBus.on('countdown', function (time) {
            if (time < 10) {
                time = '.' + time;
            }
            var newCount = $('<span class="new">'+time+'</span>');
            ui.$count.append(newCount);
            setTimeout(function () {
                newCount.removeClass('new');
            }, 50);
        });
        
        eventBus.on('scored', function (dt, score) {
            ui.chronoStopped = true;
            ui.displayEnd('You stopped', dt, score);
        });
        
        eventBus.on('too late', function () {
            ui.chronoStopped = true;
            ui.displayEnd('Bad timing - more than 15 seconds !', '', 0);
        });
        
        eventBus.on('resize', function () {
            ui.resize();
        });
        
        
        eventBus.on('display infos', function (infos) {
            ui.$infoBar.find('.message').html('My level');

            _.each(infos, function (info) {
                ui.$explanations.html(_.template($('#explanationTemplate').html(), {
                    type:    info[0],
                    message: info[1]
                }));
            });
            
        });
    };
    
    
    LevelUI.prototype.displayEnd = function (message, time, score) {
        this.$chronoContainer.hide();
        this.$levelEnd.show().html(_.template($('#levelEndTemplate').html(), {
            message: message,
            time:  time,
            score: score
        }));
    };


    return LevelUI;
    
});