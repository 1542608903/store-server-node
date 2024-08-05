const Queue = require("bull");
const redisClient = require("../db/redis");

// 创建一个 Bull 队列
const orderQueue = new Queue("orderQueue", redisClient);

// 处理队列中的任务
orderQueue.process(async job => {
  const order_Id = job.data;
});

module.exports = orderQueue;
