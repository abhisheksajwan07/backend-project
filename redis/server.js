const redis = require("redis");

// create redis client using createclient method
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

//event listener

client.on("error", (error) =>
  console.log("Redis client error occured!", error)
);

async function testRedisConnection() {
  try {
    // connect method
    await client.connect();
    console.log("Connected to redis");

    // set method -> key and value

    await client.set("name", "abhishek");
    const extractValue = await client.get("name");
    console.log(extractValue);

    // to delete
    const deleteCount = await client.del("name");
    // console.log(deleteCount);

    const extractedValue = await client.get("name");
    console.log(extractedValue);

    // count increment
    await client.set("count", "100");
    const incrementCount = await client.incr("count");
    console.log(incrementCount);

    //count decrement
    const decrementCount = await client.decr("count");
    console.log(decrementCount)

    // console.log(await client.get("count"))

  } catch (err) {
    console.error(err);
  } finally {
    // qutting from particular connection
    console.log("qutting connection");
    await client.quit();
  }
}
testRedisConnection();
