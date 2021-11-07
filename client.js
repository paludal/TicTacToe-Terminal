const { io } = require("socket.io-client");
const socket = io("http://localhost:5050");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });

socket.on("connect", () => {
    readTheInput();
});

socket.on("disconnect", () => {
    console.log("server disconnected");
});

socket.on("msg", (msg) => {
    console.log(msg);
    if (msg.includes('Won The Game') || msg.includes('Resign')) {
        rl.close();
        socket.close();
    }

});

function readTheInput() {
    rl.question("", (answer) => {
        if (answer === "r") {
            socket.emit("msg", answer);
        } else if (isNaN(answer)) {
            console.log("Please Enter Valid Numeric Position");
        } else {
            socket.emit("msg", answer);
        }
        readTheInput();
    });
}