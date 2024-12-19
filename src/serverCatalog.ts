export interface MCPServerInfo {
    name: string;
    description: string;
    category: string;
    installCommand: string;
    configTemplate?: {
        command: string;
        args?: string[];
        env?: Record<string, string>;
    };
}

export interface ServerCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
    servers: MCPServerInfo[];
}

// Helper function to create server config
function createServer(name: string, description: string, category: string): MCPServerInfo {
    return {
        name,
        description,
        category,
        installCommand: `npm install -g ${name}`,
        configTemplate: {
            command: 'npx',
            args: ['-y', name]
        }
    };
}

export const serverCategories: ServerCategory[] = [
    {
        id: 'browser',
        name: 'Browser',
        icon: '📂',
        description: 'Web content access and automation capabilities. Enables searching, scraping, and processing web content in AI-friendly formats.',
        servers: [
            createServer('@automatalabs/mcp-server-playwright', 'An MCP server for browser automation using Playwright', 'browser'),
            createServer('@browserbase/mcp-server-browserbase', 'Browser automation and web interaction', 'browser'),
            createServer('@browserbasehq/mcp-stagehand', 'Cloud browser automation capabilities using Stagehand', 'browser'),
            createServer('@executeautomation/playwright-mcp-server', 'An MCP server using Playwright for browser automation and webscraping', 'browser'),
            createServer('@it-beard/exa-server', 'Intelligent code search using Exa API', 'browser'),
            createServer('@kimtaeyoon83/mcp-server-youtube-transcript', 'Fetch YouTube subtitles and transcripts for AI analysis', 'browser'),
            createServer('@kimtth/mcp-aoai-web-browsing', 'Azure OpenAI and web browsing integration', 'browser'),
            createServer('@modelcontextprotocol/server-puppeteer', 'Browser automation for web scraping and interaction', 'browser'),
            createServer('@recursechat/mcp-server-apple-shortcuts', 'An MCP Server Integration with Apple Shortcuts', 'browser')
        ]
    },
    {
        id: 'cloud',
        name: 'Cloud',
        icon: '☁️',
        description: 'Cloud platform service integration. Enables management and interaction with cloud infrastructure and services.',
        servers: [
            createServer('@aws/kb-retrieval-mcp', 'Retrieval from AWS Knowledge Base using Bedrock Agent Runtime', 'cloud'),
            createServer('@cloudflare/mcp-server-cloudflare', 'Integration with Cloudflare services including Workers, KV, R2, and D1', 'cloud'),
            createServer('@flux159/mcp-server-kubernetes', 'Typescript implementation of Kubernetes cluster operations for pods, deployments, services', 'cloud'),
            createServer('@rishikavikondala/mcp-server-aws', 'Perform operations on your AWS resources using an LLM', 'cloud'),
            createServer('@SmallCloudCo/smallcloud-mcp-server', 'Cloud service integration demonstration', 'cloud'),
            createServer('@strowk/mcp-k8s-go', 'Kubernetes cluster operations through MCP', 'cloud')
        ]
    },
    {
        id: 'command_line',
        name: 'Command Line',
        icon: '🖥️',
        description: 'Run commands, capture output and otherwise interact with shells and command line tools.',
        servers: [
            createServer('@g0t4/mcp-server-commands', 'Run any command with run_command and run_script tools', 'command_line'),
            createServer('@mladensu/cli-mcp-server', 'Command line interface with secure execution and customizable security policies', 'command_line'),
            createServer('@PhialsBasement/CMD-MCP-Server', 'Secure command execution with analytics', 'command_line'),
            createServer('@simonb97/win-cli-mcp-server', 'MCP server for secure command-line interactions on Windows systems', 'command_line'),
            createServer('@tumf/mcp-shell-server', 'A secure shell command execution server implementing the Model Context Protocol', 'command_line')
        ]
    },
    {
        id: 'communication',
        name: 'Communication',
        icon: '💬',
        description: 'Integration with communication platforms for message management and channel operations. Enables AI models to interact with team communication tools.',
        servers: [
            createServer('@enescinr/twitter-mcp', 'Interact with Twitter API, post and search tweets', 'communication'),
            createServer('@hannesrudolph/imessage-query-fastmcp', 'iMessage database access and search', 'communication'),
            createServer('@keturiosakys/bluesky-context-server', 'Another Bluesky integration with feed and post search capabilities', 'communication'),
            createServer('@markelaugust74/mcp-google-calendar', 'Google Calendar event management', 'communication'),
            createServer('@markuspfundstein/mcp-gsuite', 'Integration with Gmail and Google Calendar', 'communication'),
            createServer('@modelcontextprotocol/server-bluesky', 'Bluesky instance integration for querying and interaction', 'communication'),
            createServer('@modelcontextprotocol/server-slack', 'Slack workspace integration for channel management and messaging', 'communication'),
            createServer('@vidhupv/x-mcp', 'Create, manage and publish X/Twitter posts', 'communication')
        ]
    },
    {
        id: 'customer_data',
        name: 'Customer Data',
        icon: '👤',
        description: 'Provides access to customer profiles inside of customer data platforms',
        servers: [
            createServer('@ivo-toby/contentful-mcp', 'Read, update, delete, publish content in Contentful spaces', 'customer_data'),
            createServer('@opendatamcp/opendatamcp', 'Connect any Open Data to any LLM with Model Context Protocol', 'customer_data'),
            createServer('@sergehuber/inoyu-mcp-unomi-server', 'An MCP server to access and update profiles on an Apache Unomi CDP server', 'customer_data'),
            createServer('@tinybirdco/mcp-tinybird', 'An MCP server to interact with a Tinybird Workspace from any MCP client', 'customer_data')
        ]
    },
    {
        id: 'database',
        name: 'Database',
        icon: '🗄️',
        description: 'Secure database access with schema inspection capabilities. Enables querying and analyzing data with configurable security controls including read-only access.',
        servers: [
            createServer('@aekanun2020/mcp-server', 'MSSQL database integration with configurable access controls', 'database'),
            createServer('@benborla/mcp-server-mysql', 'MySQL database integration in NodeJS with configurable access controls', 'database'),
            createServer('@cyanheads/atlas-mcp-server', 'Atlas database integration', 'database'),
            createServer('@designcomputer/mysql_mcp_server', 'MySQL database integration with configurable access controls', 'database'),
            createServer('@ergut/mcp-bigquery-server', 'Server implementation for Google BigQuery integration', 'database'),
            createServer('@isaacwasserman/mcp-snowflake-server', 'Interact with Snowflake databases', 'database'),
            createServer('@joshuarileydev/supabase-mcp-server', 'Supabase MCP Server for managing projects and organisations', 'database'),
            createServer('@kashiwabyte/vikingdb-mcp-server', 'VikingDB integration with vector store capabilities', 'database'),
            createServer('@kiliczsh/mcp-mongo-server', 'MongoDB integration server', 'database'),
            createServer('@ktanaka101/mcp-server-duckdb', 'DuckDB database integration with schema inspection', 'database'),
            createServer('@lucashild/mcp-server-bigquery', 'BigQuery database integration with schema inspection and query capabilities', 'database'),
            createServer('@modelcontextprotocol/server-postgres', 'PostgreSQL database integration with schema inspection and query capabilities', 'database'),
            createServer('@modelcontextprotocol/server-sqlite', 'SQLite database operations with built-in analysis features', 'database'),
            createServer('@neo4j-contrib/mcp-neo4j', 'Neo4j graph database integration', 'database'),
            createServer('@quantgeekdev/mongo-mcp', 'MongoDB integration for LLM interaction', 'database'),
            createServer('@qdrant/mcp-server-qdrant', 'Qdrant vector database integration', 'database'),
            createServer('@surrealdb/surrealist-mcp', 'SurrealDB database integration', 'database'),
            createServer('@tinybirdco/mcp-tinybird', 'Tinybird integration with query and API capabilities', 'database')
        ]
    },
    {
        id: 'developer',
        name: 'Developer Tools',
        icon: '🛠️',
        description: 'Tools and integrations that enhance the development workflow and environment management.',
        servers: [
            createServer('@Alec2435/python_mcp', 'Run Python code locally', 'developer'),
            createServer('@dabouelhassan/mcp-server-example-v2', 'FastAPI-based MCP server example', 'developer'),
            createServer('@e2b-dev/mcp-server', 'Code execution with E2B', 'developer'),
            createServer('@emiryasar/mcp_code_analyzer', 'Comprehensive code analysis tools', 'developer'),
            createServer('@ggoodman/mcp', 'CLI tool and UI for managing MCP servers', 'developer'),
            createServer('@jetbrains/mcpproxy', 'Connect to JetBrains IDE', 'developer'),
            createServer('@joshuarileydev/ios-simulator-controller', 'Control iOS simulators programmatically', 'developer'),
            createServer('@joshrutkowski/applescript-mcp', 'macOS AppleScript integration', 'developer'),
            createServer('@justjoehere/mcp_gradio_client', 'Gradio integration for MCP clients', 'developer'),
            createServer('@mcp-get/server-curl', 'Make HTTP requests using a curl-like interface', 'developer'),
            createServer('@mcp-get/server-llm-txt', 'Search and retrieve content from LLM.txt files', 'developer'),
            createServer('@mcp-get/server-macos', 'macOS-specific system information and operations', 'developer'),
            createServer('@mkearl/dependency-mcp', 'Analyze codebases to generate dependency graphs', 'developer'),
            createServer('@nguyenvanduocit/all-in-one-devtools', 'Collection of development tools', 'developer'),
            createServer('@oatpp/oatpp-mcp', 'C++ MCP integration for Oat++', 'developer'),
            createServer('@quantgeekdev/docker-mcp', 'Docker container management and operations', 'developer'),
            createServer('@rmrf2020/decision-mind', 'Decision making demo with client-server communication', 'developer'),
            createServer('@seanivore/mcp-code-analyzer', 'Python code analysis specialist', 'developer'),
            createServer('@shanejonas/openrpc-mpc-server', 'Interact with and discover JSON-RPC APIs via OpenRPC', 'developer'),
            createServer('@snaggle-ai/openapi-mcp-server', 'Connect any HTTP/REST API server using OpenAPI spec (v3)', 'developer'),
            createServer('@szeider/mcp-solver', 'MiniZinc constraint solving capabilities', 'developer'),
            createServer('@tumf/mcp-text-editor', 'Text editor integration', 'developer'),
            createServer('@vijayk-213/model-context-protocol', 'LLaMA model integration for summarization', 'developer'),
            createServer('@zeparhyfar/mcp-datetime', 'Advanced datetime handling and formatting', 'developer')
        ]
    },
    {
        id: 'finance',
        name: 'Finance',
        icon: '💰',
        description: 'Financial data access and cryptocurrency market information. Enables querying real-time market data, crypto prices, and financial analytics.',
        servers: [
            createServer('@9nate-drake/mcp-yfinance', 'Yahoo Finance data integration', 'finance'),
            createServer('@Alec2435/amazon-fresh-server', 'Amazon Fresh integration and ordering', 'finance'),
            createServer('@anjor/coinmarket-mcp-server', 'Coinmarket API integration for crypto data', 'finance'),
            createServer('@calvernaz/alphavantage', 'Stock market data API integration with AlphaVantage', 'finance'),
            createServer('@quantgeekdev/coincap-mcp', 'Real-time cryptocurrency market data via CoinCap API', 'finance'),
            createServer('@sammcj/bybit-mcp', 'Bybit cryptocurrency exchange API access', 'finance')
        ]
    },
    {
        id: 'knowledge',
        name: 'Knowledge',
        icon: '🧠',
        description: 'Persistent memory storage using knowledge graph structures. Enables AI models to maintain and query structured information across sessions.',
        servers: [
            createServer('@chemiguel23/memorymesh', 'Enhanced graph-based memory for AI role-play', 'knowledge'),
            createServer('@modelcontextprotocol/server-memory', 'Knowledge graph-based persistent memory system', 'knowledge'),
            createServer('@run-llama/mcp-server-llamacloud', 'Integrate with data stored in LlamaCloud', 'knowledge'),
            createServer('@shaneholloman/mcp-knowledge-graph', 'Local knowledge graph for persistent memory', 'knowledge'),
            createServer('@Synaptic-Labs-AI/claudesidian', 'Second brain integration system', 'knowledge'),
            createServer('@topoteretes/cognee-mcp-server', 'GraphRAG memory server with customizable ingestion', 'knowledge')
        ]
    },
    {
        id: 'location',
        name: 'Location',
        icon: '🗺️',
        description: 'Geographic and location-based services integration. Enables access to mapping data, directions, and place information.',
        servers: [
            createServer('@modelcontextprotocol/server-google-maps', 'Google Maps integration for location services', 'location'),
            createServer('@mstfe/google-task-mcp', 'Google Tasks integration and management', 'location')
        ]
    },
    {
        id: 'monitoring',
        name: 'Monitoring',
        icon: '📊',
        description: 'Access and analyze application monitoring data. Enables AI models to review error reports and performance metrics.',
        servers: [
            createServer('@macrat/mcp-ayd-server', 'Ayd status monitoring service', 'monitoring'),
            createServer('@metoro-io/metoro-mcp-server', 'Query Kubernetes environments monitored by Metoro', 'monitoring'),
            createServer('@modelcontextprotocol/server-raygun', 'Raygun API V3 integration for monitoring', 'monitoring'),
            createServer('@modelcontextprotocol/server-sentry', 'Sentry.io integration for error tracking', 'monitoring'),
            createServer('@ruchernchong/mcp-server-google-analytics', 'Google Analytics data analysis', 'monitoring'),
            createServer('@Sladey01/mcp-snyk', 'Snyk security scanning integration', 'monitoring'),
            createServer('@sunsetcoder/flightradar24-mcp-server', 'Track flights using Flightradar24 data', 'monitoring'),
            createServer('@tevonsb/homeassistant-mcp', 'Control and monitor Home Assistant devices', 'monitoring')
        ]
    },
    {
        id: 'search',
        name: 'Search',
        icon: '🔎',
        description: 'Web search and content discovery capabilities.',
        servers: [
            createServer('@ac3xx/mcp-servers-kagi', 'Kagi search API integration', 'search'),
            createServer('@ahonn/mcp-server-gsc', 'Access to Google Search Console data', 'search'),
            createServer('@andybrandt/mcp-simple-arxiv', 'Search and read papers from arXiv', 'search'),
            createServer('@andybrandt/mcp-simple-pubmed', 'Search medical papers from PubMed', 'search'),
            createServer('@angheljf/nyt', 'Search articles using the NYTimes API', 'search'),
            createServer('@apify/mcp-server-rag-web-browser', 'Web search and content scraping', 'search'),
            createServer('@blazickjp/arxiv-mcp-server', 'Search ArXiv research papers', 'search'),
            createServer('@dmayboroda/minima', 'Local RAG implementation', 'search'),
            createServer('@exa-labs/exa-mcp-server', 'Exa AI Search API integration', 'search'),
            createServer('@fatwang2/search1api-mcp', 'Search via search1api', 'search'),
            createServer('@it-beard/tavily-server', 'AI-powered search using Tavily API', 'search'),
            createServer('@laksh-star/mcp-server-tmdb', 'Movie and TV show data from TMDB', 'search'),
            createServer('@modelcontextprotocol/server-brave-search', 'Web search using Brave\'s Search API', 'search'),
            createServer('@modelcontextprotocol/server-fetch', 'Web content fetching and processing', 'search'),
            createServer('@mzxrai/mcp-webresearch', 'Search Google and do deep web research', 'search'),
            createServer('@secretiveshell/searxng-search', 'SearXNG metasearch engine integration', 'search'),
            createServer('@tomatio13/mcp-server-tavily', 'Tavily AI search API', 'search'),
            createServer('@vrknetha/mcp-server-firecrawl', 'Advanced web scraping with JS rendering', 'search'),
            createServer('@wong2/mcp-jina-reader', 'Fetch remote URLs as Markdown with Jina Reader', 'search')
        ]
    },
    {
        id: 'security',
        name: 'Security',
        icon: '🔐',
        description: 'Security scanning, analysis, and monitoring tools.',
        servers: [
            createServer('@axiomhq/mcp-server-axiom', 'Axiom observability platform integration', 'security'),
            createServer('@burtthecoder/maigret', 'OSINT username search tool integration', 'security'),
            createServer('@burtthecoder/shodan', 'Shodan security search engine integration', 'security'),
            createServer('@burtthecoder/virustotal', 'VirusTotal malware analysis integration', 'security')
        ]
    },
    {
        id: 'compliance',
        name: 'Compliance',
        icon: '🔒',
        description: 'Security policy implementation and compliance monitoring.',
        servers: [
            createServer('@dynamicendpoints/bod-25-01-cisa-mcp', 'CISA BOD 25-01 security requirements for Microsoft 365', 'compliance')
        ]
    },
    {
        id: 'travel',
        name: 'Travel',
        icon: '🚆',
        description: 'Access to travel and transportation information. Enables querying schedules, routes, and real-time travel data.',
        servers: [
            createServer('@r-huijts/ns-mcp-server', 'Access Dutch Railways (NS) travel information', 'travel')
        ]
    },
    {
        id: 'version_control',
        name: 'Version Control',
        icon: '🔄',
        description: 'Interact with Git repositories and version control platforms.',
        servers: [
            createServer('@block/goose-mcp', 'GitHub operations automation', 'version_control'),
            createServer('@modelcontextprotocol/server-git', 'Direct Git repository operations', 'version_control'),
            createServer('@modelcontextprotocol/server-github', 'GitHub API integration', 'version_control'),
            createServer('@modelcontextprotocol/server-gitlab', 'GitLab platform integration', 'version_control')
        ]
    },
    {
        id: 'other',
        name: 'Other',
        icon: '🛠️',
        description: 'Additional tools and integrations.',
        servers: [
            createServer('@aliargun/mcp-server-gemini', 'Google Gemini AI models integration', 'other'),
            createServer('@amidabuddha/unichat-mcp-server', 'Multi-provider LLM integration', 'other'),
            createServer('@anaisbetts/mcp-installer', 'MCP server installer', 'other'),
            createServer('@anaisbetts/mcp-youtube', 'YouTube subtitles', 'other'),
            createServer('@andybrandt/mcp-simple-openai-assistant', 'OpenAI assistants integration', 'other'),
            createServer('@andybrandt/mcp-simple-timeserver', 'Time checking service', 'other'),
            createServer('@baba786/phabricator-mcp-server', 'Phabricator API integration', 'other'),
            createServer('@bartolli/mcp-llm-bridge', 'OpenAI-compatible LLMs', 'other'),
            createServer('@calclavia/mcp-obsidian', 'Markdown notes', 'other'),
            createServer('@ccabanillas/notion-mcp', 'Notion API integration', 'other'),
            createServer('@chatmcp/mcp-server-chatsum', 'Chat analysis', 'other'),
            createServer('@danhilse/notion_mcp', 'Notion API todo list management', 'other'),
            createServer('@dgormly/mcp-financial-advisor', 'Financial advisory and bookkeeping tools', 'other'),
            createServer('@DMontgomery40/mcp-canvas-lms', 'Canvas LMS course management', 'other'),
            createServer('@domdomegg/airtable-mcp-server', 'Airtable integration', 'other'),
            createServer('@evalstate/mcp-miro', 'MIRO whiteboard integration', 'other'),
            createServer('@felores/airtable-mcp', 'Alternative Airtable integration', 'other'),
            createServer('@future-audiences/wikimedia-enterprise-mcp', 'Wikipedia lookup', 'other'),
            createServer('@isaacwasserman/mcp-vegalite-server', 'Data visualization', 'other'),
            createServer('@jerhadf/linear-mcp-server', 'Linear project management', 'other'),
            createServer('@jimpick/fireproof-todo-mcp', 'Fireproof todo list', 'other'),
            createServer('@joshuarileydev/app-store-connect', 'App Store Connect integration', 'other'),
            createServer('@lightconetech/mcp-gateway', 'SSE Server gateway', 'other'),
            createServer('@llmindset/mcp-hfspace', 'HuggingFace Spaces integration', 'other'),
            createServer('@markuspfundstein/mcp-obsidian', 'Obsidian REST API integration', 'other'),
            createServer('@MCP-Club/mcpm', 'Command-line MCP server manager', 'other'),
            createServer('@mikeskarl/mcp-prompt-templates', 'Standardized analysis prompt templates', 'other'),
            createServer('@modelcontextprotocol/server-everything', 'MCP protocol feature examples', 'other'),
            createServer('@mrjoshuak/godoc-mcp', 'Token-efficient Go documentation server', 'other'),
            createServer('@mzxrai/mcp-openai', 'Chat with OpenAI\'s models', 'other'),
            createServer('@navisbio/clinicaltrials-mcp', 'ClinicalTrials.gov analysis', 'other'),
            createServer('@patruff/claude-mcp-setup', 'Easy Windows setup for MCP servers', 'other'),
            createServer('@patruff/ollama-mcp-bridge', 'Ollama LLM integration bridge', 'other'),
            createServer('@pierrebrunelle/mcp-server-openai', 'Query OpenAI models from Claude', 'other'),
            createServer('@pyroprompts/any-chat-completions-mcp', 'OpenAI-compatible API integration', 'other'),
            createServer('@reeeeemo/ancestry-mcp', 'Read .ged files and genetic data', 'other'),
            createServer('@rusiaaman/wcgw', 'Autonomous shell execution (Mac)', 'other'),
            createServer('@sammcj/package-version', 'Package version management tools', 'other'),
            createServer('@sirmews/apple-notes-mcp', 'Read Apple Notes database (macOS)', 'other'),
            createServer('@sirmews/mcp-pinecone', 'Pinecone vector database', 'other'),
            createServer('@skydeckai/mcp-server-rememberizer', 'Knowledge retrieval', 'other'),
            createServer('@smithery-ai/mcp-obsidian', 'Enhanced Obsidian vault integration', 'other'),
            createServer('@sooperset/mcp-atlassian', 'Confluence workspace integration', 'other'),
            createServer('@suekou/mcp-notion-server', 'Notion API integration', 'other'),
            createServer('@tanigami/mcp-server-perplexity', 'Perplexity API integration', 'other'),
            createServer('@v-3/notion-server', 'Notion page management', 'other'),
            createServer('@varunneal/spotify-mcp', 'Spotify playback control', 'other'),
            createServer('@wong2/litemcp', 'TypeScript framework for building MCP servers', 'other'),
            createServer('@wong2/mcp-cli', 'MCP server testing tool', 'other'),
            createServer('@zueai/mcp-manager', 'MCP server management UI', 'other')
        ]
    }
];

export function getServerByName(name: string): MCPServerInfo | undefined {
    for (const category of serverCategories) {
        const server = category.servers.find(s => s.name === name);
        if (server) {
            return server;
        }
    }
    return undefined;
}

export function getAllServers(): MCPServerInfo[] {
    return serverCategories.flatMap(category => category.servers);
}