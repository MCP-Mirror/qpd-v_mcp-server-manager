import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { homedir } from 'os';

interface MCPServerConfig {
    command: string;
    args?: string[];
    env?: Record<string, string>;
    disabled?: boolean;
    alwaysAllow?: string[];
}

interface MCPConfig {
    mcpServers: Record<string, MCPServerConfig>;
}

export class MCPConfigFile extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly configPath: string
    ) {
        super(label, collapsibleState);
        this.tooltip = configPath;
        this.description = path.dirname(configPath);
        this.contextValue = 'configFile';
    }
}

export class MCPServer extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly configPath: string,
        public readonly config: MCPServerConfig
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = `${label}\nCommand: ${config.command} ${config.args?.join(' ') || ''}`;
        this.description = config.disabled ? 'Disabled' : 'Enabled';
        this.contextValue = config.disabled ? 'server-disabled' : 'server-enabled';
        
        this.iconPath = new vscode.ThemeIcon(
            config.disabled ? 'circle-slash' : 'pass-filled',
            config.disabled ? new vscode.ThemeColor('errorForeground') : new vscode.ThemeColor('testing.iconPassed')
        );
    }
}

export class MCPServersProvider implements vscode.TreeDataProvider<MCPConfigFile | MCPServer> {
    private _onDidChangeTreeData: vscode.EventEmitter<MCPConfigFile | MCPServer | undefined | null | void> = new vscode.EventEmitter<MCPConfigFile | MCPServer | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<MCPConfigFile | MCPServer | undefined | null | void> = this._onDidChangeTreeData.event;

    private knownConfigPaths: Set<string> = new Set();

    constructor() {
        // Initialize with known config paths
        const homeDir = homedir();
        const appData = process.env.APPDATA || path.join(homeDir, 'AppData/Roaming');

        // Add default paths
        [
            // Claude Desktop config
            path.join(appData, 'Claude/claude_desktop_config.json'),
            // VSCode Cline extension config
            path.join(appData, 'Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json')
        ].forEach(path => this.addKnownConfigPath(path));
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    addKnownConfigPath(configPath: string): void {
        this.knownConfigPaths.add(configPath);
        this.refresh();
    }

    getTreeItem(element: MCPConfigFile | MCPServer): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: MCPConfigFile | MCPServer): Promise<(MCPConfigFile | MCPServer)[]> {
        if (!element) {
            // Root level - show config files
            const items: MCPConfigFile[] = [];
            for (const configPath of this.knownConfigPaths) {
                try {
                    await fs.access(configPath);
                    const label = path.basename(path.dirname(configPath));
                    items.push(new MCPConfigFile(label, vscode.TreeItemCollapsibleState.Expanded, configPath));
                } catch (error) {
                    // Config file doesn't exist, skip it
                }
            }
            return items;
        }

        if (element instanceof MCPConfigFile) {
            // Show servers in the config file
            try {
                const content = await fs.readFile(element.configPath, 'utf-8');
                const config: MCPConfig = JSON.parse(content);
                return Object.entries(config.mcpServers).map(([name, serverConfig]) => 
                    new MCPServer(name, element.configPath, serverConfig)
                );
            } catch (error) {
                return [];
            }
        }

        return [];
    }

    async addConfigFile(): Promise<void> {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Select Config File',
            filters: {
                'JSON files': ['json']
            }
        };

        const fileUri = await vscode.window.showOpenDialog(options);
        if (fileUri && fileUri[0]) {
            const filePath = fileUri[0].fsPath;
            
            try {
                // Read and validate the config file
                const content = await fs.readFile(filePath, 'utf-8');
                const config = JSON.parse(content);

                // Check if it's a valid MCP config file
                if (!config.mcpServers || typeof config.mcpServers !== 'object') {
                    // If not a valid MCP config, ask if user wants to initialize it
                    const initChoice = await vscode.window.showWarningMessage(
                        'This file does not appear to be an MCP config file. Would you like to initialize it as one?',
                        'Yes',
                        'No'
                    );

                    if (initChoice === 'Yes') {
                        // Initialize as MCP config
                        config.mcpServers = {};
                        await fs.writeFile(filePath, JSON.stringify(config, null, 2));
                    } else {
                        return;
                    }
                }

                this.addKnownConfigPath(filePath);
                vscode.window.showInformationMessage(`Added config file: ${filePath}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to add config file: ${error}`);
            }
        }
    }

    async addServerToConfigs(serverName: string, serverConfig: MCPServerConfig, configPaths: string[]): Promise<void> {
        for (const configPath of configPaths) {
            try {
                const content = await fs.readFile(configPath, 'utf-8');
                const config: MCPConfig = JSON.parse(content);
                
                config.mcpServers = config.mcpServers || {};
                config.mcpServers[serverName] = serverConfig;
                
                await fs.writeFile(configPath, JSON.stringify(config, null, 2));
                this.addKnownConfigPath(configPath);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to add server to ${configPath}: ${error}`);
            }
        }
        
        this.refresh();
    }

    async editServer(server: MCPServer): Promise<void> {
        try {
            const content = await fs.readFile(server.configPath, 'utf-8');
            const config: MCPConfig = JSON.parse(content);
            
            const document = await vscode.workspace.openTextDocument({
                content: JSON.stringify(config.mcpServers[server.label], null, 2),
                language: 'json'
            });
            
            const editor = await vscode.window.showTextDocument(document);
            
            // Save the changes when the document is saved
            const disposable = vscode.workspace.onDidSaveTextDocument(async (doc) => {
                if (doc === document) {
                    try {
                        const updatedConfig = JSON.parse(doc.getText());
                        config.mcpServers[server.label] = updatedConfig;
                        await fs.writeFile(server.configPath, JSON.stringify(config, null, 2));
                        this.refresh();
                        vscode.window.showInformationMessage(`Server ${server.label} configuration updated.`);
                    } catch (error) {
                        vscode.window.showErrorMessage(`Failed to update server configuration: ${error}`);
                    }
                    disposable.dispose();
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to edit server configuration: ${error}`);
        }
    }

    async toggleServer(server: MCPServer, enable: boolean): Promise<void> {
        try {
            const content = await fs.readFile(server.configPath, 'utf-8');
            const config: MCPConfig = JSON.parse(content);
            
            config.mcpServers[server.label].disabled = !enable;
            
            await fs.writeFile(server.configPath, JSON.stringify(config, null, 2));
            this.refresh();
            
            vscode.window.showInformationMessage(
                `Server ${server.label} ${enable ? 'enabled' : 'disabled'}.`
            );
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to ${enable ? 'enable' : 'disable'} server: ${error}`
            );
        }
    }

    async removeServer(server: MCPServer): Promise<void> {
        const confirm = await vscode.window.showWarningMessage(
            `Are you sure you want to remove ${server.label}?`,
            'Yes',
            'No'
        );

        if (confirm !== 'Yes') {
            return;
        }

        try {
            const content = await fs.readFile(server.configPath, 'utf-8');
            const config: MCPConfig = JSON.parse(content);
            
            delete config.mcpServers[server.label];
            
            await fs.writeFile(server.configPath, JSON.stringify(config, null, 2));
            this.refresh();
            
            vscode.window.showInformationMessage(`Server ${server.label} removed.`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to remove server: ${error}`);
        }
    }
}