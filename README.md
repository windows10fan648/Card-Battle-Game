# Card Battle Game

A rea-time multiplayer card battle game built with Node.js and Socket.io. Players can connect, draw cards, and engage in turn-based battles using different card effects such as attacks, healing, and defense.

## Features

- **Multiplayer**: Play against another player in real-time
- **Card Effects**: Use attack, heal, and defend cards to battle your opponent.
- **Game State**: Displays player HP, current turn, and card actions.
- **Real-Time Updates**: Update instantly when players take their turns using Socket.io.

## Tech Stack

- **Backend**: Node.js with Socket.io for real-time communication.
- **Frontend**: HTML, CSS, and JavaScript for the game interface
- **Game Logic**: Custom logic for card mechanics, player stats, and game flow.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your system.
- NPM (Node Package Manager) should come with Node.js.

### Clone the repository

```bash
git clone https://github.com/windows10fan648/Card-Battle-Game.git
cd Card-Battle-Game
```

### Install Dependencies

Run the following command to install all neccessary dependencies:
```bash
npm install
```

### Start the Server

Start the game server by running:
```bash
node server.js
```
The server will run on ``http://localhost:3000``

### Access the Game

Open a browser and navigate to ``http://localhost:3000`` to play the game.

You can open multiple tabs or different browsers to simulate multiple players.

### How It Works

1. Join the Game: Players enter the game with a default username or can customize it (in future updates).
2. Game Start: The server matches two players and noticies them when the game begins.
3. Gameplay:
    Players take turns drawing cards from their deck.
    Each card can have effects like attacking, healing, or defending.
    The game updates player health and turns in real-time
4. End of Game: The game ends when one player's HP reaches zero, and the winner is declared.

### Roadmap

- [] Add customization
- [] Add more complex card effects (e.g., buffs, debuffs, special moves).
- [] Implement player matchmaking and lobbies.
- [] Add timer for card plays.
- [] Enhance UI with card images and animations.

### Contributions

Feel free to fork this project, open issues, and submit pull requests for any improvements!

### License

This project is open source and available under the MIT License.

### Explanation of Sections:

1. **Features**: Provides a quick overview of the core game mechanics.
2. **Tech Stack**: Details the technology used to build the game.
3. **Installation**: Includes instructions for cloning the repository, installing dependencies, and running the server.
4. **How It Works**: Explains the flow of the game.
5. **Roadmap**: Lists the features and improvements you plan to add.
6. **Contributions**: Encourages others to contribute to the project.
7. **License**: Indicates the license under which the project is shared.
