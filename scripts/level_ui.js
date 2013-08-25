define(['underscore', 'jquery'], function (_, $) {
    
    
    var LevelUI = function (levelElemID, levelName, eventBus) {
        this.eventBus   = eventBus;
        
        this.initContainer(levelElemID, levelName);
        
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
        
        eventBus.emit('ui ready', this.$container);
    };
    
    
    LevelUI.prototype.initContainer = function (levelElemID, levelName) {
        var parent = $('#'+levelElemID);
        parent.html(_.template($('#levelTemplate').html()));
        var template = $('#'+levelName+'Template').html();
        if (template) {
            parent.find('.levelContent').html(_.template($('#'+levelName+'Template').html()));
        }
        this.$container = parent.find('.wrapper');
    };
    
    
    LevelUI.prototype.resize = function () {
    };
    
    
    LevelUI.prototype.initBehaviours = function () {
        var ui = this;
        var eventBus = this.eventBus;
        
        this.$container.on('click', '.back', function (e) {
            e.stopImmediatePropagation();
            eventBus.emit('back');
        });
        
        this.$container.on('click', '.continue', function () {
            eventBus.emit('continue');
        });
        
        this.$container.on('click', '.go', function () {
            ui.playerReady();
        });
        
        eventBus.on('player action', function () {
            if (ui.waitForLoad) {
                return;
            }
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
        
        
        eventBus.on('wait for load', function () {
            ui.waitForLoad = true;
            ui.$container.find('.go').hide();
            ui.$container.find('.loading').delay(1000).fadeIn(800);
        });
        
        eventBus.on('loading complete', function () {
            ui.waitForLoad = false;
            ui.$container.find('.go').fadeIn(300);
            ui.$container.find('.loading').remove();
        });
        
        
        eventBus.on('chrono started', function () {
            ui.chronoStarted = true;
            ui.$chronoMessage.show();
            
            //FOR FLASH
            /*ui.$container.addClass("started");
            setTimeout(function () {
                ui.$container.removeClass("started");
            }, 50);*/
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
            ui.displayEnd(false, dt, score);
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
                ui.combo = infos.combo;
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
            score: score,
            combo: this.combo
        }));
        this.positionMessage(this.$levelEnd.find('.endContainer'));
        
        if (this.combo) {
            this.$levelEnd.find('.prepare').hide().delay(1500).fadeIn(1500);
            var eventBus = this.eventBus;
            setTimeout(function () {
                eventBus.emit('continue');
            }, 3000);
        }
    };


    return LevelUI;
    
});