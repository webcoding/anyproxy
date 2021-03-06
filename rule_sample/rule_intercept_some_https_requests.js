//rule scheme :
//截获github.com的https请求，再在最后加点文字

module.exports = {


    replaceServerResDataAsync: function(req,res,serverResData,callback){
        //add "hello github" to all github pages
        if(req.headers.host == "github.com"){
            serverResData += "hello github";
        }
        callback(serverResData);
    },

    shouldInterceptHttpsReq :function(req){
        //intercept https://github.com/
        //otherwise, all the https traffic will not go through this proxy

        // return true;
        if(req.headers.host == "github.com"){
            return true;
        }else{
            return false;
        }
    }
};