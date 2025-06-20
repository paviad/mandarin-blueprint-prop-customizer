# Mandarin Blueprint Prop Customizer

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/canpihhofonencamgdapaeedbmailndn)](https://chromewebstore.google.com/detail/canpihhofonencamgdapaeedbmailndn?utm_source=item-share-cb)

Create, save, and manage your own Mandarin Blueprint props directly in your browser! Synchronizes with Traverse!

## Overview
This Chrome extension enhances your experience on [Mandarin Blueprint](https://courses.mandarinblueprint.com/) by allowing you to customize, store, and manage your own props for the course. Easily tailor your learning process and keep your custom props organized.

## Features
- 📝 **Create and edit custom props** for Mandarin Blueprint characters
- 💾 **Save your props** locally using browser storage
- 📋 **Manage and update** your prop list anytime
- ⚡ **Seamless integration** with the Mandarin Blueprint course website
- 🔄 **Automatic synchronization**: Whenever you enter a prop mapping on Mandarin Blueprint or Traverse.link, the extension saves it on both sites, keeping your props in sync across platforms.

## Installation

### From Chrome Web Store (Recommended)
Install the latest stable version directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/canpihhofonencamgdapaeedbmailndn?utm_source=item-share-cb).

### From Source (Development)
1. Clone or download this repository.
2. Run `npm install` to install dependencies.
3. Build the extension with `npm run webpack`.
4. Go to `chrome://extensions/` in your browser.
5. Enable "Developer mode" (top right).
6. Click "Load unpacked" and select the `dist` folder.

## Usage

- Visit [Mandarin Blueprint](https://courses.mandarinblueprint.com/) or [Traverse.link](https://traverse.link).
- The extension will activate automatically.
- Visit a "Make a Movie" or "Pick a Prop" page on MB, or a "Pick a prop for..." on Traverse, and you will be able to enter your own prop association.
- Associations entered are automatically shared with both MB and Traverse.

## Development
- Source code is in the `src/` directory (written in TypeScript).
- Build output is bundled to `assets/main.bundle.js` via Webpack.

## Contributing
Pull requests and suggestions are welcome! Please open an issue to discuss your ideas or report bugs.

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

---
**Author:** Aviad Pineles
