const game = (() => {
	const getGameData = () => JSON.parse(localStorage.getItem('tttGameData'));
	const saveGameData = (data) => localStorage.setItem('tttGameData', JSON.stringify(data));
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

	// bind events
	document.querySelector('button[data-modal="dialog-restart"]').addEventListener('click', _newGameDialog);
	document.querySelector('button.btn-restart').addEventListener('click', newGame);

	// do on load
	_renderScores();

	return {getGameData, saveGameData, newGame, newRound};

})();