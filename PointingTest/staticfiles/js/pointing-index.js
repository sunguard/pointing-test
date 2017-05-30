'use strict';

function randomInt(min, max){
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

/*
 * Data
 */

var Data = {};

Data.init = function(){
    Data.dom = {
        btn_submit: $('.input-submit'),
        opt_task: $('.input-box[name=task]'),
        input_age: $('.input-box[name=age]'),
    };

    var tasks = ["sp", "tp", "stp"];

    $(Data.dom.opt_task).val(tasks[randomInt(0, 2)]);

    Data.register();
};

Data.register = function(){
    $(Data.dom.btn_submit).click(Data.save);
};

Data.save = function(){
    var user_info = {
        age: parseInt($('.input-box[name=age]').val()),
        gender: $('.input-box[name=gender]:checked').val(),
        musician: $('.input-box[name=musician]:checked').val(),
        task: $('.input-box[name=task] option:checked').val()
    };

    if(user_info.age){
        localStorage['user_info'] = JSON.stringify(user_info);

        var redirect = "";

        if(user_info.task == "sp") { redirect = "spatial/" }
        else if(user_info.task == "tp") { redirect = "temporal/" }
        else{ redirect = "combined/" }

        window.location = redirect;
    }else{
        $(Data.dom.input_age).css('background', 'yellow').focus();
        setTimeout(function(){
            $(Data.dom.input_age).css('background', '#fff');
        }, 500);
    }
};
