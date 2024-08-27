import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

let speed= 0
let angle= 0
let offset= 0
let users=0
io.on("connection", (socket) => {
    users++
    io.emit('get_users', users)
    socket.on('set_speed', (data) => {
      console.log(data, 'DATA')
      speed=data
      io.emit('get_speed', data)
    })  
    socket.on('set_angle', (data) => {
      console.log(data, 'DATA')
      angle=data
      io.emit('get_angle', data)
    })  
    socket.on('set_offset', (data) => {
      console.log(data, 'DATA')
      offset=data
      io.emit('get_offset', data)
    })  
    socket.on('broadcast_speed',function(){ 
      io.emit('get_speed', speed)
    });
    socket.on('broadcast_angle',function(){ 
      io.emit('get_angle', angle)
    });
    socket.on('broadcast_offset',function(){ 
      io.emit('get_offset', offset)
    });
    socket.on('disconnect', () => { 
        users=users-1
        io.emit('get_users', users)

    });

  });



app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});