
// 爱抢购测试，重定向域名响应

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
        if(req.method == "OPTIONS"){
            return true;
        }else{
            return false;
        }
        // return false;
    },

    dealLocalResponse : function(req,reqBody,callback){
        if(req.method == "OPTIONS"){
            callback(200,mergeCORSHeader(req.headers),"");
        }
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
        if(option.hostname == "10.0.0.119" ){
            console.log('已经重定向')
        }
        if(option.hostname == "10.0.0.119" ){
            if( /^\/api\//.test(option.path) ){
                console.log('这是请求：' + option.path)
                // if(newOption.path=="/home.php" ){
                //     newOption.hostname = "m.jjhh.com";
                //     newOption.path = "/jjhh/home.php";
                //     newOption.port     = "80";
                // }
                newOption.port     = "8181";
                newOption.hostname = "dev.iqianggou.lab";
                //TODO: 以下静态资源没有全部正确加载，为什么呢？？？
                //目前，没正确加载的 mime type 为 text/html，正确加载的为 image/jpeg
                // if(/\.(png|gif|jpg|jpeg)$/.test(req.url)){
                //     newOption.hostname = "m.jjhh.com";
                //     newOption.port     = "80";
            }
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
        //var newHeader = header || {};
        return mergeCORSHeader(req.headers, header);
        //return newHeader;
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

function mergeCORSHeader(reqHeader,originHeader){
    var targetObj = originHeader || {};

    delete targetObj["Access-Control-Allow-Credentials"];
    delete targetObj["Access-Control-Allow-Origin"];
    delete targetObj["Access-Control-Allow-Methods"];
    delete targetObj["Access-Control-Allow-Headers"];

    targetObj["access-control-allow-credentials"] = "true";
    targetObj["access-control-allow-origin"]      = reqHeader['origin'] || "-___-||";
    targetObj["access-control-allow-methods"]     = "GET, POST, PUT";
    targetObj["access-control-allow-headers"]     = reqHeader['access-control-request-headers'] || "-___-||";

    return targetObj;
}