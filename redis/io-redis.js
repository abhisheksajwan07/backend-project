const Redis = require("ioredis");
const client = new Redis(); // default localhost:6379

(async () => {
  try {
    // --- Strings ---
    await client.set("username", "abhishek");
    const username = await client.get("username");
    console.log("Username:", username);

    // --- Hashes ---
    await client.hset("cart:1234", "item_count", 2, "total_price", 100);
    const cart = await client.hgetall("cart:1234");
    console.log("Cart:", cart);

    // --- Lists ---
    await client.lpush("tasks", "task1", "task2", "task3");
    const tasks = await client.lrange("tasks", 0, -1);
    console.log("Tasks:", tasks);

    // --- Sets ---
    // key= users
    await client.sadd("users", "john", "varun", "alex");
    const users = await client.smembers("users");
    console.log("Users:", users);

    // --- Pub/Sub ---
    const subscriber = new Redis();
    // wait for subscription to complete
    await subscriber.subscribe("channel1", (err, count) => {
      console.log("Subscribed to channel1");
    });
    subscriber.on("message", (channel, message) => {
      console.log(`Received from ${channel}: ${message}`);
    });
    await client.publish("channel1", "Hello from publisher");

    // --- Pipeline ---
    //  Redis har command ke liye [error, result] tuple return karta hai. 
    const pipeline = client.pipeline();
    for (let i = 0; i < 5; i++) {
      pipeline.set(`user:${i}`, `value${i}`);
    }
    const pipelineResults = await pipeline.exec();
    console.log("Pipeline results:", pipelineResults);

    // --- Transaction ---
    await client.del("counter");  // reset
    const transaction = client.multi();
    transaction.incr("counter");
    transaction.incr("counter");
    const transactionResults = await transaction.exec();
    console.log("Transaction results:", transactionResults);
    await subscriber.quit();
  } catch (err) {
    console.error(err);
  } finally {
    await client.quit();
  }
})();


// (async () => {
// async code
//  Immediately Invoked Async Function Expression (IIAFE).
// })();