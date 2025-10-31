#!name=知音漫客VIP解锁
#!desc=解锁会员与付费章节
#!update=2025-10-27
[Script]
http-response ^https:\/\/apigate\.kaimanhua\.com\/(zymk-getuserinfo-api\/v1\/getuserinfo|zymk-userpurchased-api\/v1\/userpurchased\/paychapters)\/ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Feng-Feng1/surge/refs/heads/main/zymkvip2.js
[MITM]
hostname = apigate.kaimanhua.com, api-cdn.kaimanhua.com

let url = $request.url;
let body = $response.body;

if (!body) $done({});

if (url.includes("/getuserinfo")) {
  let obj = JSON.parse(body);
  if (obj && obj.data) {
    obj.data.Uname = "VIP用户";
    obj.data.isvip = 1;
    obj.data.vipdays = 9999;
    obj.data.vipdate = 1;
    obj.data.Uviptime = 9999999999999;
    obj.data.Cgold = 999999;
    obj.data.coins = 999999;
    obj.data.Ulevel = 20;
    obj.data.headpic = "https://zdimg.lifeweek.com.cn/app/20240614/17183119665002415.jpg";
  }
  body = JSON.stringify(obj);
  $done({ body });
}

else if (url.includes("/paychapters")) {
  let obj = JSON.parse(body);
  obj.status = 0;
  body = JSON.stringify(obj);
  $done({ body });
}

else {
  $done({});
}
