const express = require("express");
const swaggerUi = require('swagger-ui-express');
const cors = require("cors");
const path = require("path");
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const useragent = require('useragent');
const DeviceDetector = require('node-device-detector');
const DeviceHelper = require('node-device-detector/helper');
const http = require('http');

const app = express();
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);
const userRouter = require("./routes/routes");
const categoryRouter = require("./routes/expenseRoutes");
const jwt = require("jsonwebtoken");
const iplocation = require('iplocation').default;
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.use(requestIp.mw());


io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('audio-stream', (audioTrack) => {
        console.log(`Received audio stream from client: ${socket.id}`);
        socket.broadcast.emit('audio-stream', audioTrack);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// app.get('/loginActivity', (req, res) => {
//     iplocation(`182.68.7.191`)
//         .then((res) => {
//             console.log(res);
//         })
//         .catch((err) => {
//             console.error(err);
//         });
//     // http.get('http://api.ipify.org', (res) => {
//     //     let data = '';
//     //     res.on('data', (chunk) => {
//     //         data += chunk;
//     //     });
//     //     res.on('end', () => {
//     //         console.log(`Public IP address: ${data}`);

//     //     });
//     //     // res.send(data);
//     // }).on('error', (err) => {
//     //     console.error(`Error getting public IP address: ${err}`);
//     // });
//     // const ipAddress = req.socket.remoteAddress;
//     // console.log(ipAddress, "111");
//     // res.send(ipAddress);
//     // console.log(req.headers);
//     // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     // const agent = useragent.parse(req.headers['user-agent']);
//     // console.log(req.headers);

//     // console.log(`IP Address: ${ip}`);
//     // console.log(`Browser: ${agent.toString()}`);
//     // console.log(`Device Name: ${agent.device.family}`);
//     // console.log(`Operating System: ${agent.os.family}`);



// });
// app.get("/", (req, res) =>
// {console.log("server stareddddd");
//   res.json({ success: true, message: "server is running!" })}
// );
app.use(express.static(path.join(__dirname + "/public")));
app.all('/login', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
app.all('/expenses', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
app.all('/monthly', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
app.use("/api", userRouter);
app.use("/api", categoryRouter);

module.exports = app;
