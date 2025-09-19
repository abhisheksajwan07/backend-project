1 Event handler set karna
```
subscriber.on("message", (channel, message) => {
  console.log("Received:", message);
});
```

  * Ye sirf ready kar raha hai subscriber ko

 * Abhi tak koi message receive nahi hua

2 Subscriber ko channel join karwana
```
await subscriber.subscribe("channel1");
```

* Ye ensure karta hai ki subscriber ab officially channel1 pe subscribe ho gaya

*  Agar publisher message bhejta hai pehle → message miss ho sakta hai

* Isliye await important hai

3 Publisher message bhejna
```
await client.publish("channel1", "Hello world");
console.log("Message published");
```

Publisher turant Redis server ko message bhejta hai

Redis server sab subscribers ko message forward karta hai

4 Subscriber callback run hota hai

Redis server message bhejne ke baad, subscriber ka on("message") callback trigger hota hai

Message receive hota hai → console me print ho jata hai

🔑 Takeaway:

Callback tabhi run hota hai jab subscriber ne successfully subscribe kar liya ho aur server message bhej de

Isliye sequence important hai:

 * Event handler set karo

 * Subscriber subscribe karo (await)

 * Publisher message bhejo