import * as vscode from 'vscode';
import { MCPServersProvider, MCPServer } from './mcpServersProvider';

export function activate(context: vscode.ExtensionContext) {
    // Create the server tree provider
    const mcpServersProvider = new MCPServersProvider();
    
    // Register the tree data provider
    const treeView = vscode.window.createTreeView('mcpServersView', {
        treeDataProvider: mcpServersProvider,
        showCollapseAll: true
    });

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('mcp-guide.refreshServers', () => {
            mcpServersProvider.refresh();
        }),

        vscode.commands.registerCommand('mcp-guide.searchConfigs', async () => {
            const searching = await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Searching for MCP config files...",
                cancellable: false
            }, async () => {
                await mcpServersProvider.searchForConfigs();
            });
            
            vscode.window.showInformationMessage('MCP config file search completed.');
        }),

        vscode.commands.registerCommand('mcp-guide.addServer', async () => {
            // Get the server name
            const serverName = await vscode.window.showInputBox({
                prompt: 'Enter the server name (e.g., @modelcontextprotocol/server-filesystem)',
                placeHolder: 'Server name'
            });

            if (!serverName) {
                return;
            }

            // Get the command
            const command = await vscode.window.showInputBox({
                prompt: 'Enter the command to run the server',
                placeHolder: 'npx',
                value: 'npx'
            });

            if (!command) {
                return;
            }

            // Get the arguments
            const args = await vscode.window.showInputBox({
                prompt: 'Enter command arguments (comma-separated)',
                placeHolder: '-y,@modelcontextprotocol/server-filesystem'
            });

            // Create server config
            const serverConfig = {
                command,
                args: args ? args.split(',').map(arg => arg.trim()) : [],
                disabled: false,
                alwaysAllow: []
            };

            // Get the config file to add to
            const configFiles = await mcpServersProvider.getChildren();
            if (!configFiles || configFiles.length === 0) {
                vscode.window.showErrorMessage('No MCP config files found. Please search for config files first.');
                return;
            }

            const selectedConfig = await vscode.window.showQuickPick(
                configFiles.map(file => ({
                    label: file.label,
                    configPath: file.configPath
                })),
                {
                    placeHolder: 'Select config file to add server to'
                }
            );

            if (!selectedConfig) {
                return;
            }

            try {
                const fs = require('fs').promises;
                const content = await fs.readFile(selectedConfig.configPath, 'utf-8');
                const config = JSON.parse(content);

                // Add the new server
                config.mcpServers = config.mcpServers || {};
                config.mcpServers[serverName] = serverConfig;

                // Save the config
                await fs.writeFile(selectedConfig.configPath, JSON.stringify(config, null, 2));
                mcpServersProvider.refresh();

                vscode.window.showInformationMessage(`Server ${serverName} added successfully.`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to add server: ${error}`);
            }
        }),

        vscode.commands.registerCommand('mcp-guide.editServer', (server: MCPServer) => {
            mcpServersProvider.editServer(server);
        }),

        vscode.commands.registerCommand('mcp-guide.enableServer', (server: MCPServer) => {
            mcpServersProvider.toggleServer(server, true);
        }),

        vscode.commands.registerCommand('mcp-guide.disableServer', (server: MCPServer) => {
            mcpServersProvider.toggleServer(server, false);
        }),

        vscode.commands.registerCommand('mcp-guide.removeServer', (server: MCPServer) => {
            mcpServersProvider.removeServer(server);
        })
    );

    // Initial search for config files
    vscode.commands.executeCommand('mcp-guide.searchConfigs');
}

export function deactivate() {}
