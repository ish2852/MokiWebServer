// models/orderspot_order.js
var orderspot_db = require("../models/orderspot_db");
var orderspot_firebase = require("../models/orderspot_firebase");
var db = new orderspot_db();
var firebase = new orderspot_firebase();
var dateFormat = require('dateformat');

class orderspot_order {
    constructor() {
    }
	
	// orderspot : 사용자 주문 처리
	// input dict
	// output dict
	async user_order(data){
		var order_information = JSON.parse(data.order_information);
		
		if('day' in order_information){
			var date = new Date(order_information.day);
		}else{
			var date = new Date();
		}
		var time = dateFormat(date, "yyyy-mm-dd HH:MM:ss");

		var menu_list = await db.menu_list(order_information.muser_ID);
		var order_Pay = 0;
		
		for(var order_key in order_information.amount){
			
			for(var j=0; j < menu_list.length; j++){
				
				if(menu_list[j]['product_ID'] == order_key){
					order_Pay += menu_list[j]['productPrice'] * order_information.amount[order_key];
					break;
				}
			}
		};
		
		var orderID = await db.user_order(order_information, order_Pay, time);
		
		for(var key in order_information.amount){
			await db.product_cart_insert(orderID, key, order_information.amount[key]);
		}
		
		var merchant_send_data = order_information;
		merchant_send_data['order_ID'] = orderID;
		merchant_send_data['order_Pay'] = order_Pay;
		merchant_send_data['product'] = await db.order_cart_list(orderID);

		for(var key in order_information.amount){
			for(var i=0; i < merchant_send_data['product'].length; i++){
				if(merchant_send_data['product'][i]['product_ID'] == key){
					merchant_send_data['product'][i]['amount'] = order_information.amount[key];
					break;
				}
			}
		}
		
		delete merchant_send_data['amount'];
		merchant_send_data['type'] = "user_order";
		
		var muser_token = await db.merchant_token(merchant_send_data['muser_ID']);
		
		if(muser_token == null){
			return {'error' : 'No token'};
		}
		
		var success = firebase.merchant_message(muser_token, merchant_send_data, orderID+'주문이 들어왔습니다.');
		success['order'] = orderID;
		return success;
	}
	
	// orderspot : 가맹점 메뉴정보
	// input str
	// output dict
	async products_information(GPS){
		var send_data = [];
		var merchant_data = await db.merchant_information_GPS(GPS);		
		
		if(merchant_data == null){
			return {'err' : 'No search merchant'};
		}
		
		var menu_list = await db.menu_list(merchant_data['muser_ID']);
		send_data[0] = merchant_data;
		send_data[1] = menu_list;
		
		return send_data;
	}
	
	// orderspot : 가맹점 주문취소
	// input dict
	// output dict
	async merchant_order_cancel(data){
		var send_data = [];
		var order_data = await db.order_Search(data.order_ID);

		if(data.muser_ID != order_data.MerchantUser_muser_ID){		
			return {'err' : 'No permission to cancel'};
		}
		
		var success = await db.order_state(data.order_ID, 3);
		if('err' in success){
			success = {"err" : "Order cancel error",
					"success" : "False"};
		}
		
		var general_send_data = await db.merchant_information_ID(data.muser_ID);
		general_send_data['type'] = "merchant_order_cancel";
		general_send_data["orderId"] = data.order_ID;
		
		var guser_token = await db.general_token(order_data.GeneralUser_guser_ID);
		success = firebase.genera_message(guser_token, general_send_data,
			general_send_data.muserName+' 결제가 취소되었습니다.');
		return success;
	}
	
	// orderspot : 가맹점 --> 사용자 수령메시지 전송
	// input dict
	// output dict
	async merchant_completed(data){
		var send_data = [];
		var order_data = await db.order_Search(data.order_ID);

		if(data.muser_ID != order_data.MerchantUser_muser_ID){	
			return {'err' : 'No permission'};
		}
		
		var success = await db.order_state(data.order_ID, 1);
		if('err' in success){
			success = {"err" : "Order completed error",
					"success" : "False"};
		}
		
		var general_send_data = await db.merchant_information_ID(data.muser_ID);
		general_send_data['type'] = "merchant_completed";
		general_send_data['orderId'] = data.order_ID;

		var guser_token = await db.general_token(order_data.GeneralUser_guser_ID);
		success = firebase.genera_message(guser_token, general_send_data);
		
		return success;
	}
	
