// routes/controller.js
var orderspot_db = require("../models/orderspot_db");
var orderspot_member = require	("../models/orderspot_member");
var orderspot_order = require	("../models/orderspot_order");

var test = require("../models/orderspot_firebase");

exports.orderspotView = async function (req, res) {
	var db = new orderspot_db();
	var member = new orderspot_member();
	var order = new orderspot_order();
	
	switch (req.body.type){
		case 'user_login':
			var data = await db.user_login(req.body.id, req.body.pw);
			var send_data = await member.user_login(req.body.id, req.body.pw, data[0]);
			break;
		case 'guser_token_update':
			var send_data = await order.guser_token_update(req.body);
			break;
		case 'user_id_check':
			var data = await db.user_id_check(req.body.id);
			var send_data = member.user_id_check(data);
			break;
		case 'user_join':
			var send_data = await db.user_join(req.body);
			break;
		case 'products_information':
			var send_data = await order.products_information(req.body.GPS);
			break;
		case 'user_order':
			var send_data = await order.user_order(req.body);
			break;
		case 'general_complete_message_check':
			var send_data = await order.general_complete_message_check(req.body);
			break;
		case 'user_review':
			var send_data = await order.user_review(req.body);
			break;
		case 'guser_purchase_search':
			var send_data = await order.guser_purchase_search(req.body);
			break;
		case 'guser_bias_analysis':
			var send_data = await order.guser_bias_analysis(req.body);
			break;
		case 'guser_recommendation_list':
			var send_data = await order.guser_recommendation_list(req.body);
			break;
/*=====================================================================*/
		case 'merchant_login':
			var data = await db.merchant_login(req.body.id, req.body.pw);
			var send_data = member.user_login(req.body.id, req.body.pw, data[0]);
			break;
		case 'muser_token_update':
			var send_data = await order.muser_token_update(req.body);
			break;
		case 'merchant_id_check':
			var data = await db.merchant_id_check(req.body.id);
			var send_data = member.user_id_check(data);
			break;
		case 'merchant_join':
			var send_data = await db.merchant_join(req.body);
			break;
		case 'merchant_order_cancel':
			var send_data = await order.merchant_order_cancel(req.body);
			break;
		case 'merchant_completed':
			var send_data = await order.merchant_completed(req.body);
			break;
		case 'search_review':
			var send_data = await order.search_review(req.body);
			break;
		case 'merchant_sales_search':
			var send_data = await order.merchant_sales_search(req.body);
			break;
		case 'merchant_order_list':
			var send_data = await order.merchant_order_list(req.body);
			break;
		default:
			var send_data = {'error' : "Invalid request"};
	}
	
	console.log(send_data);
	
	res.render('index', {
		"data": JSON.stringify(send_data)
    });
}