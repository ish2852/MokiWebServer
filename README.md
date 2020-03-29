# Noki general App
NFC와 FCM를 통해 매장에서 주문하는 키오스크를 App으로 만든 프로젝트 입니다.
General App, Merchant App, Web Server  총 3개의 프로젝트 중 Web Server의 Repository입니다.


## 파일구조
```
└─OrderSpot
    │  app.js
    ├─models
    │      orderspot_db.js
    │      orderspot_firebase.js
    │      orderspot_member.js
    │      orderspot_order.js
    │
    ├─router
    │      index.js
    │      orderspot.js
    │
    └─views
            index.ejs
```

## 개발환경
- Node JS
	- Firebase Cloud Messaging
- MySQL
- AWS EC2

## 프로젝트 설명
- App과 Rest API 형식으로 통신합니다.
- FCM을 사용하여 Push Message를 전송합니다.

## 아쉬운 점
- 코드 안에 설정 정보가 포함되어 있습니다. 보안과 수정에 매우 취약합니다.
- web server를 개발할 당시 클린 코드를 몰랐습니다. 그 때문에 불필요한 주석, naming, 적절한 파일 분할을 통한 코드 관리가 많이 부족했습니다.
-  Node JS의 장점인 비동기 방식을 활용하지 못했습니다. 
