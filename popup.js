const gamesList = document.getElementById('gamesList')

async function fetchAPI() {
    const res = await fetch('https://lichess.org/api/broadcast/fide-candidates-2026-open/round-13/o7DgltDn')
    const data = await res.json()
    return data.games
}

async function fetchEval(fen) {
    const res = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}`)
    const data = await res.json()

    if (!data.pvs || data.pvs.length === 0) return null

    const evalData = data.pvs[0]

    if (evalData.mate) {
        return evalData.mate > 0 ? 5 : -5
    }

    return evalData.cp / 100
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
                    ♔ ${black.name} (${parseTime(black.clock)})
                </div>
                <div class="player">
                    ♚ ${white.name} (${parseTime(white.clock)})
                </div>
            </div>

            <div class="eval-text">---</div>
        `
        const fill = card.querySelector('.eval-fill')
        const evalText = card.querySelector('.eval-text')
        
        fill.style.height = evalToPercent('0') + '%' 

        fetchEval(game.fen).then(score => {
            if (score !== null) {
                fill.style.height = evalToPercent(score) + '%'

                if (Math.abs(score) === 5) {
                    evalText.textContent = score > 0 ? 'M' : '-M'
                } else {
                    const formatted = score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)
                    evalText.textContent = formatted
                }
            }
        })

        gamesList.appendChild(card)
    }
}

async function fetchBroadcasts() {
    const res = await fetch('https://lichess.org/api/broadcast/top?page=1')
    const data = await res.json()
    return data.active
}

async function renderBroadcasts() {
    const broadcasts = await fetchBroadcasts()
    const select = document.getElementById('tournamentSelect')

    for (let i = 0; i < broadcasts.length; i++) {
        const b = broadcasts[i]

        if (!b.round) continue

        const option = document.createElement('option')

        option.value = JSON.stringify({
            tour: b.tour.slug,
            round: b.round.slug,
            id: b.round.id
        })

        option.textContent = b.tour.name

        select.appendChild(option)
    }
}

async function init() {
    renderBroadcasts()
    const games = await fetchAPI()
    renderGames(games)
}

init()