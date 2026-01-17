import http from "http"

type HTTPmethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface Request extends http.IncomingMessage{

}

interface Response extends http.ServerResponse{

}

type Handler = (req : Request, res : Response) => void | Promise<void>;
type MiddleWare = (req : Request, res :Response, next : ()=> void) => void | Promise<void>;

interface Route{

}

class Router{

}

function jsonParser() : MiddleWare{

}

function logger() : MiddleWare{
    
}

const router = new Router()

const httpServer = http.createServer((req , res )=>{

})

httpServer.listen(8080, ()=>console.log(`server listening at ${8080}`))