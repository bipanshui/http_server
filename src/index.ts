import http from "http"

type HTTPmethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface Request extends http.IncomingMessage{
    body? : any;
    params? : Record<string, string>;
    query? : Record<string, string>;
}

interface Response extends http.ServerResponse{
    json : (data : any) => void;
    status : (code : number) => Response; //doubt here that why Response
    send : (data : string) => void;
}

type Handler = (req : Request, res : Response) => void | Promise<void>; //doubt about Promise
type MiddleWare = (req : Request, res :Response, next : ()=> void) => void | Promise<void>;

interface Route{
    method : HTTPmethod,
    pattern : RegExp,
    paramNames : string[],
    
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