	// orderspot : 소비자가 수령알림 확인
	// input dict
	// output dict
	async general_complete_message_check(data){
		var send_data = [];
		var order_data = await db.order_Search(data.order_ID);

		if(data.guser_ID != order_data.GeneralUser_guser_ID){	
			return {'err' : 'No permission'};
		}
		
		var success = await db.order_state(data.order_ID, 2);
		if('err' in success){
			success = {"err" : "Order complete message check error",
					"success" : "False"};
		}
		
		var merchant_send_data = {"type" : 'guser_message_check',
									"guser_ID" : data.guser_ID,
									"order_ID" : data.order_ID};
		
		var muser_token = await db.merchant_token(order_data.MerchantUser_muser_ID);
		success = firebase.merchant_message(muser_token, merchant_send_data, data.order_ID+' 주문의 사용자가 메시지를 확인했습니다.');
		
		return success;
	}
	
	// orderspot : 사용자 리뷰작성
	// input dict
	// output dict
	async user_review(data){
		var order_data = await db.order_Search(data.order_ID);
	
		if(order_data == null){
			return {'err' : 'No search menu'};
		}
		else if(data.guser_ID != order_data.GeneralUser_guser_ID){		
			return {'err' : 'No permission to review'};
		}
		
		var date = new Date();
		var time = dateFormat(date, "yyyy-mm-dd HH:MM:ss");
		
		var send_data = await db.write_review(order_data, data.review, time);
		
		return send_data;
	}
	
	// orderspot : 가맹점 리뷰검색
	// input dict
	// output dict
	async search_review(data){
		var send_data = await db.search_review(data.muser_ID, data.page);
		
		return send_data;
	}
	
	// orderspot : 가맹점 매출 검색
	// input dict
	// output dict
	async merchant_sales_search(data){		
		
		var date = new Date(data.start_day);
		
		if(data.term == 'h'){	
			
			var start_time = dateFormat(date, "yyyy-mm-dd");
			date.setDate(date.getDate()+1);
			var end_time = dateFormat(date, "yyyy-mm-dd");
			
			var send_data = await db.merchant_sales_search_H(data.muser_ID, start_time, end_time);
		}else if(data.term == 'd'){
			var date_DAY1 = new Date(date.getFullYear(), date.getMonth(), 1);
			var date_DAY2 = new Date(date.getFullYear(), date.getMonth()+1, 1);
			var start_day = dateFormat(date_DAY1, "yyyy-mm-dd");
			var end_day = dateFormat(date_DAY2, "yyyy-mm-dd");		
			
			var send_data = await db.merchant_sales_search_D(data.muser_ID, start_day, end_day);			
		}else if(data.term == 'm'){
			var date_DAY1 = new Date(date.getFullYear(), 0, 1);
			var date_DAY2 = new Date(date.getFullYear()+1, 0, 1);
			var start_day = dateFormat(date_DAY1, "yyyy-mm-dd");
			var end_day = dateFormat(date_DAY2, "yyyy-mm-dd");
			
			var send_data = await db.merchant_sales_search_M(data.muser_ID, start_day, end_day);
		}else if(data.term == 'y'){
			var send_data = await db.merchant_sales_search_Y(data.muser_ID);
		}
		
		if(send_data.length < 1){
			return {'error' : 'No merchant sales search'};
		}

		return send_data;
	}
	
	// orderspot : 소비자 소비 검색
	// input dict
	// output dict
	async guser_purchase_search(data){		
		
		var date = new Date(data.start_day);
		
		if(data.term == 'd'){
			var date_DAY1 = new Date(date.getFullYear(), date.getMonth(), 1);
			var date_DAY2 = new Date(date.getFullYear(), date.getMonth()+1, 1);
			var start_day = dateFormat(date_DAY1, "yyyy-mm-dd");
			var end_day = dateFormat(date_DAY2, "yyyy-mm-dd");
			
			var send_data = await db.guser_purchase_search_D(data.guser_ID, start_day, end_day);			
		}else if(data.term == 'm'){
			var date_DAY1 = new Date(date.getFullYear(), 0, 1);
			var date_DAY2 = new Date(date.getFullYear()+1, 0, 1);
			var start_day = dateFormat(date_DAY1, "yyyy-mm-dd");
			var end_day = dateFormat(date_DAY2, "yyyy-mm-dd");
			
			var send_data = await db.guser_purchase_search_M(data.guser_ID, start_day, end_day);
		}else if(data.term == 'y'){
			var send_data = await db.guser_purchase_search_Y(data.guser_ID);
		}
		
		if(send_data.length < 1){
			return {'error' : 'No guser purchase search'};
		}

		return send_data;
	}
	
