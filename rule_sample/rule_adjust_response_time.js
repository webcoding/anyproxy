//rule scheme :
//把所有的响应延迟1500毫秒

module.exports = {

    pauseBeforeSendingResponse : function(req,res){
        //delay all the response for 1500ms
        return 1500;
    }

};