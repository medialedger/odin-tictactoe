// game object (module)
const start = (() => {
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
		localStorage.setItem('tttGameData', JSON.stringify(gameData))
	}
	// bind events
	document.querySelector('form.new').addEventListener('submit', _startGame);
})();