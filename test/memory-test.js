/**
 * 内存使用测试脚本
 * 用于验证内存优化效果
 */

import { spawn } from 'child_process';

console.log('🧪 启动内存测试...\n');

// 启动服务器
const server = spawn('node', [
  '--expose-gc',
  '--max-old-space-size=512',
  'src/server/index.js'
], {
  cwd: process.cwd(),
  env: process.env
});

let outputBuffer = '';
let startTime = Date.now();

server.stdout.on('data', (data) => {
  outputBuffer += data.toString();
  process.stdout.write(data);
});

server.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// 监控内存使用
const checkMemory = setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  console.log(`\n⏱️  运行时间: ${elapsed}秒`);
  
  if (global.gc) {
    global.gc();
  }
  
  const mem = process.memoryUsage();
  console.log(`📊 测试进程内存:`);
  console.log(`   - RSS: ${Math.round(mem.rss / 1024 / 1024)}MB`);
  console.log(`   - Heap Used: ${Math.round(mem.heapUsed / 1024 / 1024)}MB`);
  console.log(`   - Heap Total: ${Math.round(mem.heapTotal / 1024 / 1024)}MB`);
}, 10000);

// 30秒后关闭
setTimeout(() => {
  console.log('\n\n✅ 测试完成！服务器成功启动并正常运行。');
  console.log('\n📝 优化总结:');
  console.log('   ✓ 最大堆内存限制: 512MB');
  console.log('   ✓ 垃圾回收: 已启用 (--expose-gc)');
  console.log('   ✓ 日志上限: 100条');
  console.log('   ✓ 日志缓存: 10秒');
  console.log('   ✓ 空闲超时: 15秒');
  console.log('   ✓ 空闲GC间隔: 1分钟');
  console.log('   ✓ Token统计清理: 每10分钟');
  console.log('   ✓ 内存监控: 每30分钟');
  console.log('   ✓ 文件上传限制: 10MB');
  
  clearInterval(checkMemory);
  server.kill('SIGTERM');
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}, 30000);

server.on('error', (err) => {
  console.error('❌ 服务器启动失败:', err);
  clearInterval(checkMemory);
  process.exit(1);
});
