import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { glob } from 'glob';
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
        
        // Add status icon
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
        // Initialize with default config paths
        this.addKnownConfigPath(path.join(process.env.APPDATA || '', 'Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json'));
        this.addKnownConfigPath(path.join(homedir(), 'Library/Application Support/Claude/claude_desktop_config.json'));
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
                    const label = path.basename(path.dirname(path.dirname(configPath)));
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

    async searchForConfigs(): Promise<void> {
        const homeDir = homedir();
        
        // Common locations to search
        const searchPaths = [
            path.join(homeDir, '.config'),
            path.join(homeDir, 'Library'),
            path.join(homeDir, 'AppData'),
            path.join(homeDir, '.local/share'),
            path.join(homeDir, 'Documents')
        ];

        for (const searchPath of searchPaths) {
            try {
                const files = await glob('**/*config.json', {
                    cwd: searchPath,
                    absolute: true,
                    ignore: ['**/node_modules/**', '**/dist/**']
                });

                for (const file of files) {
                    try {
                        const content = await fs.readFile(file, 'utf-8');
                        const config = JSON.parse(content);
                        
                        // Check if it's an MCP config file
                        if (config.mcpServers && typeof config.mcpServers === 'object') {
                            this.addKnownConfigPath(file);
                        }
                    } catch (error) {
                        // Skip files that can't be read or parsed
                    }
                }
            } catch (error) {
                // Skip directories that can't be searched
            }
        }
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