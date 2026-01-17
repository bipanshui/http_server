import http from "http"
 

const httpServer = http.createServer((req , res )=>{

})

httpServer.listen(8080, ()=>console.log(`server listening at ${8080}`))