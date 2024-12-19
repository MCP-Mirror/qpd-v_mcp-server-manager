import * as vscode from 'vscode';
import { MCPServersProvider, MCPServer } from './mcpServersProvider';
import { serverCategories, MCPServerInfo, getServerByName } from './serverCatalog';

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
            await mcpServersProvider.addConfigFile();
        }),

        vscode.commands.registerCommand('mcp-guide.browseServers', async () => {
            // First, try to get the latest server list
            try {
                const mcpGuide = vscode.extensions.getExtension('rooveterinaryinc.roo-cline');
                if (mcpGuide) {
                    const api = await mcpGuide.activate();
                    if (api && api.useMCPTool) {
                        const result = await api.useMCPTool('mcp-guide', 'list_servers', { category: 'all' });
                        vscode.window.showInformationMessage('Retrieved latest server list from MCP Guide');
                    }
                }
            } catch (error) {
                // Continue with local server list if fetching fails
                console.log('Using local server list:', error);
            }

            // Select a category
            const categoryItems = serverCategories.map(cat => ({
                label: `${cat.icon} ${cat.name}`,
                description: `${cat.servers.length} servers`,
                category: cat
            }));

            const selectedCategory = await vscode.window.showQuickPick(categoryItems, {
                placeHolder: 'Select a server category'
            });

            if (!selectedCategory) {
                return;
            }

            // Then select a server from that category
            const serverItems = selectedCategory.category.servers.map(server => ({
                label: server.name,
                description: server.description,
                server: server
            }));

            const selectedServer = await vscode.window.showQuickPick(serverItems, {
                placeHolder: 'Select a server to install'
            });

            if (!selectedServer) {
                return;
            }

            // Get config files to install to
            const configFiles = await mcpServersProvider.getChildren();
            if (!configFiles || configFiles.length === 0) {
                const addConfig = await vscode.window.showWarningMessage(
                    'No MCP config files found. Would you like to add one?',
                    'Yes',
                    'No'
                );

                if (addConfig === 'Yes') {
                    await mcpServersProvider.addConfigFile();
                }
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
                    // First install the server
                    const terminal = vscode.window.createTerminal('MCP Server Installation');
                    terminal.show();
                    terminal.sendText(selectedServer.server.installCommand);

                    // Then add it to the config files
                    if (selectedServer.server.configTemplate) {
                        await mcpServersProvider.addServerToConfigs(
                            selectedServer.server.name,
                            {
                                ...selectedServer.server.configTemplate,
                                disabled: false,
                                alwaysAllow: []
                            },
                            selectedPaths
                        );
                        vscode.window.showInformationMessage(
                            `Server ${selectedServer.server.name} installed and added to ${selectedPaths.length} config file(s).`
                        );
                    }
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

            // Check if it's a known server
            const knownServer = getServerByName(serverName);
            if (knownServer) {
                const useTemplate = await vscode.window.showInformationMessage(
                    `Found configuration template for ${serverName}. Would you like to use it?`,
                    'Yes',
                    'No'
                );

                if (useTemplate === 'Yes') {
                    vscode.commands.executeCommand('mcp-guide.browseServers');
                    return;
                }
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
                vscode.window.showErrorMessage('No MCP config files found. Please add a config file first.');
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
}

export function deactivate() {}
