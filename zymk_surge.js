/**
 * 知音漫客 解锁会员+付费
 * Surge 兼容版 by 夜日 & GPT
 * 原作者: @WeiGiegie
 * 更新时间: 2025-10-27
 * 
 * 功能:
 * - 解锁会员状态
 * - 解锁付费章节
 * - 移除广告请求
 */

let url = $request.url;
let body = $response.body;

if (!body) $done({});

// 解锁会员信息
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

// 解锁付费章节
else if (url.includes("/paychapters")) {
  let obj = JSON.parse(body);
  obj.status = 0; // 表示无需付费
  body = JSON.stringify(obj);
  $done({ body });
}

// 默认返回
else {
  $done({});
}
