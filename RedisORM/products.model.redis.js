const { Entity, Schema }=require('redis-om');
const { initRedis }=require( '../../utils/initRedis.js');
class Person extends Entity {}
const productSchemaRedis = new Schema(Person, {
    Name: { type: 'string' },
    MongoId: { type: 'string' },
    title: { type: 'string' },
    age: { type: 'number' },    
    shortDescription: { type: 'string' },
    Description: { type: 'text' },
    price: { type: 'number' },   
    pageView: { type: 'text' },
    isModify: { type: 'boolean' },
    isAvailable: { type: 'boolean' },
    isModify: { type: 'boolean' },
    location: { type: 'point' },

  });

module.exports={

  productSchemaRedis

  }