//rule scheme :
//去除响应头里缓存相关的头

module.exports = {
    summary:function(){
        return "去除响应头里缓存相关的头";
    },
	replaceRequestOption : function(req,option){
	    var newOption = option;
	    delete newOption.headers['if-none-match'];
	    delete newOption.headers['if-modified-since'];

	    return newOption;
	},

    replaceResponseHeader: function(req,res,header){
        header = header || {};
        header["Cache-Control"]                    = "no-cache, no-store, must-revalidate";
        header["Pragma"]                           = "no-cache";
        header["Expires"]                          = 0;

        return header;
    }
};