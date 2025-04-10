const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Player and game state management
let players = {}; // {playerId: {socketId, username, deck, hp, gameId}}
let games = {}; // {gameId: {player1: playerId, player2: playerId, state: 'waiting', currentTurn: playerId, player1HP, player2HP}}

// Serve static files
app.use(express.static('public'));

// Listen for new connections
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Handle player joining a game
    socket.on('joinGame', (username) => {
        const playerId = socket.id;
        players[playerId] = {
            socketId: socket.id,
            username: username,
            deck: generateDeck(),
            hp: 20,
            gameId: null
        };

        // Try to match players in a game
        matchPlayer(playerId);
    });

    // Handle card plays
    socket.on('playCard', (card) => {
        const playerId = socket.id;
        const gameId = players[playerId].gameId;
        
        if (!gameId) {
            console.log('Player ${playerId} not in a game:', playerId);
            return;
        }

        const game = games[gameId];
        const currentPlayer = game[playerId === game.player1 ? 'player1' : 'player2'];

        if (currentPlayer !== game.currentTurn) {
            return socket.emit('error', 'It\'s not your turn!');
        }

        // Process the card action
        const opponentId = playerId === game.player1 ? game.player2 : game.player1;
        processCardAction(card, playerId, opponentId, game);

        // Update game state and notify players
        updateGameState(gameId, game);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
        const playerId = socket.id;
        console.log('Player ${playerId} disconnected.');

        // Remote player from game
        if (players[playerId].gameId) {
            const gameId = players[playerId].gameId;
            const game = games[gameId];
            if (game.state === 'waiting') {
                delete games[gameId];
            } else {
                // Handle disconnection mid-game
                const opponentId = game.player1 === playerId ? game.player2 : game.player1;
                io.to(opponentId).emit('gameOver', 'Your opponent has disconnected!');
                delete games[gameId];
            }
        }

        delete players[playerId];
    });
});

// Function to generate a deck for the player (for example purposes, using simple cards)
function generateDeck() {
    return [
        { type: 'attack', value: 5 },
        { type: 'defend', value: 3 },
        { type: 'heal', value: 4 },
        { type: 'special', value: 2 },
    ];
}

// Function to match players into a game
function matchPlayer(playerId) {
    const player = players[playerId];

    for (let gameId in games) {
        const games = games[gameId];

        if (game.state === 'waiting' && games.player1 !== playerId && games.player2 === null) {
            // Found an open game, add the player to this game
            games.player2 = playerId;
            games.state = 'in-progress';
            player.gameId = gameId;
            players[playerId].gameId = gameId;

            io.to(games.player1).emit('gameStarted', { player2: player.username });
            io.to(playerId).emit('gameStarted', { player1: players[games.player1].username });
            updateGameState(gameId, games);
            return;
        }
    }

    // No game found, create a new one
    const newGameId = `game-${Date.now()}`;
    games[newGameId] = {
        player1: playerId,
        player2: null,
        state: 'waiting',
        currentTurn: playerId,
        player1HP: 20,
        player2HP: 20
    };

    player.gameId = newGameId;
    io.to(playerId).emit('waitingForOpponent', 'Waiting for an opponent to join...');
}

// Function to process card actions and update game state
function processCardAction(card, playerId, opponentId, game) {
    const cardEffect = card.type;

    if (cardEffect === 'attack') {
        const damage = card.value;
        if (playerId === game.player1) {
            game.playe2HP -= damage;
            io.to(opponentId).emit('cardPlayed', { card, player: players[playerId].username });
        } else {
            game.player1HP -= damage;
            io.to(opponentId).emit('cardPlayed', { card, player: players[playerId].username });
        }
    } else if (cardEffect === 'defend') {
        // Handle defending
        // Implement defense logic here
    } else if (cardEffect === 'heal') {
        // Heal the player
        const healingAmount = card.value;
        if (playerId === game.player1) {
            game.player1HP += healingAmount;
        } else {
            game.player2HP += healingAmount;
        }
    }

    // Check if game is over
    if (game.player1HP <= 0) {
        io.to(game.player1).emit('gameOver', 'You lost!');
        io.to(game.player2).emit('gameOver', 'You won!');
        delete games[game.gameId];
    } else if (game.player2HP <= 0) {
        io.to(game.player2).emit('gameOver', 'You lost!');
        io.to(game.player1).emit('gameOver', 'You won!');
        delete games[game.gameId];
    }

    // Switch turns
    game.currentTurn = game.currentTurn === game.player1 ? game.player2 : game.player1;
}

// Function to send updated game state to both players
function updateGameState(gameId, game) {
    io.to(game.player1).emit('gameStateUpdate', {
        player1HP: game.player1HP,
        player2HP: game.player2HP,
        currentTurn: game.currentTurn
    });
    io.to(game.player2).emit('gameStateUpdate', {
        player1HP: game.player1HP,
        player2HP: game.player2HP,
        currentTurn: game.currentTurn
    });
}

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
