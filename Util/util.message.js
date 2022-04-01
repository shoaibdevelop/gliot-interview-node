exports.success = function (data) {
    var obj = new Object();
    obj.status = "SUCCESS";
    obj.data = data;
    return obj;
};

exports.error = function (data) {
    var obj = new Object();
    obj.status = "ERROR";
    obj.errorMessage = data;
    return obj;
};
