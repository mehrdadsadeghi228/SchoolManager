const {createClient}=require('redis');

const client= createClient();
client.on('connect',() =>console.log('Redis Client connect port: 6379'));
client.on("ready", () => console.log("connected to redis and ready to use..."));
client.on('error',err=> console.log('Redis Client Error ',err));
client.on("end", () => console.log("disconnected from redis...."))

 client.connect();

module.exports={
    initRedis:client
}