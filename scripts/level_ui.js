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
            ui.playerReady();
        });
        
        eventBus.on('player action', function () {
            if (ui.chronoStopped) {
                eventBus.emit('close level');
            } else if (ui.chronoStarted) {
                eventBus.emit('chrono stop');
            } else {
                ui.playerReady();
            }
        });
    };
    
    
    LevelUI.prototype.playerReady = function () {
        this.$levelStart.hide();
        this.$infoBar.hide();
        this.eventBus.emit('player ready');
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
            ui.displayEnd('Bad timing - more than 15 seconds !', false, 0);
        });
        
        eventBus.on('resize', function () {
            ui.resize();
        });
        
        
        eventBus.on('display infos', function (infos) {
            ui.$infoBar.find('.message').html(infos.title);
            if (infos.combo) {
                ui.$infoBar.find('.combo').html(infos.combo.index + ' / ' + infos.combo.total);
            }
            
            _.each(infos.instructions, function (instruction) {
                ui.$explanations.html(_.template($('#explanationTemplate').html(), {
                    type:    instruction[0],
                    message: instruction[1]
                }));
            });
            
            ui.positionMessage(ui.$container.find('.infosContainer'));
            ui.$container.find('.chrono .countdown').css('font-size', (ui.$container.width()/9.3) + 'px');
        });
        
    };
    
    
    LevelUI.prototype.positionMessage = function ($elem) {
        $elem.css({
            'margin-top': (0.4 * (this.$container.height() - $elem.height()))+'px'
        });
    };
    
    
    LevelUI.prototype.displayEnd = function (message, time, score) {
        this.$chronoContainer.hide();
        this.$infoBar.show();
        this.$levelEnd.show().html(_.template($('#levelEndTemplate').html(), {
            message: message,
            time:  time,
            score: score
        }));
        this.positionMessage(this.$levelEnd.find('.endContainer'));
    };


    return LevelUI;
    
});