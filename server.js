const server = require("http").createServer();
const io = require("socket.io")(server);
let players = ["X", "O"];
let i = 0;
io.on("connection", (client) => {
    console.log(`Connected Client Socket Id  : ${client.id}`);
    // only two player allow to play the game
    if (i > 1) {
        client.emit("msg", "no more player is allowed");
        client.disconnect(true);
        return;
    }
    client.player = players[i];
    i++;
    client.on("msg", (data) => {
        processInput(data, client);
    });

    client.on("disconnect", (args) => {
        console.log("disconnect", args);
    });
    client.emit(
        "msg",
        `Game Started. You Are The ${
      client.player === "X" ? "First" : "Second"
    } Player\nPlease Select number between 1-9`
    );
});
server.listen(5050, () => {
    console.log("server running on port 5050");
});

let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function processInput(data, client) {
    if (data == "r") {
        // which player has entered r who lost the game and the other wins the game
        resetGame();
        return io.emit(
            "msg",
            `Player ${
        client.player === "X" ? "First" : "Second"
      } Resign Game. \n\n Player ${
        client.player === "X" ? "Second" : "First"
      } Won The Game`
        );
    }
    let num = parseInt(data);
    let i = board.indexOf(num);
    if (i === -1) {
        return client.emit("msg", "Wrong Position");
    }
    board[i] = client.player;
    let b = getBoard();
    io.emit("msg", b);
    if (checkForSuccess()) {
        io.emit(
            "msg",
            `Player ${client.player === "X" ? "First" : "Second"} Won The Game`
        );
        resetGame()
    }
}

function checkForSuccess() {
    // conditions for wins
    let successIndex = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < successIndex.length; i++) {
        if (
            board[successIndex[i][0]] == board[successIndex[i][1]] &&
            board[successIndex[i][1]] == board[successIndex[i][2]]
        ) {
            return true;
        }
    }
    return false;
}

function getBoard() {

    let s = board.map((e) => (isNaN(e) ? e : "."));
    let x = [s.slice(0, 3), s.slice(3, 6), s.slice(6, 9)];
    return x.join("\n");
}

function resetGame() {
    i = 0;
    board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}