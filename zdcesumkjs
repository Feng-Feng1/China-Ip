/**
 * Nex Intelligent AutoSelect
 * 每个策略组独立测速，选取最低延迟节点
 * 防止卡死，异常节点自动跳过
 */

const groups = ["ChatGPT", "Telegram", "Apple", "Streaming"];
const testUrl = "http://www.gstatic.com/generate_204";
const timeout = 5000;

async function testPolicy(group, policy) {
  return new Promise((resolve) => {
    const start = Date.now();
    $httpClient.get({ url: testUrl, policy, timeout }, (err) => {
      if (err) return resolve({ policy, latency: Infinity });
      const latency = Date.now() - start;
      resolve({ policy, latency });
    });
  });
}

async function getPolicies(group) {
  const resp = await $httpAPI("GET", `/v1/policy_groups/${encodeURIComponent(group)}`);
  return resp.policies || [];
}

async function setBestPolicy(group, bestPolicy) {
  await $httpAPI("PUT", `/v1/policy_groups/${encodeURIComponent(group)}`, { policy: bestPolicy });
}

async function testGroup(group) {
  try {
    const policies = await getPolicies(group);
    let results = [];
    for (const p of policies) {
      const res = await testPolicy(group, p);
      results.push(res);
    }
    const best = results.reduce((a, b) => (a.latency < b.latency ? a : b));
    if (best.policy && best.latency < Infinity) {
      await setBestPolicy(group, best.policy);
      console.log(`[${group}] → ${best.policy} (${best.latency}ms)`);
    } else {
      console.log(`[${group}] 所有节点超时，跳过`);
    }
  } catch (e) {
    console.log(`[${group}] 测试出错：${e}`);
  }
}

async function main() {
  for (const g of groups) await testGroup(g);
  $done();
}

main();
