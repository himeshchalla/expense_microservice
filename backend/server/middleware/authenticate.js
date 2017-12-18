var moment = require('moment');
var {User} = require(__dirname+'/../model/user.js');
// console.log(__dirname+'/../model/user.js');
// console.log(module.parent);
// console.log(module.filename);
// console.log(module.id);
// console.log(module.loaded);
// console.log(User);
var authenticate = (req, res, next) => {
    // console.log(module.loaded);
    // console.log(User);
    // process.exit(0);
    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if(!user) {
            console.log('User not found');
            return Promise.reject('Unauthorized user access');
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        console.log('Issue in user request as auth is required:'+err);
        res.status(401).send({"error":true,"message":err});
    });
}

// var calcTimeDifference = (time_to_compare) => {
//     var result = new Object();
//     var now = moment();
//     var time_to_compare = moment(time_to_compare);
//     return now.substract(time_to_compare);
// }

/**
 * [Method is useful to update user's free points]
 * @return {[string]} [Returns boolean]
 */
// UserSchema.methods.updateUserFreePointsById = function(){
    // var user = this;
    // var free_points_upper_limit = 200;
    // var free_points_cycle_limit = 50;
    // var free_points_interval = 10800000; //Interval should be in miliseconds
    //First fetch configuration settings to add free points in user accound according to config settings
    // return Configsetting.find({
    //     $or: [
    //             {"setting_name": "free_points_upper_limit"},
    //             {"setting_name": "free_points_cycle_limit"},
    //             {"setting_name": "free_points_interval"},
    //         ]
    // }).then((setting_data) => {
    //     setting_data.forEach((setting) => {
    //         if(setting.setting_name == 'free_points_upper_limit') {
    //             free_points_upper_limit = setting.setting_value;
    //         } else if(setting.setting_name == 'free_points_cycle_limit') {
    //             free_points_cycle_limit = setting.setting_value;
    //         } else if(setting.setting_name == 'free_points_interval') {
    //             free_points_interval = setting.setting_value;
    //         }
    //     });
    //
    //     // var timediff = calcTimeDifference();
    //     // if(user.free_points < free_points_upper_limit) {
    //     //     var free_points = free_points_cycle_limit;
    //     //     var upper_limit_points_diff = free_points_upper_limit - user.free_points;
    //     //     if( upper_limit_points_diff < free_points ) {
    //     //         free_points = upper_limit_points_diff;
    //     //     }
    //     //     // Update User collection for giving free points by system
    //     //     var user_data = {
    //     //         "free_points":(user.free_points+free_points),
    //     //         "updatedAt":moment().valueOf()
    //     //     };
    //     //     User.findOneAndUpdate(
    //     //         {
    //     //             _id: user._id,
    //     //         },
    //     //         {$set:user_data},
    //     //         {new:false, returnNewDocument : true }
    //     //     ).then((updated_user) => {
    //     //         // Create User transaction
    //     //         var usertransactionData = {
    //     //             "points": free_points,
    //     //             "transaction_type":"points_received_for_free",
    //     //             "user_id":user._id,
    //     //             "item_id":null,
    //     //             "qty":null,
    //     //             "price":null,
    //     //             "createdAt":moment().valueOf(),
    //     //             "updatedAt":moment().valueOf()
    //     //         };
    //     //         var usertransaction = new UserTransaction(usertransactionData);
    //     //         usertransaction.save().then((usertransaction_data) => {
    //     //          // User Transcation saved successfully
    //     //             console.log('Free '+free_points+' points given to user:'+user.username);
    //     //         }).catch((err) => {
    //     //          // Unable to save User Transcation
    //     //          console.log(err);
    //     //         });
    //     //     }).catch((error) => {
    //     //         // Unable to update User data
    //     //         console.log(error);
    //     //     });
    //     // }
    // }).catch((error) => {
    //     // Unable to find config settings
    //     console.log(error);
    // });
// };

module.exports = {authenticate}
