const socket = io();

// Listen for a connection to the game and set up the initial game state
socket.on('connect', () => {
    console.log('Connected to the server');
    // Join the game with a default username
    socket.emit('joinGame', 'Player1');
});

// Listen for when the game starts
socket.on('gameStarted', (gameId) => {
    document.getElementById('game-status').textContent = `${data.player1} vs ${data.player2}`;
});

// Listen for game updates
socket.on('gameUpdate', (gameState) => {
    document.getElementById('player1-hp').textContent = `Player 1 HP: ${gameState.player1HP}`;
    document.getElementById('player2-hp').textContent = `Player 2 HP: ${gameState.player2HP}`;
    document.getElementById('game-status').textContent = `Current Turn: ${gameState.currentTurn}`;
});

// Listen for card plays and update the UI
socket.on('cardPlayed', (cardData) => {
    alert(`${cardData.player} played a ${cardData.card} card!`);
});

// Handle drawing a card
document.getElementById('draw-card').addEventListener('click', () => {
    // Example of drawing a card
    const card = { type: 'attack', value: 5 };
    socket.emit('playCard', card);
});
