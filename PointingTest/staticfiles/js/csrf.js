'use strict';

/*
 * CSRF Token
 */

var Token = {};

Token.init = function(){
    Token.csrf = Cookies.get('csrftoken');
    Token.setup();
};

Token.safeMethod = function(method){
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
};

Token.setup = function(){
    $.ajaxSetup({
        beforeSend: function(xhr, settings){
            if(!Token.safeMethod(settings.type) && !this.crossDomain){
                xhr.setRequestHeader('X-CSRFToken', Token.csrf);
            }
        }
    });
};
