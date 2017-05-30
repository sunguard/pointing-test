'use strict';

var TIME = {
    default_loading: 1500,
    default_notice_fadeout: 1000,
    default_glitter_on: 10,
    default_glitter_off: 90
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
 * Temporal Pointing Task
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
        area_result: $('.result-area'),

        objects: {
            all: $('.task-objects>button'),
            wrapper: $('.task-objects'),
            trigger: $('.task-trigger'),
            blinker: $('.task-blinker'),
            glitter: $('.task-glitter'),
        },

        num_trial: $('.task-trial'),
        num_progress: $('.progress-number'),
        num_progress_total: $('.progress-total'),
        bar_progress: $('.progress-bar'),
    };

    Task.checkUser(function(){
        Task.logs = [];
        Task.current = -1;
        Task.trial = -1;

        Task.load("TP"); // load TemporalPointing task
        Task.register();
    });
};

Task.checkUser = function(callback){
    if(localStorage['user_info']){
        Task.user = {
            info: JSON.parse(localStorage['user_info']),
            device: {} // save user device information, etc
        };

        callback();
    }else{
        alert("Invalid user data.\nRedirect to the front page.");
        window.location = "/test/";
    }
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

    for(var i = 0; i < settings.duration.length; i++){
        for(var j = 0; j < settings.interval.length; j++){
            _env.push({
                "duration": settings.duration[i],
                "interval": settings.interval[j]
            });
        }
    }

    Task.settings.color = settings.color;
    Task.settings.trial = settings.trial;
    Task.settings.size = settings.radius * 2;
    Task.settings.env = randomize(_env);

    $(Task.dom.num_progress_total).text(Task.settings.env.length);

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
        width: Task.settings.size + 'mm',
        height: Task.settings.size + 'mm',
        marginTop: - Task.settings.size / 2 + 'mm',
        marginLeft: - Task.settings.size / 2 + 'mm'
    });

    $(Task.dom.objects.blinker).css({
        background: Task.settings.color
    });

    // SET THE LOGGING ENVIRONMENT

    Task.current = env_num;
    Task.trial = Task.settings.trial;
    Task.progress();
    $(Task.dom.num_trial).text(Task.trial);

    $(Task.dom.area_task).fadeIn(TIME.default_notice_fadeout, function(){
        Task.logs[env_num] = {};

        Task.logs[env_num].env = {
            color: Task.settings.color,
            trial: Task.settings.trial,
            radius: Task.settings.size / 2,
            duration: Task.settings.env[env_num].duration,
            interval: Task.settings.env[env_num].interval,
        };

        var _d = new Date();

        Task.logs[env_num].start = _d.getTime();
        Task.logs[env_num].timestamps = []; // 0: timestamp, 1: success/failure

        $(Task.dom.objects.trigger).bind('click.trigger', Task.trigger);

        // START THE TEST

        Task.actor(env_num);
    });
};

Task.actor = function(env_num){
    var duration = Task.settings.env[env_num].duration,
        interval = Task.settings.env[env_num].interval;

    Task.loopStarter(duration, interval, {
        show: function(){
            $(Task.dom.objects.wrapper).addClass('activate');
            $(Task.dom.objects.blinker).show();
        },
        hide: function(){
            $(Task.dom.objects.wrapper).removeClass('activate triggered');
            $(Task.dom.objects.blinker).hide();

            Task.trial -= 1;
            $(Task.dom.num_trial).text(Task.trial);

            if(Task.trial == 0){
                Task.loopStopper();
                Task.next();
            }
        }
    });
};

Task.loopStarter = function(duration, interval, callback){
    Task.loop = setInterval(function(){
        callback.show();
        setTimeout(function(){
            callback.hide();
        }, duration);
    }, interval);
};

Task.loopStopper = function(){
    clearInterval(Task.loop);
};

Task.trigger = function(e){
    var status = $(Task.dom.objects.wrapper).hasClass('activate'),
        status_t = $(Task.dom.objects.wrapper).hasClass('triggered');

    var _d = new Date();

    if(status){
        // EFFECT & CHANGE

        $(Task.dom.objects.wrapper).removeClass('activate').addClass('triggered');
        $(Task.dom.objects.glitter).fadeIn(TIME.default_glitter_on, function(){
            $(this).fadeOut(TIME.default_glitter_off);
        });

        // LOG

        Task.logs[Task.current].timestamps.push([
            _d.getTime(), "success"
        ]);
    }else if(!status_t){
        // DO SOMETHING WITH TEMOPORAL POINTING TASK

        Task.logs[Task.current].timestamps.push([
            _d.getTime(), "failure"
        ]);
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

        // GET RESULT

        Task.result();
    }
};

Task.progress = function(){
    $(Task.dom.num_progress).text(Task.current + 1);
    $(Task.dom.bar_progress).css({
        width: $(document).width() / Task.settings.env.length * (Task.current + 1)
    })
};

Task.result = function(){
    // SAVE AND REMOVE ALL DATA

    var _rest = $.ajax({
        method: 'POST',
        url: '/test/rest/result/temporal/',
        data: {
            "settings": JSON.stringify(Task.settings),
            "logs": JSON.stringify(Task.logs)
        },
        dataType: 'json'
    });

    _rest.done(function(data){
        $(Task.dom.btn_result).click({ result: data }, Task.drawGraph);
        Task.save(data);
    });

    _rest.fail(function(err){
        console.error(err.responseText);
    });
};

Task.drawGraph = function(e){
    $(Task.dom.area_result).fadeIn();

    var canvas = document.getElementById('result-graph'),
        result = e.data.result;

    var title = "Temporal Pointing (Sigma = " + result.s + " / Mu = " + result.m + ") / R-Sq: " + result.rsq;

    var data = [
        {
            x: result.x,
            y: result.y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 5,
                color: '#272727'
            },
        },
        {
            x: result._x,
            y: result._y,
            mode: 'lines',
            type: 'scatter',
            line: {
                color: 'red',
                shape: 'spline'
            },
        }
    ];

    var layout = {
        font: {family: "Roboto", color: '#272727'},
        title: title,
        margin: {l: 70, r: 30, t: 80, b: 60},
        hovermode: false,
        showlegend: false,
        xaxis: {
            color: '#272727',
            title: 'Index of Difficulty'
        },
        yaxis: {
            color: '#272727',
            title: 'Error Rate'
        }
    };

    Plotly.plot(canvas, data, layout);
};

Task.save = function(result){
    var data = {
        "mode": "TP",
        "user": JSON.stringify(Task.user),
        "settings": JSON.stringify(Task.settings),
        "logs": JSON.stringify(Task.logs),
        "results": JSON.stringify(result)
    };

    var _rest = $.ajax({
        method: 'POST',
        url: '/test/rest/save/',
        data: data,
    });

    _rest.done(function(){
        console.log("SAVED!");
    });

    _rest.fail(function(err){
        console.error(err.responseText);
    });
};
