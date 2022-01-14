class RpsGame {
    constructor(p1, p2) {
        this._players = [p1, p2]
        this._score = [0, 0]
        this._turns = [null, null]
        this._checkSelect = 0

        this._sendToPlayers('--------Game start!-------')

        this._players.forEach((player, idx) => {
            player.on('turn', turn => {
                this._onTurn(idx, turn)
            })
        })
    }

    _sendToPlayer(playerIndex, msg) {
        this._players[playerIndex].emit('messageGame', msg)
    }

    _sendToPlayers(msg) {
        this._players.forEach(player => player.emit('messageGame', msg))
    }

    _onTurn(playerIndex, turn) {
        this._turns[playerIndex] = turn
        this._sendToPlayer(playerIndex, `You selected ${turn.substring(4)}`)

        this._checkGameOver(playerIndex)
    }

    _checkGameOver(playerIndex) {
        let turns = this._turns

        if (turns[0] && turns[1]) {
            this._getGameResult()
            this._sendToPlayers(`Result => ${turns[0].substring(4)} : ${turns[1].substring(4)}`)
            this._turns = [null, null]
            this._checkSelect = 0

            if (playerIndex === 0) {
                this._sendToPlayer(playerIndex, `Your score is ${this._score[playerIndex]} 
                        : Opponent score is ${this._score[1]}`)
                this._sendToPlayer(1, `Your score is ${this._score[1]} 
                        : Opponent score is ${this._score[playerIndex]}`)
            } else if (playerIndex === 1) {
                this._sendToPlayer(playerIndex, `Your score is ${this._score[playerIndex]} 
                        : Opponent score is ${this._score[0]}`)
                this._sendToPlayer(0, `Your score is ${this._score[0]} 
                        : Opponent score is ${this._score[playerIndex]}`)
            }
            this._sendToPlayers('--------Next Round!!-------')
        } else if ((turns[0] || turns[1]) && this._checkSelect === 0) {
            if (playerIndex === 0) {
                this._sendToPlayer(1, `Opponent selected`)
            } else if (playerIndex === 1) {
                this._sendToPlayer(0, `Opponent selected`)
            }
            this._checkSelect = 1
        }
    }

    _getGameResult() {
        const p0 = this._decodeTurn(this._turns[0])
        const p1 = this._decodeTurn(this._turns[1])

        const distance = (p1 - p0 + 3) % 3

        switch (distance) {
            case 0:
                this._sendToPlayers('Draw!')
                break
            case 1:
                this._sendWinMessage(this._players[0], this._players[1])
                this._score[0] += 1
                break
            case 2:
                this._sendWinMessage(this._players[1], this._players[0])
                this._score[1] += 1
                break
        }
    }

    _sendWinMessage(winner, loser) {
        winner.emit('messageGame', 'You won!')
        loser.emit('messageGame', 'You lost!')
    }

    _decodeTurn(turn) {
        switch (turn) {
            case 'btn-rock':
                return 0;
            case 'btn-scissors':
                return 1;
            case 'btn-paper':
                return 2;
            default:
                throw new Error(`Could not decode turn ${turn}`)
        }
    }
}

module.exports = RpsGame