const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

//event listener

client.on("error", (error) =>
  console.log("Redis client error occured!", error)
);

async function redisDataStructures() {
  try {
    await client.connect()
    await client.set("user:name", "abhishek");
    const name = await client.get("user:name");
    console.log(name);

    await client.mSet([
      "user:email",
      "abhi@gmail.com",
      "user:age",
      "20",
      "user:country",
      "India",
    ]);

    const [email, age, country] = await client.mGet([
      "user:email",
      "user:age",
      "user:country",
    ]);

    console.log(email, age, country);


    // lists -> LPUSH ,RPUSH, LRANGE, LPOP, RPOP

    await client.lPush("notes",["note 1" ," note 2", "note 3"]);

    const extractAllNotes = await client.lRange("notes",0,-1)


  } catch (e) {
    console.error(e);
  } finally {
    client.quit();
  }
}

redisDataStructures();
