const board = (() => {
	const _evalBoard = (data) => {
		const allMarks = data.board.filter(grid => grid !== null);
		if (allMarks.length >= 3) {
			if (
				(data.board[0] === data.currentPlayer && data.board[1] === data.currentPlayer && data.board[2] === data.currentPlayer) ||
				(data.board[3] === data.currentPlayer && data.board[4] === data.currentPlayer && data.board[5] === data.currentPlayer) ||
				(data.board[6] === data.currentPlayer && data.board[7] === data.currentPlayer && data.board[8] === data.currentPlayer) ||
				(data.board[0] === data.currentPlayer && data.board[3] === data.currentPlayer && data.board[6] === data.currentPlayer) ||
				(data.board[1] === data.currentPlayer && data.board[4] === data.currentPlayer && data.board[7] === data.currentPlayer) ||
				(data.board[2] === data.currentPlayer && data.board[5] === data.currentPlayer && data.board[8] === data.currentPlayer) ||
				(data.board[0] === data.currentPlayer && data.board[4] === data.currentPlayer && data.board[8] === data.currentPlayer) ||
				(data.board[2] === data.currentPlayer && data.board[4] === data.currentPlayer && data.board[6] === data.currentPlayer)
			) {
				_win(data.currentPlayer);
			} else if (allMarks.length === 9) {
				_tie();
			}
		}
	}
	const _win = (player) => {
		let gameData = game.getGameData();
		gameData.rounds[gameData.rounds.length - 1].result = player;
		game.saveGameData(gameData);
		_winDialog();
		return;
	}
	const _winDialog = () => {
		const gameData = game.getGameData();
		const dialog = document.getElementById('dialog-win');
		dialog.querySelector('.player').textContent = gameData.currentPlayer;
		dialog.querySelector('.btn-quit').addEventListener('click', game.newGame);
		dialog.querySelector('.btn-next').addEventListener('click', game.newRound);
		dialog.showModal();
	}
	const _tie = () => {
		let gameData = game.getGameData();
		gameData.rounds[gameData.rounds.length - 1].result = 'tie';
		game.saveGameData(gameData);
		_tieDialog();
		return;
	}
	const _tieDialog = () => {
		const dialog = document.getElementById('dialog-tie');
		dialog.querySelector('.btn-quit').addEventListener('click', game.newGame);
		dialog.querySelector('.btn-next').addEventListener('click', game.newRound);
		dialog.showModal();
	}
	const _setCurrentPlayer = (player) => {
		const currentTarget = document.querySelector('body');
		let gameData = game.getGameData();
		if (player) {
			currentTarget.dataset.current = player;
			gameData.currentPlayer = player;
			game.saveGameData(gameData);
		} else {
			currentTarget.dataset.current = gameData.currentPlayer;
		}
	}
	const _mark = (grid) => {
		let gameData = game.getGameData();
		if (gameData.board[grid - 1] === null) {
			gameData.board[grid - 1] = gameData.currentPlayer;
			game.saveGameData(gameData);
			_evalBoard(gameData);
			gameData.currentPlayer === 'x' ? _setCurrentPlayer('o') : _setCurrentPlayer('x');
		}
	}
	const _addMarks = () => {
		document.querySelectorAll('.board button').forEach(btn => {
			btn.addEventListener('click', (e) => {
				_mark(e.target.dataset.grid);
				_renderBoard();
			});
		})
	}
	const _renderBoard = () => {
		const boardData = game.getGameData().board;
		const gridButtons = document.querySelectorAll('.board button');
		for (let i = 0; i < boardData.length; i++) {
			const grid = boardData[i];
			if (grid !== null) {
				gridButtons[i].dataset.selected = grid;
			}
		}
	}
	// run on load:
	if (location.pathname === '/board.html' || location.pathname === '/odin-tictactoe/board.html') {
		_renderBoard();
		_addMarks();
		_setCurrentPlayer();
	}
})()