	// orderspot : 소비자 편향 분석
	// input dict
	// output dict
	async guser_bias_analysis(data){		
		
		var date = new Date(data.start_day);
		
		if(data.term == 'd'){
			var date_DAY1 = new Date(date.getFullYear(), date.getMonth(), 1);
			var date_DAY2 = new Date(date.getFullYear(), date.getMonth()+1, 1);
			var start_day = dateFormat(date_DAY1, "yyyy-mm-dd");
			var end_day = dateFormat(date_DAY2, "yyyy-mm-dd");
			
			var send_data = await db.guser_bias_analysis_D(data.guser_ID, start_day, end_day);			
		}else if(data.term == 'm'){
			var date_DAY1 = new Date(date.getFullYear(), 0, 1);
			var date_DAY2 = new Date(date.getFullYear()+1, 0, 1);
			var start_day = dateFormat(date_DAY1, "yyyy-mm-dd");
			var end_day = dateFormat(date_DAY2, "yyyy-mm-dd");
			
			var send_data = await db.guser_bias_analysis_M(data.guser_ID, start_day, end_day);
		}else if(data.term == 'y'){
			var send_data = await db.guser_bias_analysis_Y(data.guser_ID);
		}
		
		if(send_data.length < 1){
			return {'error' : 'No guser bias analysis'};
		}

		return send_data;
	}
	
	// orderspot : 소비자 토큰 갱신
	// input dict
	// output dict
	async guser_token_update(data){	
		
		var user_check = await db.user_id_check(data.guser_ID);

		if(user_check.length > 0){
			var send_data = await db.guser_token_update(data.guser_ID, data.token);
		}
		
		return send_data;
	}
	
	// orderspot : 가맹점 토큰 갱신
	// input dict
	// output dict
	async muser_token_update(data){	
		var user_check = await db.merchant_id_check(data.muser_ID);
		
		if(user_check.length > 0){
			var send_data = await db.muser_token_update(data.muser_ID, data.token);
		}
		
		return send_data;
	}
	
	// orderspot : 사용자 매뉴 추천
	// input dict
	// output dict
	async guser_recommendation_list(data){	
		
		var guser_top_list = await db.guser_purchase_rank(data.guser_ID);
		var top_list = await db.purchase_rank();
		var recent_consumption_list = await db.guser_recent_consumption(data.guser_ID);
		var product_information = await db.product_search();
		
		var check_array = []
		for(var i=0, k = 0; i < guser_top_list.length; i++){
			for(var j=0; j < top_list.length; j++){
				if(guser_top_list[i]['productName'] == top_list[j]['productName']){
					check_array[k] = j;
					k += 1;
				}			
			}
		}
		
		for(var i=0, j=0; i < top_list.length; i++){
			if(check_array[j] != i){
				guser_top_list.push(top_list[i]);
			}else{
				j++;
			}
		}

		for(var i=0; i < recent_consumption_list.length; i++){
			for(var j=0; j < guser_top_list.length; j++){
				if(recent_consumption_list[i]['productName'] != guser_top_list[j]['productName']){
					if(guser_top_list[j].hasOwnProperty('score')){
						guser_top_list[j]['score'] += 10 - i;
					}else{
						guser_top_list[j]['score'] = 10 - i;
					}
				}
			}
		}

		for(var i=0; i < guser_top_list.length; i++){
			delete guser_top_list[i]['COUNT'];
		}
		
		for(var i=0; i < product_information.length; i++){
			for(var j=0; j < guser_top_list.length; j++){
				if(product_information[i]['productName'] == guser_top_list[j]['productName']){
					guser_top_list[j]['productImage'] = product_information[i]['productImage'];
				}
			}
		}
		
		guser_top_list.sort(function(a, b) {
			return b['score'] - a['score'];
		});
		
		
		return guser_top_list;
	}
	
	// orderspot : 가맹점 요청날짜 주문 리스트 출력
	// input dict
	// output dict
	async merchant_order_list(data){	
	
		var date = new Date(data.day);
		
		var start_time = dateFormat(date, "yyyy-mm-dd");
		date.setDate(date.getDate()+1);
		var end_time = dateFormat(date, "yyyy-mm-dd");
		
		console.log(start_time);
		console.log(end_time);
		var send_data = await db.order_search_by_date(data.muser_ID, start_time, end_time);
		
		for(var i=0; i < send_data.length; i++){
			send_data[i]['product'] = await db.list_of_product_ordered(send_data[i].order_ID);
		}
		
		return send_data;
	}
}

module.exports = orderspot_order;