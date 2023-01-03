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
