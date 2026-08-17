# AI Flashcards for Obsidian

AI-powered flashcard generation tool for Obsidian (https://obsidian.md).

This plugin uses artificial intelligence to automatically generate multiple-choice flashcards from your existing notes, helping you create effective study materials without manual effort.

## Features

- **AI-Powered Generation**: Automatically extract key concepts and questions from your notes using AI
- **Multiple Choice Cards**: Generate cards with 4 answer options for better recall testing
- **Flexible AI Providers**: Support for various AI services (configuration coming soon)
- **Study Sessions**: Organize and review flashcards in structured study sessions
- **Seamless Integration**: Works directly within your Obsidian vault

## Planned Features

See [ROADMAP.md](./ROADMAP.md) for the complete implementation plan across three epics:

1. **Foundation**: Clean up sample code and establish core plugin structure
2. **Source Collection**: Build note scanning, AI provider integration, and card generation pipeline
3. **AI Generation**: Implement multiple-choice question generation with answer validation
4. **Review Experience**: Add study sessions, progress tracking, and review scheduling

## Getting Started

### Prerequisites

- Obsidian (latest version recommended)
- Node.js v18 or higher

### Installation

1. Clone this repository to your `.obsidian/plugins/ai-flashcards` folder
2. Run `npm i` to install dependencies
3. Run `npm run dev` to start compilation in watch mode
4. Reload Obsidian and enable the plugin from Settings > Community Plugins

### Development

```bash
# Install dependencies
npm i

# Start development server (watch mode)
npm run dev

# Lint code
npm run lint

# Build for production
npm run build
```

## Configuration

Plugin settings will be available in Obsidian's Settings > Community Plugins > AI Flashcards. This includes:

- AI provider selection
- Card generation preferences
- Study session settings

## Roadmap

This plugin is under active development. See [ROADMAP.md](./ROADMAP.md) for the complete implementation plan.

## API Documentation

See https://docs.obsidian.md for the Obsidian Plugin API documentation.

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) for details.

---

> **Note**: This plugin is currently in development. Some features described in the roadmap may not yet be available.
