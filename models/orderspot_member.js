// models/orderspot_member.js


class orderspot_member {
    constructor() {
    }

    user_login(id, pw, data){
		if(data == null){
			data = {"err" : "Not a member",
					"success" : "False"}
		}
		else if(('err' in data) || data == null){
			data = {"err" : "user login error",
					"success" : "False"}
		}else if('guser_ID' in data){
			data = {'success' : 'True'}
		}else if('muser_ID' in data){
			data = {'success' : 'True'}
		}
		return data;
	}
	
	user_id_check(data){
		console.log(data);
		if(data.length < 1){
			data = {"success" : "True"}
		}else if('err' in data){
			data = {"err" : "user id check error",
					"success" : "False"}
		}else{
			data = {"err" : "Id in use",
			'success' : 'False'}
		}
		return data;
	}
}

module.exports = orderspot_member;