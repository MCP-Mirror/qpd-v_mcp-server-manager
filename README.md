# MCP Guide for VSCode

A VSCode extension for installing and managing Model Context Protocol (MCP) servers - helps users discover, install, and configure MCP servers for use with Claude and other LLM clients.

## Features

- **Browse Available Servers**: Discover and install MCP servers from a curated catalog
- **Manage Configurations**: Add and edit MCP server configurations across multiple config files
- **Server Management**: Enable, disable, and remove installed servers
- **Multi-Config Support**: Works with both Claude Desktop and VSCode Cline configurations

## Installation

1. Install the extension from the VSCode Marketplace
2. Click the MCP icon in the activity bar
3. Use the + button to add your config files
4. Browse and install MCP servers

## Usage

### Adding Config Files
- Click the "Add Config File" button (document icon)
- Select your Claude Desktop or VSCode Cline config file
- Multiple config files are supported

### Installing Servers
1. Click "Browse Available Servers" (server icon)
2. Select a category to view available servers
3. Choose a server to install
4. Select which config files to add it to

### Managing Servers
- Enable/disable servers using the toggle
- Edit server configurations
- Remove servers when no longer needed

## Requirements

- Visual Studio Code ^1.96.0
- Node.js & npm (for some MCP servers)

## Extension Settings

This extension contributes the following settings:

* `mcp-guide.configPaths`: List of MCP configuration file paths to monitor
* `mcp-guide.autoRefresh`: Enable/disable automatic refresh of server status

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for full release notes.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
