# LiCC - Live Chess Companion
---

A professional, lightweight browser extension designed to track live chess broadcasts from Lichess.org. This extension provides real-time evaluation bars, player clocks, and game results in a compact, dark-themed popup.

## Features

- **Live Broadcast Tracking:** Takes the top tournaments directly from the Lichess API
- **Smart round Selection:** Always loads the current round of the tournament first.
- **Eval Bar:** When available, fetch the position eval from the Lichess API and show it with an eval bar on the left. Also used for final results.
- **Persistent Selection:** Remembers your last selected tournament even after closing the browser or popup.
- **Click game for full analysis:** You can click the game cards on the popup to open a small tab with the full game analysis on Lichess.
- **Lichess Dark Theme:** A clean UI inspired by the Lichess color palette
- **Live Result Badges:** Displays game scores (1-0, 0-1, ½-½) directly in the player list once games conclude.

**_IMPORTANT NOTE:_** This extension relies heavily on the Lichess Broadcast API. Sometimes, limitations on the API can result on player clock information or computer eval to be missing or inaccurate.

## Installation

### For Chrome / Edge
- LiCC is not available at the [Chrome Web Store!](https://chromewebstore.google.com/detail/oebgapikpbhcjodnoffbiigaljgadojg?utm_source=item-share-cb)
- For manual installation, follow these steps:
    1. Download or clone this repository
    2. Open Chrome and navigate to `chrome://extensions/` (or `edge://extensions`)
    3. Enable **Developer mode** on the top right corner
    4. Select **Load unpacked** and select the project folder.

### For Firefox
- LiCC is now available at [addons.mozilla.org!](https://addons.mozilla.org/pt-BR/firefox/addon/licc-live-chess-companion/)!
- For manual installation, follow these steps:
    1. Download or clone this repository
    2. Navigate to `about:debugging#/runtime/this-firefox`
    3. Click "Load temporary Add-on"
    4. Select the `manifest.json` file from the project folder

## Update notes:

### Version 1.1
- Added round select button
    * Now users can see past rounds from the selected tournament as well as future round pairings (when available).
- Added smart round selection 
    * The extension will automatically show ongoing rounds for the selected tournament.
    * If there's no rounds underway, it will show the NEXT round of the tournament.

### Version 1.2
- Added current turn indicator
    * Now there's an arrow indicating whose turn it is in ongoing games!
##### Version 1.2.1
- Fixed smart round selection
    * Now, when tehre are no rounds underway in a tournament, the extension automatically selects the last FINISHED round instead of the NEXt round.
##### Version 1.2.2
- Small bug fixes

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [LICENSE](LICENSE) file for more details.

---
*Note: This project is not officially affiliated with Lichess.org.*