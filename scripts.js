// game object (module)
const game = (() => {
	const getGameData = () => JSON.parse(localStorage.getItem('tttGameData'));
	const saveGameData = (data) => localStorage.setItem('tttGameData', JSON.stringify(data));
	const _startGame = (e) => {
		const formData = new FormData(e.target);
		const gameData = {
			p1: formData.get('p1'),
			p2: formData.get('p1') === 'x' ? 'o' : 'x',
			rounds: [
				{
					id: 1,
					result: null
				}
			],
			board: [null, null, null, null, null, null, null, null, null],
			currentPlayer: 'x'
		}
		saveGameData(gameData);
	}
	const newGame = () => {
		localStorage.removeItem('tttGameData');
		location.href = '/';
	}
	const _newGameDialog = (e) => {
		let dialog;
		if (e.target.nodeName !== 'BUTTON') {
			const dialogButton = e.target.closest('button');
			dialog = document.getElementById(dialogButton.dataset.modal);
		} else {
			dialog = document.getElementById(e.target.dataset.modal);
		}
		dialog.showModal();
		dialog.querySelector('.btn-restart').addEventListener('click', newGame);
	}
	const newRound = () => {
		const nextRound = Round();
		nextRound.addRound();
		_renderScores();
	}
	const _renderScores = () => {
		const gameData = getGameData();
		document.getElementById('score-x').textContent = gameData.p1;
		document.getElementById('score-o').textContent = gameData.p2;
		if (gameData.rounds.length > 0) {
			let roundX = 0;
			let roundO = 0;
			let roundTie = 0;
			gameData.rounds.forEach(round => {
				if (round.result === 'x') {
					roundX += 1;
				}
				if (round.result === 'o') {
					roundO += 1;
				}
				if (round.result === 'tie') {
					roundTie += 1;
				}
			})
			document.querySelector('.score-x b').textContent = roundX;
			document.querySelector('.score-o b').textContent = roundO;
			document.querySelector('.score-tie b').textContent = roundTie;
		} else {
			document.querySelector('.score-x b').textContent = '0';
			document.querySelector('.score-o b').textContent = '0';
			document.querySelector('.score-tie b').textContent = '0';
		}
	}
	// do on load:
	if (location.pathname === '/' || location.pathname === '/odin-tictactoe/') {
		document.querySelector('form.new').addEventListener('submit', _startGame);
	} else {
		_renderScores();
		document.querySelector('button[data-modal="dialog-restart"]').addEventListener('click', _newGameDialog);
		document.querySelector('button.btn-restart').addEventListener('click', newGame);
	}
	return {getGameData, saveGameData, newGame, newRound};
})();

// round object (factory)
const Round = () => {
	const addRound = () => {
		let gameData = game.getGameData();
		const newId = gameData.rounds[gameData.rounds.length - 1].id + 1;
		const round = {
			id: newId,
			result: null
		}
		gameData.rounds.push(round);
		gameData.board = [null, null, null, null, null, null, null, null, null];
		gameData.currentPlayer = 'x';
		game.saveGameData(gameData);
		const gridButtons = document.querySelectorAll('.board button');
		gridButtons.forEach(grid => {
			grid.removeAttribute('data-selected');
		})
		document.querySelector('body').dataset.current = 'x';
	};
	return {addRound};
};

// gameboard object (module)
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
