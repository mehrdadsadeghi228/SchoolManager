const express=require('express');
const http=require('http');
const AllRouters=require('./routers/routers');
const cors=require('cors');
const path=require('path');
const mongoose=require('mongoose');
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const initRedis = require('./utils/initRedis');
module.exports=class Application{
    #app=express();
    #DB_URL
    #PORT

    constructor(port,db_url){
        this.#PORT=port;
        this.#DB_URL=db_url;
        this.configApplication();
        this.connectToMongoDB();
        this.createdServer();
        this.createRoutes();
        this.errorhandler();

    }
    configApplication(){
        this.#app.use(cors())
        this.#app.use(morgan("dev"));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(express.static(path.join(__dirname, "..", "public")));
        this.#app.use(
            "/api-doc",
            swaggerUI.serve,
            swaggerUI.setup(
              swaggerJsDoc({
                swaggerDefinition: {
                  openapi: "3.0.0",
                  info: {
                    title: " Store",
                    version: "2.0.0",
                    description:"shop mehrdad",
                    contact: {
                      name: "mehrdad ",
                      url: "https://freerealapi.com",
                      email: "mehrdadsadeghi769@gmail.com",
                    },
                  },
                  servers: [
                    {
                      url: "http://localhost:3002",
                    }
                  ],
                  components : {
                    securitySchemes : {
                      BearerAuth : {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        
                      }
                    }
                  },
                  security : [{BearerAuth : [] }]
                },
                apis: ["./app/routers/**/*.js"],
              }),
              {explorer: true},
            )
          );
    }
    async createInitServer(){
      try {
        initRedis();
      } catch (error) {
        console.error(error);
      }
    }
    async createdServer(){
        const server=http.createServer(this.#app);
        server.listen(this.#PORT,()=>{
            console.log(`\n server run on port http://localhost:${this.#PORT}`);
 
        });
    }

    connectToMongoDB(){

        try {
            mongoose.connect(this.#DB_URL).then(result=>{
                console.log('connection to mongodb Atlas ');
            
            });
            mongoose.connection.on("connected", () => {
                console.log("mongoose connected to DB");
              });
    
              mongoose.connection.on("disconnected", () => {
                console.log("mongoose connection is disconnected");
              });
            
        } catch (error) {
            console.log("connect in mongodb is failure ",error);
            
        }
    }
    initClientSession(){
      this.#app.use(cookieParser(COOKIE_PARSER_SECRET_KEY))
      this.#app.use(session({
        secret: COOKIE_PARSER_SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        cookie: {
          secure: true
        }
      }))
    }
    errorhandler(){

        this.#app.use((req,res,next)=>{
            return res.status(404).json({
                status:404,
                success:false,
                message:" page not found"
            })
            
        });
        this.#app.use((err,req,res,next)=>{
            const status=err?.error||500;
            const message=err?.message|| "Internal  Server Error";

            return res.status(status).json({
                status:status,
                success:false,
                message:message
            })
            
        });    
    }
    createRoutes(){
        this.#app.use(AllRouters);

    }




}


