const gamesList = document.getElementById('gamesList')

async function fetchAPI() {
    const res = await fetch('https://lichess.org/api/broadcast/fide-candidates-2026-open/round-13/rFG1W5Tp')
    const data = await res.json()
    return data.games
}

function parseTime(ms) {
    const totalSeconds = Math.floor(ms/1000)
    const minutes = Math.floor(totalSeconds/60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function evalToPercent(score) {
  const numeric = parseFloat(score)
  const clamped = Math.max(-5, Math.min(5, numeric))

  return 50 + (clamped / 5) * 50
}

function renderGames(games) {
    gamesList.innerHTML = ''

    for (let i = 0; i < games.length; i++) {
        const game = games[i]
        const white = game.players[0]
        const black = game.players[1]

        const card = document.createElement('div')
        card.classList.add('game')
        card.innerHTML = `
            <div class="eval-bar">
                <div class="eval-fill"></div>
            </div>
            <div class="game-info">
                <div class="player">
                    ♚ ${black.name} (${parseTime(black.clock)})
                </div>
                <div class="player">
                    ♔ ${white.name} (${parseTime(white.clock)})
                </div>
            </div>
        `
        const fill = card.querySelector('.eval-fill')
        fill.style.height = evalToPercent('3.0') + '%' 
        gamesList.appendChild(card)
    }
}

async function init() {
    const games = await fetchAPI()
    renderGames(games)
}

init()