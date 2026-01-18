import { timeStamp } from "console";
import http from "http"

type HTTPmethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface Request extends http.IncomingMessage {
    body?: any;
    params?: Record<string, string>;
    query?: Record<string, string>;
}

interface Response extends http.ServerResponse {
    json: (data: any) => void;
    status: (code: number) => Response;
    send: (data: string) => void;
}

type Handler = (req: Request, res: Response) => void | Promise<void>;
type MiddleWare = (req: Request, res: Response, next: () => void) => void | Promise<void>;

interface Route {
    method: HTTPmethod,
    pattern: RegExp,
    paramNames: string[],
    handler: Handler
}

class Router {
    private routes: Route[] = [];
    private middlewares: MiddleWare[] = [];

    use(middleware: MiddleWare) {
        this.middlewares.push(middleware)
    }

    private addRoute(method: HTTPmethod, path: String, handler: Handler) {
        const { pattern, paramNames } = this.pathToRegex(path)
        this.routes.push({ method, pattern, paramNames, handler })
    }

    get(path: String, handler: Handler) {
        this.addRoute("GET", path, handler)
    }

    post(path: String, handler: Handler) {
        this.addRoute("POST", path, handler)
    }

    put(path: String, handler: Handler) {
        this.addRoute("PUT", path, handler)
    }

    delete(path: String, handler: Handler) {
        this.addRoute("DELETE", path, handler)
    }

    patch(path: String, handler: Handler) {
        this.addRoute("PATCH", path, handler)
    }

    private pathToRegex(path: String): { pattern: RegExp, paramNames: string[] } {
        const _paramNames: string[] = []
        const pattern = path
            .replace(/\//g, "\\/")
            .replace(/:([^\/]+)/g, (_, paramName) => {
                _paramNames.push(paramName);
                return "([^\\/]+)";
            });

            return { pattern: new RegExp(`^${pattern}$`), paramNames: _paramNames };    
    }   
    
    private parseQuery(url : String) : Record <string, string>{
        const queryString = url.split("?")[1]
        if(!queryString) return {}

        return queryString.split("&").reduce((acc, pair)=>{
            const [key, value] = pair.split("=")
            acc[decodeURIComponent(key)] = decodeURIComponent(value || " ")
            return acc
        }, {} as Record <string, string>);
    } 

    async handle(req : Request, res : Response){
        res.json =  (data : any) =>{
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data))
        }

        res.status = (code : number) =>{
            res.statusCode = code;
            return res;
        }

        res.send = (data : string) =>{
            res.end(data);
        };
    }
}

function jsonParser(): MiddleWare {
    return (req, res, next) => {
        if (req.method === "POST" || "PUT" || "PATCH") {
            let body = ""
            req.on("data", (chunk) => {
                body += chunk.toString()
            })
            req.on("end", () => {
                try{
                    req.body = body ? JSON.parse(body) : {}
                }catch(err){
                    req.body = {}
                }
            })
            next()
        }else{
            next()
        }
    };
}

function logger(): MiddleWare {
    return (req, res, next) => {
       const start = Date.now();
       res.on("finish", () =>{
            const duration = Date.now()-start;
            console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
       });
       next()
    } 
}

const router = new Router()
router.use(logger())
router.use(jsonParser())

router.get("/", (req, res)=>{
    res.json({ 
        message : "hey i am Bipanshu, custom http server works well!"
    })
})

router.get("/users/:id", (req, res)=>{
    res.json({
        userId : req.params?.id,
        query : req.query
    })
})

router.post("/users", (req, res)=>{
    res.status(201).json({
        message : "user created",
        data : req.body
    })
})

router.get("/status", (req, res)=>{
    res.status(200).json({
        status : "ok",
        timestamp : new Date().toISOString()
    })
})

const httpServer = http.createServer((req, res) => {
    router.handle(req as Request, res as Response)
})

const PORT = 8080
httpServer.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("\nAvailable routes:");
    console.log("  GET  /");
    console.log("  GET  /users/:id");
    console.log("  POST /users");
    console.log("  GET  /status");
})