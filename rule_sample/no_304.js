// 防止CDN返回304

module.exports = {
	summary:function(){
        return "防止CDN返回304，但不包括字体";
    },
    //在向服务器发出请求前，AnyProxy会调用这个接口，可以在此时修改发送请求的参数
    replaceRequestOption : function(req,option){
        var newOption = option;
        delete newOption.headers['if-modified-since'];
        return newOption;
    }
};