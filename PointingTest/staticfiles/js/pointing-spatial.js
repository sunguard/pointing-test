'use strict';

var TIME = {
    default_loading: 1500,
    default_notice_fadeout: 1000,
};

function randomize(arr){
    var c_i = arr.length, r_i, t_val;

    while(0 != c_i){
        r_i = Math.floor(Math.random() * c_i);
        c_i -= 1;

        t_val = arr[c_i];
        arr[c_i] = arr[r_i];
        arr[r_i] = t_val;
    }

    return arr;
};

/*
 * Spatial Pointing Task
 */

var Task = {};

Task.init = function(){
    Task.dom = {
        btn_start: $('.notice-start'),
        btn_loading: $('.notice-loading'),
        btn_next: $('.notice-next'),
        btn_result: $('.notice-result'),
        area_notice: $('.notice-area'),
        area_notice_start: $('.notice-start-wrapper'),
        area_task: $('.task-area'),

        objects: {
            all: $('.task-objects>button'),
            wrapper: $('.task-objects'),
            trigger: $('.task-trigger'),
            blinker: $('.task-blinker'),
            glitter: $('.task-glitter'),

            0: $('.task-objects.position-0'),
            1: $('.task-objects.position-1'),
        },

        num_trial: $('.task-trial'),
        num_progress: $('.progress-number'),
        bar_progress: $('.progress-bar'),
    };

    Task.logs = [];
    Task.current = -1;
    Task.trial = -1;

    Task.load("SP"); // load SpatialPointing task
    Task.register();
};

Task.register = function(){
    $(Task.dom.btn_start).click({env_num: 0}, Task.start);
};

Task.load = function(mode){
    var _rest = $.ajax({
        method: 'GET',
        url: '/test/rest/load/',
        data: {
            "mode": mode
        },
        dataType: 'json'
    });

    _rest.done(function(data){
        Task.settings = {};
        Task.ready(data.settings);
    });

    _rest.fail(function(err){
        console.error(err.responseText);
    });
};

Task.ready = function(settings){
    var _env = [];

    for(var i = 0; i < settings.distance.length; i++){
        for(var j = 0; j < settings.width.length; j++){
            _env.push({
                "distance": settings.distance[i],
                "width": settings.width[j]
            });
        }
    }

    Task.settings.color = settings.color;
    Task.settings.trial = settings.trial;
    Task.settings.env = randomize(_env);

    setTimeout(function(){
        $(Task.dom.btn_loading).hide();
        $(Task.dom.btn_start).show();
    }, TIME.default_loading);
};

Task.start = function(e){
    var env_num = e.data.env_num;

    console.log(env_num);

    $(Task.dom.area_notice).hide();

    if(env_num == 0){
        $(Task.dom.area_notice_start).hide();
    }

    var env = Task.settings.env[env_num];

    // SET THE OBJECTS' POSITIONS & COLORS

    $(Task.dom.objects.wrapper).css({
        width: env.width + 'mm',
        height: env.width + 'mm',
        marginTop: - env.width / 2 + 'mm'
    });

    $(Task.dom.objects[0]).css({
        marginLeft: - (env.width / 2 + env.distance / 2) + 'mm'
    });

    $(Task.dom.objects[1]).css({
        marginLeft: (env.distance / 2 - env.width / 2) + 'mm'
    });

    $(Task.dom.objects.blinker).css({
        background: Task.settings.color
    });

    // SET THE LOGGING ENVIRONMENT

    $(Task.dom.area_task).fadeIn(TIME.default_notice_fadeout, function(){
        Task.current = env_num;
        Task.trial = 2;//Task.settings.trial;
        Task.progress();

        Task.logs[env_num] = {};

        Task.logs[env_num].env = {
            color: Task.settings.color,
            trial: Task.settings.trial,
            width: Task.settings.env[env_num].width,
            distance: Task.settings.env[env_num].distance
        };

        var _d = new Date();

        Task.logs[env_num].start = _d.getTime();
        Task.logs[env_num].timestamps = []; // 0: timestamp, 1: success/failure

        $(Task.dom.objects[0]).addClass('activate');
        $(Task.dom.objects.trigger).bind('click.trigger', Task.trigger);
    });
};

Task.trigger = function(e){
    var wrapper = $(e.target).parent(),
        pos = $(wrapper).attr('class').split(' ')[1].split('-')[1],
        _pos = -1;

    if(pos == 0){
        _pos = 1;
    }else{
        _pos = 0;
    }

    var status = $(wrapper).hasClass('activate');

    if(status){
        // EFFECT & CHANGE

        $(Task.dom.objects[pos]).removeClass('activate');
        $(Task.dom.objects[_pos]).addClass('activate');

        $(Task.dom.objects.blinker[pos]).hide();
        $(Task.dom.objects.blinker[_pos]).show();

        $(Task.dom.objects.glitter[pos]).fadeIn(200, function(){
            $(this).fadeOut(100);
        });

        // TRIAL CHECK

        Task.trial -= 1;

        if(Task.trial >= 0){
            $(Task.dom.num_trial).text(Task.trial);

            // SUCCESS LOGGING

            var _d = new Date();

            Task.logs[Task.current].timestamps.push([
                _d.getTime(), "success"
            ]);
        }

        if(Task.trial == 0){
            Task.next();
        }
    }else{
        // DO SOMETHING WITH TEMOPORAL POINTING TASK
    }
};

Task.next = function(){
    if(Task.current + 1 < Task.settings.env.length){
        $(Task.dom.btn_next).show().unbind().click({env_num: Task.current + 1}, Task.start);
        $(Task.dom.area_notice).fadeIn();
    }else{
        $(Task.dom.btn_next).hide();
        $(Task.dom.btn_result).show();
        $(Task.dom.area_notice).fadeIn();
    }

    //Task.start(Task.current + 1);
};

Task.progress = function(){
    $(Task.dom.num_progress).text(Task.current + 1);
    $(Task.dom.bar_progress).css({
        width: $(document).width() / Task.settings.env.length * (Task.current + 1)
    })
};
