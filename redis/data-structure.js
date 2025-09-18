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
    await client.connect();
    await client.set("user:name", "abhishek");
    const name = await client.get("user:name");
    // console.log(name);

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

    // console.log(email, age, country);

    // lists -> LPUSH ,RPUSH, LRANGE, LPOP, RPOP

    // await client.lPush("notes", ["note 1", " note 2", "note 3"]);

    // 0 to -1(0 to last elemenet)
    // const extractAllNotes = await client.lRange("notes", 0, -1);
    // console.log(extractAllNotes);

    // Pop → "note 3" nikla
    // const firstNote = await client.lPop("notes");
    // console.log(firstNote);

    // Remaining → [" note 2", "note 1"]
    // const remainingNotes = await client.lRange("notes", 0, -1);
    // console.log(remainingNotes, "remainingNotes");

    // sets -> SADD, SMEMBERS, SISMEMBER, SREM
    // await client.sAdd("user:nickName", ["john", "varun", "xyz"]);
    // const extractUserNicknames = await client.sMembers("user:nickName");
    // console.log(extractUserNicknames);

    // const isVarunIsOneOfUserNickName = await client.sIsMember(
    //   "user:nickName",
    //   "varun"
    // );
    // console.log(`present: ${isVarunIsOneOfUserNickName}`);

    // await client.sRem("user:nickName", "xyz");
    // "xyz" remove ho jayega set se.

    // const getUpdatedUserNickNames = await client.sMembers("user:nickName");
    // console.log(getUpdatedUserNickNames);

    // ZADD, ZRANGE, ZRANK, ZREM
    // await client.zAdd("cart", [
    //   {
    //     score: 100,
    //     value: "Cart 1",
    //   },
    //   {
    //     score: 150,
    //     value: "Cart 2",
    //   },
    //   {
    //     score: 10,
    //     value: "Cart 3",
    //   },
    // ]);

    // const getCartItems = await client.zRange("cart", 0, -1);
    // console.log(getCartItems);

    // const extractAllCartItemsWithScore = await client.zRangeWithScores(
    //   "cart",
    //   0,
    //   -1
    // );
    // console.log(extractAllCartItemsWithScore);

    // Get rank (index) of an element (ascending order by score).
    // const cartTwoRank = await client.zRank("cart", "Cart 2");
    // console.log(cartTwoRank);

    //hashes -> HSET, HGET, HGETALL, HDEL

    await client.hSet("product:1", {
      name: "Product 1",
      description: "product one description",
      rating: "5",
    });

    const getProductRating = await client.hGet("product:1", "rating");
    console.log(getProductRating);

    const getProductDetails = await client.hGetAll("product:1");
    console.log(getProductDetails);

    await client.hDel("product:1", "rating");

    const updatedProductDetails = await client.hGetAll("product:1");
    console.log(updatedProductDetails);

  } catch (e) {
    console.error(e);
  } finally {
    client.quit();
  }
}

redisDataStructures();
