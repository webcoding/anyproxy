
首先我得谈一下代理所必需实现的效果，除了下面提出的三个阶段的对请求及应答的数据进行处理之外，必须要满足常用场景的简单便捷的配置，降低使用的门槛，我这里要做再做几个示例，以针对各种常用场景的实现做参考使用


这里，我们把http通信过程中的各个阶段进行抽离，分解成三个阶段：

* 收到来自客户端请求之后，允许开发者直接从本地提供返回
* 在转发请求到服务器前，允许开发者对发送的请求进行修改
* 在收到服务器响应之后，允许开发者对响应内容进行修改，再返回给客户端
 
对于上述每个阶段，我们都提供了API接口，引入开发者编写自己的规则代码，实时干预通信过程，以此满足各类自定义需求。

具体地，我们提供的接口包括：

* 收到用户请求之后
    * **shouldUseLocalResponse** ，是否在本地直接发送响应（不再向服务器发出请求）
    * **dealLocalResponse** 如果shouldUseLocalResponse返回true，会调用这个函数来获取本地响应内容（异步接口）
* 向服务端发出请求之前
    * **replaceRequestProtocol**  替换向服务器发出的请求协议，支持http和https的替换
    * **replaceRequestOption** 替换向服务器发出的请求参数，即nodeJS中的 [request option](http://nodejs.org/api/http.html#http_http_request_options_callback)
    * **replaceRequestData** 替换请求的body
* 向用户返回服务端的响应之前
    * **replaceResponseStatusCode** 替换服务器响应的http状态码
    * **replaceResponseHeader** 替换服务器响应的http头
    * **replaceServerResDataAsync** 替换服务器响应的数据（异步接口）
    * **pauseBeforeSendingResponse** 在请求返回给用户前的延迟时间
    
    
AnyProxy规则文件样例
---------------
以“防止CDN返回304”这个需求为例，最直接的方案是拦截请求，在发送到CDN前删除header中的`if-modified-since`字段。在AnyProxy中，配置replaceRequestOption接口，3行代码就能实现这个自定义功能：

```javascript
//rule file
module.exports = {
    //在向服务器发出请求前，AnyProxy会调用这个接口，可以在此时修改发送请求的参数
    replaceRequestOption : function(req,option){
        var newOption = option;
        delete newOption.headers['if-modified-since'];
        return newOption;
    }
};
```

再举个例子，如果你想修改响应数据，在所有html文件最后加个"Hello World"，就需要调用`replaceServerResDataAsync`接口，并结合`content-type`字段来进行修改，大约需要8行代码。

```javascript
//rule file
module.exports = {
    replaceServerResDataAsync: function(req,res,serverResData,callback){
        //append "hello world" to all web pages
        if(/html/i.test(res.headers['content-type'])){
            var newDataStr = serverResData.toString();
            newDataStr += "hello world!";
            callback(newDataStr);
        }else{
            callback(serverResData);
        }
    }
};
```

响应延迟1500ms

```
module.exports = {
    pauseBeforeSendingResponse : function(req,res){
        //delay all the response for 1500ms
        return 1500;
    }
};
```


The following are sample rules.

* rule__blank.js
    * blank rule file with some comments. You may read this before writing your own rule file.
    * 空白的规则文件模板，和一些注释
* rule_adjust_response_time.js
    * delay all the response for 1500ms
    * 把所有的响应延迟1500毫秒
* rule_allow_CORS.js
    * add CORS headers to allow cross-domain ajax request
    * 为ajax请求增加跨域头
* rule_intercept_some_https_requests.js
    * intercept https requests toward github.com and append some data
    * 截获github.com的https请求，再在最后加点文字
* rule_remove_cache_header.js
    * remove all cache-related headers from server
    * 去除响应头里缓存相关的头
* rule_replace_request_option.js
    * replace request parameters before sending to the server
    * 在请求发送到服务端前对参数做一些调整
* rule_replace_response_data.js
    * modify response data
    * 修改响应数据
* rule_replace_response_status_code.js
    * replace server's status code
    * 改变服务端响应的http状态码
* rule_reverse_proxy.js
    * assign a specific ip address for request
    * 为请求绑定目标ip
* rule_use_local_data.js
    * map some requests to local file
    * 把图片响应映射到本地
