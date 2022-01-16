const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)


app.use(express.static(path.join(__dirname, 'public')))
let users=[]
let sockets = []
const io = require('socket.io')(http)
io.on('connection', socket => {
    console.log('Connected Ready')
    socket.emit("listUsers",users)
    socket.on("adduser",msg=>{
        users.push(msg)
        sockets.push(socket)
        console.log(users)
        socket.broadcast.emit('newuser' , msg)
    })
    socket.on('sendMessage',msg=>{
        sockets[users.indexOf(msg["userRec"])].emit('sendToAll' , msg);
    })
    socket.on('disconnect', function() {
        const n=sockets.indexOf(socket)
        if (n>=0){
            sockets.splice(n,1)
            socket.broadcast.emit('utilisateurdeconnecte' , users[n])
            users.splice(n,1)
            }
    })
    
})

const PORT = process.env.PORT || 3000

http.listen (PORT, () => {console.log('Server running on port', PORT)})