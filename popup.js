const gamesList = document.getElementById('gamesList')

async function fetchAPI({tour, round, id}) {
    const res = await fetch(`https://lichess.org/api/broadcast/${tour}/${round}/${id}`)
    const data = await res.json()
    return data.games
}

async function fetchEval(fen) {
    try {
        const res = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}`)
        const data = await res.json()
        if (!data.pvs || data.pvs.length === 0) return null
        const evalData = data.pvs[0]
        if (evalData.mate) return evalData.mate > 0 ? 5 : -5
        return evalData.cp / 100
    } catch (e) { return null }
}

function parseTime(clockValue) {
    if (clockValue === undefined || clockValue === null) return "N/A"
    let totalSeconds = clockValue / 100
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const pad = (num) => num.toString().padStart(2, '0')
    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
}

function evalToPercent(score) {
    const numeric = parseFloat(score)
    const clamped = Math.max(-5, Math.min(5, numeric))
    return 50 + (clamped / 5) * 50
}

function renderGames(games) {
    gamesList.innerHTML = ''
    games.forEach(game => {
        if (!game.players) return
        const white = game.players[0]
        const black = game.players[1]
        const rawStatus = game.status || ""
        const isFinished = rawStatus !== "*" && rawStatus !== ""
        
        let whiteResult = "", blackResult = ""
        if (isFinished) {
            if (rawStatus === "1-0") whiteResult = "1"
            else if (rawStatus === "0-1") blackResult = "1"
            else if (rawStatus === "1/2-1/2" || rawStatus === "1/2" || rawStatus === "½-½") {
                whiteResult = "½"; blackResult = "½"
            } else { whiteResult = rawStatus }
        }

        const card = document.createElement('div')
        card.classList.add('game')
        if (isFinished) card.classList.add('finished')

        card.innerHTML = `
            <div class="eval-bar"><div class="eval-fill"></div></div>
            <div class="game-info">
                <div class="player-line">
                    <span class="name">♔ ${black.name || "Black"}</span>
                    <span class="clock-area">${isFinished ? `<span class="score">${blackResult}</span>` : parseTime(black.clock)}</span>
                </div>
                <div class="player-line">
                    <span class="name">♚ ${white.name || "White"}</span>
                    <span class="clock-area">${isFinished ? `<span class="score">${whiteResult}</span>` : parseTime(white.clock)}</span>
                </div>
            </div>
            <div class="eval-text">---</div>
        `
        const fill = card.querySelector('.eval-fill')
        const evalText = card.querySelector('.eval-text')
        
        if (isFinished) {
            if (whiteResult === '1') fill.style.height = '100%'
            else if (blackResult === '1') fill.style.height = '0%'
            else fill.style.height = '50%'
            evalText.textContent = "FIN"
        } else {
            fill.style.height = '50%'
            fetchEval(game.fen).then(score => {
                if (score !== null) {
                    fill.style.height = evalToPercent(score) + '%'
                    evalText.textContent = score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)
                }
            })
        }
        gamesList.appendChild(card)
    })
}

async function fetchBroadcasts() {
    const res = await fetch('https://lichess.org/api/broadcast/top?page=1')
    const data = await res.json()
    return data.active
}

async function renderBroadcasts() {
    const broadcasts = await fetchBroadcasts()
    const select = document.getElementById('tournamentSelect')
    select.innerHTML = ''

    broadcasts.forEach(b => {
        if (b.round) {
            const option = document.createElement('option')
            const broadcastData = {
                tour: b.tour.slug,
                round: b.round.slug,
                id: b.round.id
            }
            option.value = JSON.stringify(broadcastData)
            option.textContent = b.tour.name
            select.appendChild(option)
        }
    })
}

async function init() {
    await renderBroadcasts()
    const select = document.getElementById('tournamentSelect')

    chrome.storage.local.get(['lastTournament'], async (result) => {
        let tournamentToLoad = null

        if (result.lastTournament) {
            const savedDataString = JSON.stringify(result.lastTournament)
            for (let option of select.options) {
                if (option.value === savedDataString) {
                    select.value = option.value
                    tournamentToLoad = result.lastTournament
                    break
                }
            }
        }

        if (!tournamentToLoad && select.options.length > 0) {
            tournamentToLoad = JSON.parse(select.options[0].value)
            select.selectedIndex = 0
        }

        if (tournamentToLoad) {
            const games = await fetchAPI(tournamentToLoad)
            renderGames(games)
        }
    })

    // Listener para mudanças manuais
    select.addEventListener('change', async (e) => {
        const selectedData = JSON.parse(e.target.value)
        chrome.storage.local.set({ lastTournament: selectedData })
        const games = await fetchAPI(selectedData)
        renderGames(games)
    })
}

init()