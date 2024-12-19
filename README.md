# MCP Guide VSCode Extension

A Visual Studio Code extension for installing and managing Model Context Protocol (MCP) servers. This extension helps users discover, install, and configure MCP servers for use with Claude and other LLM clients.

## Features

- 📋 **List Available Servers**: Browse through categorized list of available MCP servers
- 📥 **Install Servers**: Easily install MCP servers with a few clicks
- ⚙️ **Configure Servers**: Manage server configurations through a user-friendly interface
- 🔧 **Manage Installed Servers**: Enable, disable, or remove installed servers

## Commands

All commands are accessible through the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `MCP: List Available Servers` - Browse and install MCP servers by category
- `MCP: Install Server` - Quick access to server installation
- `MCP: Configure Server` - Configure settings for installed servers
- `MCP: Manage Installed Servers` - Enable, disable, or remove servers

## Configuration

The extension supports the following settings:

- `mcp-guide.mcpConfigPath`: Path to the MCP configuration file (claude_desktop_config.json)
- `mcp-guide.serverInstallPath`: Default path for installing MCP servers

## Server Categories

The extension supports various types of MCP servers:

- 📂 **Browser Automation**: Web scraping and interaction
- ☁️ **Cloud Platforms**: Manage cloud infrastructure
- 🖥️ **Command Line**: Execute shell commands securely
- 💬 **Communication**: Integrate with messaging platforms
- 🗄️ **Databases**: Query and analyze data
- 🛠️ **Developer Tools**: Enhance development workflows
- 📂 **File Systems**: Access and manage files
- 🧠 **Knowledge & Memory**: Maintain persistent context
- 🔎 **Search**: Web and data search capabilities
- 🔄 **Version Control**: Git and repository management

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "MCP" to see available commands
3. Choose a command to:
   - Browse available servers
   - Install new servers
   - Configure existing servers
   - Manage installed servers

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "MCP Guide"
4. Click Install

## Requirements

- Visual Studio Code 1.96.0 or higher
- Node.js 16.x or higher
- npm (Node Package Manager)

## Extension Settings

This extension contributes the following settings:

* `mcp-guide.mcpConfigPath`: Path to the MCP configuration file
* `mcp-guide.serverInstallPath`: Default path for installing MCP servers

## Known Issues

- The extension currently supports npm-based MCP servers. Support for other package managers coming soon.
- Some servers may require additional configuration after installation.

## Release Notes

### 0.0.1

Initial release of MCP Guide:
- Basic server installation and management
- Configuration editor
- Server categorization
- Quick access commands

## Contributing

The extension is open source and welcomes contributions. Visit our repository at [GitHub](https://github.com/yourusername/mcp-guide-vscode) to:
- Report issues
- Submit feature requests
- Create pull requests

## License

This extension is licensed under the MIT License.
