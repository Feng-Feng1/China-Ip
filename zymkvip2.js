#!name=知音漫客VIP解锁
#!update=2025-10-27

[Script]
# 解锁会员信息接口
http-response ^https?:\/\/apigate\.kaimanhua\.com\/zymk.+getuserinfo requires-body=true, script-path=https://raw.githubusercontent.com/Feng-Feng1/surge/refs/heads/main/zymk_surge.js, tag=知音漫客-会员解锁, timeout=10

# 解锁付费章节接口
http-response ^https?:\/\/apigate\.kaimanhua\.com\/zymk.+paychapters requires-body=true, script-path=https://raw.githubusercontent.com/Feng-Feng1/surge/refs/heads/main/zymk_surge.js, tag=知音漫客-章节解锁, timeout=10

# 屏蔽广告接口
http-response ^https?://api-cdn\.kaimanhua\.com/advertiseapi/app/advertise/getappadvertise reject

[MITM]
hostname = apigate.kaimanhua.com, api-cdn.kaimanhua.com
