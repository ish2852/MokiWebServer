//models/orderspot_firebase.js
var admin = require('firebase-admin');
var serviceAccount = require('../order-spot-firebase-adminsdk-q7z81-ad0b52a11e.json');

admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount)
});

class orderspot_firebase {
    constructor() {
    }
	
	merchant_message(fcm_target_token, send_data, body_data){
		var fcm_message = {
			notification:{
				title: 'Order Spot',
				body: body_data
			},
			data:{
				data: JSON.stringify(send_data)
			},
			token:fcm_target_token
		};
		
		admin.messaging().send(fcm_message)
			.then(function(response){
				console.log('보내기 성공 메시지:' + response);
			})
			.catch(function(error){
				console.log('보내기 실패 메시지:' + error);
			});
			
		return {'success' : 'True'};
	}
	
	genera_message(fcm_target_token, send_data){
		var fcm_message = {
			data:{
				data: JSON.stringify(send_data)
			},
			token:fcm_target_token
		};
		
		admin.messaging().send(fcm_message)
			.then(function(response){
				console.log('보내기 성공 메시지:' + response);
			})
			.catch(function(error){
				console.log('보내기 실패 메시지:' + error);
			});
			
		return {'success' : 'True'};
	}

}

module.exports = orderspot_firebase;