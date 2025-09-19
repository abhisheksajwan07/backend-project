1. Redis client banate ho
```
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});
```

* Yeh ek Redis client bana raha hai jo tumhare local Redis server (port 6379) se connect karega.

* client ko tum publisher ke roop me use karoge.

2. Error handling
```
client.on("error", (error) =>
  console.log("Redis client error occured!", error)
);
```


* Agar Redis server band ho ya connection me problem ho to ye error catch karega.

3. Subscriber client banate ho

```
const subscriber = client.duplicate();
await subscriber.connect();
```


* Important: Pub/Sub ke liye tumhe ek alag client connection chahiye hota hai.

* Isliye tumne client.duplicate() se ek subscriber client banaya.

* Ab tumhare paas:

   * client → publisher

    * subscriber → subscriber

4. Subscribe karna

```
await subscriber.subscribe("dummy-channel", (message, channel) => {
  console.log(`received message from ${channel}: ${message}`);
});
```

* Yaha tum subscriber ko bol rahe ho → "dummy-channel" pe sunna.

* Jab bhi koi publisher message bhejega is channel pe → ye callback run hoga aur message print karega.

5. Publish karna
```
await client.publish("dummy-channel", "some dummy data from publisher");
await client.publish("dummy-channel", "some new messaeg again from publisher");
```


* Ab tumne client (publisher) se "dummy-channel" par 2 messages bhej diye.

* Turant hi ye subscriber ke callback me receive ho jaayenge.

6. Time dena aur clean up
```
await new Promise((resolve) => setTimeout(resolve, 3000));
await subscriber.unsubscribe("dummy-channel");
await subscriber.quit();
await client.quit();
```


* setTimeout diya taaki subscriber ke paas message receive karne ka time ho.

* Uske baad:

  * Unsubscribe → channel chhod do

   * Quit → Redis connection band kar do

⚡ Flow Summary

Publisher (client) → Redis channel (dummy-channel) pe message bhejta hai.

Subscriber (subscriber) → wahi channel sun raha hota hai, aur turant message receive karta hai.

Dono ek dusre ko direct nahi jaante, bas ek channel name common hota hai.