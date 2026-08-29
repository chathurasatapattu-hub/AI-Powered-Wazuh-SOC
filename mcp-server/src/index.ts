import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { apiRequest, authenticate } from "./wazuh-api.js";

const server = new McpServer({
    name: "wazuh-mcp-server",
    version: "1.0.0"
});

// Tool 1: Get Agents
server.tool(
    "get_wazuh_agents",
    "Retrieve a list of monitored agents and their connection status",
    {
        status: z.enum(["all", "active", "disconnected", "pending"]).optional().describe("Filter agents by status")
    },
    async ({ status }) => {
        try {
            const params = status && status !== "all" ? { status } : {};
            const response = await apiRequest('GET', '/agents', params);
            return {
                content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
            };
        } catch (error: any) {
            return { content: [{ type: "text", text: `Error fetching agents: ${error.message}` }], isError: true };
        }
    }
);

// Tool 2: Get Agent Vulnerabilities
server.tool(
    "get_wazuh_vulnerability_summary",
    "Retrieve a vulnerability summary for a specific Wazuh agent endpoint",
    {
        agent_id: z.string().describe("The 3-digit Wazuh agent ID (e.g., '001')")
    },
    async ({ agent_id }) => {
        try {
            const response = await apiRequest('GET', `/vulnerability/${agent_id}/summary`);
            return {
                content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
            };
        } catch (error: any) {
            return { content: [{ type: "text", text: `Error fetching vulnerabilities: ${error.message}` }], isError: true };
        }
    }
);

async function startServer() {
    try {
        console.error("[INFO] Initializing MCP server...");
        await authenticate();
        console.error("[INFO] Authentication successful - Connected to Wazuh API");
        
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("[INFO] Wazuh MCP Server running on stdio");
        
    } catch (error: any) {
        console.error("[ERROR] Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
