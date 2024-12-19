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
            const results = await mcpServersProvider.searchForConfigs();
            
            if (results.length === 0) {
                vscode.window.showInformationMessage('No MCP config files found.');
                return;
            }

            // Create QuickPick for multi-select
            const quickPick = vscode.window.createQuickPick();
            quickPick.title = 'Select MCP Config Files';
            quickPick.placeholder = 'Select config files to add (use Space to select multiple)';
            quickPick.canSelectMany = true;
            
            quickPick.items = results.map(result => ({
                label: result.label,
                description: result.path,
                picked: false
            }));

            quickPick.buttons = [
                {
                    iconPath: new vscode.ThemeIcon('check-all'),
                    tooltip: 'Select All'
                }
            ];

            quickPick.onDidTriggerButton(button => {
                // Select all items
                quickPick.selectedItems = quickPick.items;
            });

            quickPick.onDidAccept(async () => {
                const selectedPaths = quickPick.selectedItems
                    .map(item => item.description)
                    .filter((path): path is string => path !== undefined);
                    
                quickPick.hide();

                if (selectedPaths.length > 0) {
                    selectedPaths.forEach(path => {
                        mcpServersProvider.addKnownConfigPath(path);
                    });
                    vscode.window.showInformationMessage(`Added ${selectedPaths.length} config file(s).`);
                }
            });

            quickPick.show();
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

            // Get all available config files
            const configFiles = await mcpServersProvider.getChildren();
            if (!configFiles || configFiles.length === 0) {
                vscode.window.showErrorMessage('No MCP config files found. Please search for config files first.');
                return;
            }

            // Create QuickPick for multi-select config files
            const quickPick = vscode.window.createQuickPick();
            quickPick.title = 'Select Config Files';
            quickPick.placeholder = 'Select which config files to add the server to (use Space to select multiple)';
            quickPick.canSelectMany = true;

            quickPick.items = configFiles.map(file => ({
                label: file.label,
                description: file.configPath,
                picked: false
            }));

            quickPick.buttons = [
                {
                    iconPath: new vscode.ThemeIcon('check-all'),
                    tooltip: 'Select All'
                }
            ];

            quickPick.onDidTriggerButton(button => {
                // Select all items
                quickPick.selectedItems = quickPick.items;
            });

            quickPick.onDidAccept(async () => {
                const selectedPaths = quickPick.selectedItems
                    .map(item => item.description)
                    .filter((path): path is string => path !== undefined);

                quickPick.hide();

                if (selectedPaths.length > 0) {
                    await mcpServersProvider.addServerToConfigs(serverName, serverConfig, selectedPaths);
                    vscode.window.showInformationMessage(`Server ${serverName} added to ${selectedPaths.length} config file(s).`);
                }
            });

            quickPick.show();
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
