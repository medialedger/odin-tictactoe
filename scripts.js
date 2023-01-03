// game object (module)
const game = (() => {
	const getGameData = () => JSON.parse(localStorage.getItem('tttGameData'));
	const saveGameData = (data) => localStorage.setItem('tttGameData', JSON.stringify(data));
	const startGame = (e) => {
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
	const newGameDialog = (e) => {
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
	const winDialog = () => {
		const gameData = getGameData();
		const dialog = document.getElementById('dialog-win');
		dialog.querySelector('.player').textContent = gameData.currentPlayer;
		dialog.querySelector('.btn-quit').addEventListener('click', newGame);
		dialog.querySelector('.btn-next').addEventListener('click', newRound);
		dialog.showModal();
	}
	const tieDialog = () => {
		const dialog = document.getElementById('dialog-tie');
		dialog.querySelector('.btn-quit').addEventListener('click', newGame);
		dialog.querySelector('.btn-next').addEventListener('click', newRound);
		dialog.showModal();
	}
	const newRound = () => {
		const nextRound = Round();
		nextRound.addRound();
		renderScores();
	}
	const renderScores = () => {
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
	const init = () => {
		if (location.pathname === '/') {
			document.querySelector('form.new').addEventListener('submit', startGame);
		}
		if (location.pathname === '/board.html') {
			renderScores();
			document.querySelector('button[data-modal="dialog-restart"]').addEventListener('click', newGameDialog);
			document.querySelector('button.btn-restart').addEventListener('click', newGame);
		}
	}
	init();
	return {getGameData, saveGameData, winDialog, tieDialog};
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
	const evalBoard = (data) => {
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
				win(data.currentPlayer);
			}
			if (allMarks.length === 9) {
				tie();
			}
		}
	}
	const win = (player) => {
		let gameData = game.getGameData();
		gameData.rounds[gameData.rounds.length - 1].result = player;
		game.saveGameData(gameData);
		game.winDialog();
		return;
	}
	const tie = () => {
		let gameData = game.getGameData();
		gameData.rounds[gameData.rounds.length - 1].result = 'tie';
		game.saveGameData(gameData);
		game.tieDialog();
		return;
	}
	const setCurrentPlayer = (player) => {
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
	const mark = (grid) => {
		let gameData = game.getGameData();
		if (gameData.board[grid - 1] === null) {
			gameData.board[grid - 1] = gameData.currentPlayer;
			game.saveGameData(gameData);
			evalBoard(gameData);
			gameData.currentPlayer === 'x' ? setCurrentPlayer('o') : setCurrentPlayer('x');
		}
	}
	const addMarks = () => {
		document.querySelectorAll('.board button').forEach(btn => {
			btn.addEventListener('click', (e) => {
				mark(e.target.dataset.grid);
				renderBoard();
			});
		})
	}
	const renderBoard = () => {
		const boardData = game.getGameData().board;
		const gridButtons = document.querySelectorAll('.board button');
		for (let i = 0; i < boardData.length; i++) {
			const grid = boardData[i];
			if (grid !== null) {
				gridButtons[i].dataset.selected = grid;
			}
		}
	}
	const init = () => {
		if (location.pathname === '/board.html') {
			renderBoard();
			addMarks();
			setCurrentPlayer();
		}
	}
	init();
})()
