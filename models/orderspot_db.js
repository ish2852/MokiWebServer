// models/orderspot_db.js

const mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: 'localhost',
	user: 'ish',
	password: 'xhddlf',
	database: 'orderspot',
	charset : 'utf8'
});

class orderspot_db {
    constructor() {
	}
	
	
	// orderspot : 회원 로그인 체크
	// input str, str
	// output dict
	async user_login(id, pw){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT * from GeneralUser where guser_ID=? and guserPassword=?", [id, pw]);
				connection.release();
				return data[0];
			}catch(err){
				connection.release();
				return {'err' : 'Inappropriate elements'}
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}	
	
	// orderspot : 회원 ID 체크
	// input str
	// output dict
	async user_id_check(id){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT * from GeneralUser where guser_ID=?", [id]);
				connection.release();
				return data[0];
			}catch(err){
				connection.release();
				return {'err' : 'Id in use'}
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 사용자 회원가입
	// input dict
	// output dict
	async user_join(data){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("INSERT INTO GeneralUser(guser_ID, guserPassword, guserName, guserPhoneNum1, guserPhoneNum2, guserEmail) VALUE(?, ?, ?, ?, ?, ?)"
					,[data.id, data.pw, data.name, data.phone1, data.phone2, data.email]);
				connection.release();
				return {'success' : 'True'};
			}catch(err){
				connection.release();
				return {'err' : 'Join information error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 회원 로그인 체크
	// input str, str
	// output dict
	async merchant_login(id, pw){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT * from MerchantUser where muser_ID=? and muserPassword=?", [id, pw]);
				connection.release();
				return data[0];
			}catch(err){
				connection.release();
				return {'err' : 'Inappropriate elements'}
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}	
	
	// orderspot : 가맹점 ID 체크
	// input str
	// output dict
	async merchant_id_check(id){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT * from MerchantUser where muser_ID=?", [id]);
				connection.release();
				return data[0];
			}catch(err){
				connection.release();
				return {'err' : 'Id in use'}
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 회원가입
	// input dict
	// output dict
	async merchant_join(data){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("INSERT INTO MerchantUser(muser_ID, muserPassword, muserName, muserGPS, muserPhoneNum1, muserPhoneNum2, muserEmail) VALUE(?, ?, ?, ?, ?, ?, ?)"
					,[data.id, data.pw, data.name, data.GPS, data.phone1, data.phone2, data.email]);
				connection.release();
				return {'success' : 'True'};
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Join information error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 정보(GPS)
	// input str
	// output dict
	async merchant_information_GPS(GPS){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT muser_ID, muserName, muserGPS  from MerchantUser WHERE muserGPS = ?" ,[GPS]);
				
				return data[0][0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'No search merchant'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 정보(ID)
	// input str
	// output dict
	async merchant_information_ID(muser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT muser_ID, muserName, muserGPS  from MerchantUser WHERE muser_ID = ?" ,[muser_ID]);

				return data[0][0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'No search merchant'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 매뉴 리스트
	// input str
	// output dict
	async menu_list(muser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				//가맹점_ID를 통해 메뉴 검색
				var data = await connection.query("SELECT * from Product WHERE MerchantUser_muser_ID = ?" ,[muser_ID]);
				connection.release();
			
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'No search menu'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 주문 생성
	// input dict, int, str
	// output dict
	async user_order(data, order_Pay, time){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("INSERT INTO Order_2(MerchantUser_muser_ID, GeneralUser_guser_ID, orderRequirement, orderState, orderPay, orderApproveTime) VALUE(?, ?, ?, ?, ?, ?)"
					,[data.muser_ID, data.guser_ID, data.requirement, 0, order_Pay, time]);
				connection.release();
				return data[0].insertId;
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'No search menu'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 상품카트 생성
	// input int, str, int
	// output dict
	async product_cart_insert(order_id, product_id, product_amount){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("INSERT INTO ProductCart(Order_2_order_ID, Product_product_ID, Amount) VALUE(?, ?, ?)"
					,[order_id, product_id, product_amount]);
				connection.release();
				
				return {'success' : 'True'};
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	
	// orderspot : 주문에 대한 상품 일괄 출력
	// input int
	// output dict
	async order_cart_list(order_id){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT p.product_ID, p.Category_category_ID, p.productName, p.productPrice FROM ProductCart AS pc JOIN Product AS p ON pc.Product_product_ID = p.product_ID WHERE pc.Order_2_order_ID = ?"
					,[order_id]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 토큰검색
	// input str
	// output str
	async merchant_token(muser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT muserToken FROM MerchantUser WHERE muser_ID = ?"
					,[muser_ID]);
				connection.release();
				
				return data[0][0]['muserToken'];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 주문 조회
	// input str
	// output dict
	async order_Search(order_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT * FROM Order_2 WHERE order_ID = ?"
					,[order_ID]);
				connection.release();
				
				return data[0][0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 주문상태 업데이트
	// input str, int
	// output dict
	async order_state(order_ID, state){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("UPDATE `orderspot`.`Order_2` SET `orderState`=? WHERE  `order_ID`=?"
					,[state,order_ID]);
				connection.release();
				
				return {'success' : 'True'};
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 사용자 토큰검색
	// input str
	// output str
	async general_token(guser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT guserToken FROM GeneralUser WHERE guser_ID = ?"
					,[guser_ID]);
				connection.release();
				
				return data[0][0]['guserToken'];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 리뷰 추가
	// input dict, str, str, date
	// output dict
	async write_review(input_data, review, time){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("INSERT INTO ReviewForFood(MerchantUser_muser_ID, GeneralUser_guser_ID, ReviewContent, writeTime) VALUE(?, ?, ?, ?)"
					,[input_data.MerchantUser_muser_ID, input_data.GeneralUser_guser_ID, review, time]);
				connection.release();
				
				return {'success' : 'True'};
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 리뷰 검색
	// input str, int
	// output dict
	async search_review(muser_ID, page){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query("SELECT * FROM ReviewForFood WHERE MerchantUser_muser_ID = ? LIMIT ?, 5"
					,[muser_ID, page*5]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 매출검색 시간단위
	// input str, str, str
	// output dict
	async merchant_sales_search_H(muser_ID, start_time, end_time){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(orderApproveTime, '%Y-%m-%d %H') AS DATE , SUM(orderPay) AS SALES, COUNT(*) AS COUNT FROM Order_2 WHERE MerchantUser_muser_ID = ? AND orderState = 2 AND orderApproveTime > ? AND orderApproveTime < ? GROUP BY DATE_FORMAT(orderApproveTime, '%Y-%m-%d %H')"
					,[muser_ID, start_time, end_time]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 매출검색 일단위
	// input str, str, str
	// output dict
	async merchant_sales_search_D(muser_ID, start_day, end_day){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(orderApproveTime, '%Y-%m-%d') AS DATE , SUM(orderPay) AS SALES, COUNT(*) AS COUNT FROM Order_2 WHERE MerchantUser_muser_ID = ? AND orderState = 2 AND orderApproveTime > ? AND orderApproveTime < ? GROUP BY DATE_FORMAT(orderApproveTime, '%Y-%m-%d')"
					,[muser_ID, start_day, end_day]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 매출검색 월단위
	// input str, str, str
	// output dict
	async merchant_sales_search_M(muser_ID, start_day, end_day){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(orderApproveTime, '%Y-%m') AS DATE , SUM(orderPay) AS SALES, COUNT(*) AS COUNT FROM Order_2 WHERE MerchantUser_muser_ID = ? AND orderState = 2 AND orderApproveTime > ? AND orderApproveTime < ? GROUP BY DATE_FORMAT(orderApproveTime, '%Y-%m')"
					,[muser_ID, start_day, end_day]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 매출검색 년단위
	// input str
	// output dict
	async merchant_sales_search_Y(muser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(orderApproveTime, '%Y') AS DATE , SUM(orderPay) AS SALES, COUNT(*) AS COUNT FROM Order_2 WHERE MerchantUser_muser_ID = ? AND orderState = 2 GROUP BY DATE_FORMAT(orderApproveTime, '%Y')"
					,[muser_ID]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 소비자 소비검색 일단위
	// input str, str, str
	// output dict
	async guser_purchase_search_D(guser_ID, start_day, end_day){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(orderApproveTime, '%Y-%m-%d') AS DAY , SUM(orderPay) AS SALES, COUNT(*) AS COUNT FROM Order_2 WHERE GeneralUser_guser_ID = ? AND orderApproveTime > ? AND orderApproveTime < ? GROUP BY DATE_FORMAT(orderApproveTime, '%Y-%m-%d')"
					,[guser_ID, start_day, end_day]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 소비자 소비검색 월단위
	// input str, str, str
	// output dict
	async guser_purchase_search_M(guser_ID, start_day, end_day){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(orderApproveTime, '%Y-%m') AS DAY , SUM(orderPay) AS SALES, COUNT(*) AS COUNT FROM Order_2 WHERE GeneralUser_guser_ID = ? AND orderApproveTime > ? AND orderApproveTime < ? GROUP BY DATE_FORMAT(orderApproveTime, '%Y-%m')"
					,[guser_ID, start_day, end_day]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 소비자 소비검색 년단위
	// input str, str, str
	// output dict
	async guser_purchase_search_Y(guser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(orderApproveTime, '%Y') AS DAY , SUM(orderPay) AS SALES, COUNT(*) AS COUNT FROM Order_2 WHERE GeneralUser_guser_ID = ? GROUP BY DATE_FORMAT(orderApproveTime, '%Y')"
					,[guser_ID]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}

	// orderspot : 소비자 편향 분석 일단위
	// input str, str, str
	// output dict
	async guser_bias_analysis_D(guser_ID, start_day, end_day){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(o.orderApproveTime, '%Y-%m-%d') AS DAY, c.categoryName AS CATEGORY, SUM(pc.Amount) AS COUNT FROM ProductCart AS pc JOIN Product AS p ON p.product_ID = pc.Product_product_ID JOIN Order_2 AS o ON o.order_ID = pc.Order_2_order_ID JOIN Category  AS c ON c.category_ID = p.Category_category_ID WHERE  o.GeneralUser_guser_ID = ? AND o.orderApproveTime > ? AND  o.orderApproveTime < ? GROUP BY p.Category_category_ID, DATE_FORMAT(orderApproveTime, '%Y-%m-%d') ORDER BY DAY ASC"
					,[guser_ID, start_day, end_day]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 소비자 편향 분석 월단위
	// input str, str, str
	// output dict
	async guser_bias_analysis_M(guser_ID, start_day, end_day){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(o.orderApproveTime, '%Y-%m') AS DAY, c.categoryName AS CATEGORY, SUM(pc.Amount) AS COUNT FROM ProductCart AS pc JOIN Product AS p ON p.product_ID = pc.Product_product_ID JOIN Order_2 AS o ON o.order_ID = pc.Order_2_order_ID JOIN Category  AS c ON c.category_ID = p.Category_category_ID WHERE  o.GeneralUser_guser_ID = ? AND o.orderApproveTime > ? AND  o.orderApproveTime < ? GROUP BY p.Category_category_ID, DATE_FORMAT(orderApproveTime, '%Y-%m') ORDER BY DAY ASC"
					,[guser_ID, start_day, end_day]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 소비자 편향 분석 년단위
	// input str
	// output dict
	async guser_bias_analysis_Y(guser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT DATE_FORMAT(o.orderApproveTime, '%Y') AS DAY, c.categoryName AS CATEGORY, SUM(pc.Amount) AS COUNT FROM ProductCart AS pc JOIN Product AS p ON p.product_ID = pc.Product_product_ID JOIN Order_2 AS o ON o.order_ID = pc.Order_2_order_ID JOIN Category  AS c ON c.category_ID = p.Category_category_ID WHERE  o.GeneralUser_guser_ID = ? GROUP BY p.Category_category_ID, DATE_FORMAT(orderApproveTime, '%Y') ORDER BY DAY ASC"
					,[guser_ID]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 소비자 토큰 갱신
	// input str, str
	// output dict
	async guser_token_update(guser_ID, token){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"UPDATE GeneralUser SET guserToken = ? WHERE guser_ID = ?"
					,[token, guser_ID]);
				connection.release();
				
				return {'success' : 'True'};
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 가맹점 토큰 갱신
	// input str, str
	// output dict
	async muser_token_update(muser_ID, token){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"UPDATE MerchantUser SET muserToken = ? WHERE muser_ID = ?"
					,[token, muser_ID]);
				connection.release();
				
				return {'success' : 'True'};
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 사용자 구매순위 top5
	// input str
	// output dict
	async guser_purchase_rank(guser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT  p.productName, COUNT(p.productName) AS COUNT FROM ProductCart AS pc JOIN Order_2 AS o ON pc.Order_2_order_ID = o.order_ID JOIN Product AS p ON p.product_ID = pc.Product_product_ID where o.GeneralUser_guser_ID = ? AND p.Category_category_ID != 'Ct70' GROUP BY p.productName LIMIT 5"
					,[guser_ID]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 구매순위 top5
	// output dict
	async purchase_rank(){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT  p.productName, COUNT(p.productName) AS COUNT FROM ProductCart AS pc JOIN Order_2 AS o ON pc.Order_2_order_ID = o.order_ID JOIN Product AS p ON p.product_ID = pc.Product_product_ID where p.Category_category_ID != 'Ct70' GROUP BY p.productName LIMIT 5");
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 사용자 최근 소비항목 (최신순 10개)
	// input str
	// output dict
	async guser_recent_consumption(guser_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT p.productName, o.orderApproveTime FROM ProductCart AS pc JOIN Order_2 AS o ON pc.Order_2_order_ID = o.order_ID JOIN Product AS p ON p.product_ID = pc.Product_product_ID WHERE o.GeneralUser_guser_ID = ? AND p.Category_category_ID != 'Ct70' ORDER BY o.orderApproveTime DESC LIMIT 10"
				,[guser_ID]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 상품 (이름, 이미지) 일괄 검색
	// output dict
	async product_search(){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT productName, productImage FROM Product");
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 날짜별 주문 리스트 검색
	// input str, str, str
	// output dict
	async order_search_by_date(muser_ID, start_time, end_time){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT * FROM Order_2 WHERE MerchantUser_muser_ID = ? AND orderApproveTime > ? AND orderApproveTime < ? "
				,[muser_ID, start_time, end_time]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
	
	// orderspot : 특정 주문의 상품리스트 조회
	// input str
	// output dict
	async list_of_product_ordered(order_ID){
		try{
			try{
				var connection = await pool.getConnection(async conn => conn);
				var data = await connection.query(
				"SELECT product_ID, productName, productPrice, Amount, productImage FROM ProductCart AS pc JOIN Product AS p ON p.product_ID = pc.Product_product_ID WHERE pc.Order_2_order_ID = ?"
				,[order_ID]);
				connection.release();
				
				return data[0];
			}catch(err){
				connection.release();
				console.log(err);
				return {'err' : 'Sql query error'};
			}
		}catch(err){
			return {'err' : 'DB Error'};
		}
	}
}

module.exports = orderspot_db;