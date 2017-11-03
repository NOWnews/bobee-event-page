# 拉ＢＡＲ機

## 系統資訊

Node.js v6.2.2
MongoDB v3.4.4

## 設定
1. DB path : `config/config.js`
2. facebookAppId : `config/config.js` facebook.appId ( 前端fb登入會用到 如fb無法登入 要去facebook應用程式設定可登入的domain name )
3. 頁面 /setting 的帳號密碼：`config/gameConfig.js` settingPageAuth

## 啟動
1. 正式 `npm start`
2. 開發 `npm run dev`

## 頁面
1. 唯一主頁：http://localhost:8080
2. 遊戲勝率設定頁 http://localhost:8080/setting

## 前端拉BAR遊戲修改自
https://codepen.io/longto/pen/zBLGkd

## Express MVC Scaffolder from Yeoman Express
https://github.com/petecoop/generator-express