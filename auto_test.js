// auto_test.js
// —— 自动测速并切换最低延迟节点 ——
// 特点：并行测速 + 自动重试 + 错误跳过防卡死 + 简洁日志

// —— 参数区 ——
// 策略组名称（需与 Surge 中策略组名一致）
const policyGroupName = "AutoSwitch";
// 测速地址（可改为国内或国际）
const testUrl = "http://www.gstatic.com/generate_204";
// 每个请求超时时间（毫秒）
const timeout = 5000;
// 每个节点失败后重试次数
const retryCount = 1;
// 是否显示详细日志（true = 显示每个节点测速结果）
const verbose = true;

/**
 * 测试节点延迟（带重试）
 */
async function testNode(policy) {
  for (let i = 0; i <= retryCount; i++) {
    try {
      const start = Date.now();
      await new Promise((resolve, reject) => {
        $httpClient.get({ url: testUrl, policy, timeout }, (err, resp) => {
          if (err || !resp) reject(err || "无响应");
          else resolve();
        });
      });
      return Date.now() - start; // 成功返回延迟
    } catch (e) {
      if (i === retryCount) return Infinity; // 多次失败算失效
    }
  }
}

/**
 * 主流程
 */
async function main() {
  try {
    let stored = $persistentStore.read(policyGroupName + "_nodes");
    let policies;

    if (!stored) {
      const res = await $httpAPI("GET", `/v1/policy_groups/${encodeURIComponent(policyGroupName)}`);
      policies = res?.policies || [];
      $persistentStore.write(JSON.stringify(policies), policyGroupName + "_nodes");
    } else {
      policies = JSON.parse(stored);
    }

    if (!policies.length) throw new Error("未找到任何节点");

    // 并行测速
    const results = await Promise.all(
      policies.map(async (p) => {
        const latency = await testNode(p);
        if (verbose) console.log(`🧭 ${p} → ${latency === Infinity ? "失败" : latency + "ms"}`);
        return { policy: p, latency };
      })
    );

    // 找最优节点
    const best = results.reduce((a, b) => (a.latency < b.latency ? a : b));

    if (best.latency === Infinity) {
      console.log("❌ 所有节点测速失败，保持当前节点不变");
      return $done();
    }

    // 读取当前使用的节点
    const current = (await $httpAPI("GET", `/v1/policy_groups/${encodeURIComponent(policyGroupName)}`)).policy;
    if (current === best.policy) {
      console.log(`✅ 当前节点 ${best.policy} 已是最优 (${best.latency}ms)`);
    } else {
      await $httpAPI("PUT", `/v1/policy_groups/${encodeURIComponent(policyGroupName)}`, { policy: best.policy });
      console.log(`⚡️ 已切换 ${policyGroupName} → ${best.policy} (${best.latency}ms)`);
    }

  } catch (err) {
    console.log("🚨 测速脚本出错：", err.message || err);
  } finally {
    $done();
  }
}

main();
