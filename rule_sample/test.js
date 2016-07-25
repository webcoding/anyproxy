
// 重定向ajax

module.exports = {
    summary:function(){
        return "重定向ajax";
    },



    //=======================
    //收到用户请求之后
    //=======================

    //是否截获https请求
    shouldInterceptHttpsReq :function(req){
        return false;
    },

    //是否在本地直接发送响应（不再向服务器发出请求）
    shouldUseLocalResponse : function(req,reqBody){
        return false;
    },

    dealLocalResponse : function(req,reqBody,callback){
        callback(statusCode,resHeader,responseData)
    },



    //=======================
    //向服务端发出请求之前
    //=======================

    //替换向服务器发出的请求协议（http和https的替换）
    replaceRequestProtocol:function(req,protocol){
        var newProtocol = protocol;
        return newProtocol;
    },

    //替换向服务器发出的请求参数（option)
    replaceRequestOption : function(req,option){
        var newOption = option;
        
        /*
        option scheme:
        {
            hostname : "www.taobao.com"
            port     : 80
            path     : "/"
            method   : "GET"
            headers  : {cookie:""}
        }
        */

        //options : http://nodejs.org/api/http.html#http_http_request_options_callback
        if(newOption.hostname == "staging.iqianggou.lab"){
            // && newOption.port == "8000"
            // if( /\/api\/wechat\//.test(newOption.path) ){
            //     //newOption.hostname = "m.jjhh.com";
            //     //newOption.path = "/jjhh/home.php";
            //     newOption.port     = "80";
            // }
            newOption.hostname == "staging.iqianggou.lab"

            //TODO: 以下静态资源没有全部正确加载，为什么呢？？？
            //目前，没正确加载的 mime type 为 text/html，正确加载的为 image/jpeg
            // if(/\.(png|gif|jpg|jpeg)$/.test(req.url)){
            //     newOption.hostname = "m.jjhh.com";
            //     newOption.port     = "80";
            // }
        }

        return newOption;
    },

    //替换请求的body
    replaceRequestData: function(req,data){
        return data;
    },



    //=======================
    //向用户返回服务端的响应之前
    //=======================

    //替换服务器响应的http状态码
    replaceResponseStatusCode: function(req,res,statusCode){
        var newStatusCode = statusCode;
        return newStatusCode;
    },

    //替换服务器响应的http头 Here header == res.headers
    replaceResponseHeader: function(req,res,header){
        var newHeader = header || {};
        return newHeader;
    },

    //替换服务器响应的数据
    replaceServerResDataAsync: function(req,res,serverResData,callback){
        callback(serverResData);
    },

    //在请求返回给用户前的延迟时间
    pauseBeforeSendingResponse : function(req,res){
        var timeInMS = 1; //delay all requests for 1ms
        return timeInMS; 
    }
};