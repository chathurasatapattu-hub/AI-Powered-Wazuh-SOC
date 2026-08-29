ai-powered-wazuh-soc/
├── README.md                 (Main repository documentation)
├── .gitignore                (Git ignore file)
├── docs/
│   ├── architecture.md       (Technical overview from your document)
│   └── lab-alignment.md      (Educational/Hub-and-Spoke alignment)
└── mcp-server/               (The Node.js/TypeScript application)
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── index.ts          (MCP Server entry point and tool definitions)
        └── wazuh-api.ts      (Wazuh REST API integration and authentication)
