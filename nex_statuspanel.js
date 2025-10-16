/**
 * Nex Visual Status Panel
 * 在面板显示各策略组的当前节点与延迟
 */

const groups = ["ChatGPT", "Telegram", "Apple", "Streaming"];
const testUrl = "http://www.gstatic.com/generate_204";
const timeout = 5000;

async function getActivePolicy(group) {
  const res = await $httpAPI("GET", `/v1/policy_groups/${encodeURIComponent(group)}`);
  return res.policy || "未知";
}

async function testLatency(policy) {
  return new Promise((resolve) => {
    const start = Date.now();
    $httpClient.get({ url: testUrl, policy, timeout }, (err) => {
      if (err) return resolve("超时");
      const latency = Date.now() - start;
      resolve(`${latency}ms`);
    });
  });
}

async function main() {
  let lines = [];
  for (const g of groups) {
    const active = await getActivePolicy(g);
    const latency = await testLatency(active);
    lines.push(`${g}：${active} (${latency})`);
  }
  $done({ title: "当前策略组状态", content: lines.join("\n") });
}

main();
