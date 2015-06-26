/*
read the following wiki before using rule file
https://github.com/alibaba/anyproxy/wiki/What-is-rule-file-and-how-to-write-one
*/

/*
接口包括：

收到用户请求之后
    shouldUseLocalResponse ，是否在本地直接发送响应（不再向服务器发出请求）
    dealLocalResponse 如果shouldUseLocalResponse返回true，会调用这个函数来获取本地响应内容（异步接口）
向服务端发出请求之前
    replaceRequestProtocol 替换向服务器发出的请求协议，支持http和https的替换
    replaceRequestOption 替换向服务器发出的请求参数，即nodeJS中的 request option
    replaceRequestData 替换请求的body
向用户返回服务端的响应之前
    replaceResponseStatusCode 替换服务器响应的http状态码
    replaceResponseHeader 替换服务器响应的http头
    replaceServerResDataAsync 替换服务器响应的数据（异步接口）
    pauseBeforeSendingResponse 在请求返回给用户前的延迟时间
*/


module.exports = {
    /*
    These functions will overwrite the default ones, write your own when necessary.
    Comments in Chinese are nothing but a translation of key points. Be relax if you dont understand.
    致中文用户：中文注释都只是摘要，必要时请参阅英文文档。欢迎提出修改建议。
    */
    summary:function(){
        return "代理设定：变更请求参数";
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
        //为ajax请求增加跨域头(1)
        // if(req.method == "OPTIONS"){
        //     return true;
        // }else{
        //     return false;
        // }

        return false;
    },

    //如果shouldUseLocalResponse返回true，会调用这个函数来获取本地响应内容
    //e.g. callback(200,{"content-type":"text/html"},"hello world")
    dealLocalResponse : function(req,reqBody,callback){
        callback(statusCode,resHeader,responseData)

        //为ajax请求增加跨域头(2)
        // if(req.method == "OPTIONS"){
        //     callback(200,mergeCORSHeader(req.headers),"");
        // }
    },



    //=======================
    //向服务端发出请求之前
    //=======================

    //替换向服务器发出的请求协议（http和https的替换）
    //protocol : "http" or "https"
    replaceRequestProtocol:function(req,protocol){
        var newProtocol = protocol;
        return newProtocol;
    },

    //替换向服务器发出的请求参数（option)
    replaceRequestOption : function(req,option){
        var newOption = option;

        //去除响应头里缓存相关的头(1)
        delete newOption.headers['if-none-match'];
        delete newOption.headers['if-modified-since'];  //防止CDN返回304
        
        //options : http://nodejs.org/api/http.html#http_http_request_options_callback
        // if(newOption.hostname == "www.shuoyiju.com"){
        //     newOption.hostname = "m.iqianggou.com";
        //     newOption.port     = "80";
        // }

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
        //http://staging.iqianggou.lab/api/wechat/snsapi/userinfo
        // if(newOption.hostname == "www.taobao.com" && newOption.path == "/"){
        //     option.path = "/about/";
        // }

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
        newStatusCode = 200;
        return newStatusCode;
    },

    //替换服务器响应的http头
    //Here header == res.headers
    replaceResponseHeader: function(req,res,header){
        //去除响应头里缓存相关的头(3)
        //return mergeCORSHeader(req.headers, header);

        var newHeader = header || {};

        //去除响应头里缓存相关的头(2)
        newHeader["Cache-Control"]          = "no-cache, no-store, must-revalidate";
        newHeader["Pragma"]                 = "no-cache";
        newHeader["Expires"]                = 0;

        return newHeader;
    },

    //替换服务器响应的数据
    //serverResData is a Buffer. for those non-unicode reponse , serverResData.toString() should not be your first choice.
    replaceServerResDataAsync: function(req,res,serverResData,callback){
        //callback(serverResData);

        if(/\/api\/wechat\/snsapi\/userinfo/i.test(req.url) && /application\/json/i.test(res.headers['content-type'])){
            var newDataStr = serverResData.toString();
            newDataStr = {
                 "status": {
                     "code": 10000,
                     "message": "成功",
                     "alert": "",
                     "server_time": 1435299927
                 },
                 "data": {
                     "openid": "oNDT-jg2hbx0SGwX-WP-BiaFNWUQ",
                     "nickname": "晓寒",
                     "sex": 1,
                     "language": "zh_CN",
                     "city": "普陀",
                     "province": "上海",
                     "country": "中国",
                     "headimgurl": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAyWJdDNJZjR7fSAcZaYJKaBfnEnvvicYMNcBHgdxbK0Ub9HUl2jac0RIXUHMmuia9BetfKPbMCsfeQ/0",
                     "unionid": "o31SljhvIXvUZT1ydpGgIxT6DEY8"
                 }
             }
            callback( JSON.stringify(newDataStr) );
        }else{
            callback(serverResData);
        }
    },

    //Deprecated    
    // replaceServerResData: function(req,res,serverResData){
    //     return serverResData;
    // },

    //在请求返回给用户前的延迟时间
    pauseBeforeSendingResponse : function(req,res){
        var timeInMS = 1; //delay all requests for 1ms
        return timeInMS; 
    }

};

//去除响应头里缓存相关的头(4)
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