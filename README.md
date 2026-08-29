# AI-Powered Security Operations: Integrating Wazuh SIEM with Claude via Model Context Protocol (MCP)

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Wazuh Version](https://img.shields.io/badge/Wazuh-v4.9.2-00599C.svg)
![MCP](https://img.shields.io/badge/Protocol-MCP-orange.svg)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-green.svg)
![Azure](https://img.shields.io/badge/Cloud-Azure-0078D4.svg)

An intelligent Security Operations (SOC) triage bridge connecting **Wazuh SIEM** to **Claude Desktop** using the **Model Context Protocol (MCP)**. This project enables natural-language security telemetry querying, automated vulnerability correlation, and conversational alert analysis across enterprise endpoints.

---

## Architecture Overview

This deployment utilizes a hybrid architecture that decouples cloud-based telemetry collection from local AI assistant workflows, maintaining a secure posture without exposing internal AI infrastructure directly to cloud endpoints.

![Architecture Flowchart](assets/arch-diagram.jpg)

### Key Components
1. **SIEM Telemetry Layer:** Wazuh Manager v4.9.2 running on an Azure Linux VM (Standard D2s v3), ingesting logs and performing endpoint posture assessment.
2. **Integration Layer:** Custom Model Context Protocol (MCP) server written in TypeScript, acting as a secure intermediary between the Wazuh REST API and the local LLM.
3. **AI Cognitive Layer:** Claude Desktop running locally, leveraging tool-use execution to query security data and synthesize context-rich incident explanations.

---

## Technical Features & Visibility

* **Conversational Incident Triage:** Translates complex JSON alerts and raw syslog feeds into plain-language summaries (e.g., distinguishing legitimate login anomalies from brute-force attempts).
* **Automated Posture Assessment:** Queries real-time vulnerability scan data per agent to isolate critical CVEs and misconfigurations.
* **Centralized SIEM Aggregation:** 

![Wazuh Dashboard](assets/wazuh-dashboard.png)

### Granular MCP Tool Registry
* `get_wazuh_agents`: Discovers active, disconnected, and pending endpoint agents.
* `get_wazuh_alerts`: Retrieves high-severity alerts from the SIEM event index.
* `get_wazuh_rules`: Explores active MITRE ATT&CK-mapped detection rules.
* `get_wazuh_vulnerability_summary`: Summarizes vulnerability exposure for a specified agent.
* `get_wazuh_critical_vulnerabilities`: Filters and prioritizes actionable, high-severity CVEs.
* `get_wazuh_stats`: Fetches daemon and cluster operational metrics.

---

## Demo Walkthrough

### 1. MCP Server Initialization
The local server establishes an authenticated session with the Azure-hosted Wazuh API and registers available tools over `stdio`.

![MCP Server Startup](assets/mcp-server-startup.png)

### 2. Conversational Agent & Posture Discovery

**User Query:**
> *"List all the Wazuh agents and summarize their current state."*

**Claude Action (Tool Call: `get_wazuh_agents`):**
Claude dynamically queries the Wazuh API and formats the JSON response into a clean summary of connected endpoints.

![Claude Agent Discovery](assets/claude-tool-discovery.jpg)

### 3. Vulnerability Triage

**User Query:**
> *"Check all critical vulnerabilities for agent ZenBookSE."*

**Claude Action (Tool Call: `get_wazuh_critical_vulnerabilities`):**
Claude queries the agent's package database against known CVE feeds, interprets the CVSS severity, and maps out the compromised software versions.

![Claude Vulnerability Analysis](assets/claude-vulnerability-analysis.jpg)

---

## Installation & Setup

### Prerequisites
* Node.js (v18.0.0 or higher)
* Azure VM running Wazuh Manager v4.9.2
* Claude Desktop Application

### 1. Clone & Build the MCP Server
```bash
git clone [https://github.com/your-username/AI-Powered-Wazuh-SOC.git](https://github.com/your-username/AI-Powered-Wazuh-SOC.git)
cd AI-Powered-Wazuh-SOC/mcp-server
npm install
npm run build
```

### 2. Environment Configuration
Create a `.env` file in the `mcp-server` directory:
```env
WAZUH_API_URL=https://<YOUR_WAZUH_IP>:55000
WAZUH_API_USER=wazuh-wui
WAZUH_API_PASSWORD=YourSecurePasswordHere
NODE_TLS_REJECT_UNAUTHORIZED=0  # For self-signed lab certificates
```

### 3. Configure Claude Desktop
Add the server configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wazuh-soc": {
      "command": "node",
      "args": [
        "C:/path/to/AI-Powered-Wazuh-SOC/mcp-server/dist/index.js"
      ],
      "env": {
        "WAZUH_API_URL": "https://<YOUR_WAZUH_IP>:55000",
        "WAZUH_API_USER": "wazuh-wui",
        "WAZUH_API_PASSWORD": "YourSecurePasswordHere"
      }
    }
  }
}
```

---

## Security & Architectural Considerations

* **Least-Privilege API Accounts:** The connector is configured with read-only Wazuh API credentials to prevent unauthorized policy or configuration modifications.
* **Hub-and-Spoke Lab Integration:** Designed to integrate into an enterprise Hub-and-Spoke network topology, where the central Wazuh manager aggregates logs from spoke subnet workloads while maintaining network segregation.
* **Data Sanitization:** Telemetry passing through the local MCP server is filtered to protect internal subnet architectures and identifiers prior to ingestion by the LLM context window.

---

## Future Enhancements

- [ ] Add automated Sigma rule conversion to Wazuh custom XML rules via LLM prompts.
- [ ] Implement two-way active response capabilities (e.g., automated IP null-routing or agent isolation) with strict human-in-the-loop approval.
- [ ] Support multi-tenant Azure Sentinel / Elastic SIEM connectors alongside Wazuh.
