const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const RpsGame = require('./game.js')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const PORT = 12121
const clientPath = `${__dirname}/../client`

app.use(express.static(clientPath))

app.get('/', (req, res) => {
    res.sendFile(clientPath + '/index.html')
})

let waitingPlayer = null

io.on('connection', (socket) => {

    if (waitingPlayer) {
        // start game 
        new RpsGame(waitingPlayer, socket)
        waitingPlayer = null
    } else {
        waitingPlayer = socket
        waitingPlayer.emit('messageFirst', 'Waiting for on opponent!')
    }

    socket.on('messageFirst', text => {
        io.emit('messageFirst', text)
    })

    socket.on('message', text => {
        io.emit('message', text)
    })

    socket.on('messageGame', text => {
        io.emit('messageGame', text)
    })

    socket.on('userConnected', (name) => {
        let newUser = name
        console.log(`${newUser} connected`)

        socket.on('disconnect', () => {
            console.log(`${newUser} Disconnected`)
            io.emit(`disconnected`, `${newUser} Disconnected`)
            let user = {
                name: name,
                msg: 'Leave the room!'
            }
        })
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

server.on('error', (err) => {
    console.log('Server error : ', err)
})