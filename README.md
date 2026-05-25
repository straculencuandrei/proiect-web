# Personal Walliez

A minimalist personal website inspired by the prigoana.com aesthetic. Clean, terminal-style design with support for light and dark themes.

## Features

- **Minimalist Design**: Terminal/retro aesthetic with monospace fonts and simple borders
- **Light/Dark Theme Toggle**: User-selectable theme with localStorage persistence
- **Responsive Layout**: Two-column layout on desktop, single-column on mobile
- **Guestbook/Chatbox**: Simple comment system with localStorage support
- **Visitor Counter**: Track total page visits using localStorage
- **Section-Based**: Scripture, Last Played Song, Featured Projects, and more

## Design Inspiration

This site is inspired by [prigoana.com](https://prigoana.com/), featuring:
- Monospace IBM Plex Mono font throughout
- Simple 1px borders instead of decorative elements
- Information-dense layout
- Retro web aesthetic with modern sensibilities

## Structure

```
├── index.html      - Main HTML file with two-column layout
├── style.css       - All styling with theme support
├── script.js       - Interactive features (theme toggle, visitor counter, chatbox)
├── favicon.png     - Site icon
└── README.md       - This file
```

## How to Use

1. Open `index.html` in a web browser
2. Click the "THEME" button to toggle between light and dark modes
3. Add messages to the chatbox section
4. Visit counter increments with each page visit

## Customization

Edit the following sections to personalize:
- **Header**: Change "PERSONAL WALLIEZ" to your name
- **Social Links**: Update the social navigation bar
- **Sidebar Sections**: Modify Scripture, Song, and Featured content
- **Projects**: Add your actual projects in the main content area
- **Colors**: Modify `--bg`, `--text`, and `--border` variables in CSS

## Browser Support

Works in all modern browsers. Theme preference is saved in localStorage.

---

Made with ❤️ and monospace fonts.

