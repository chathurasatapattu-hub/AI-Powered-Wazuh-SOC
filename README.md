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

```text
+------------------------------------+
|        Monitored Endpoints         |
|  (Windows 11 / Linux Spoke Nodes)  |
+-----------------+------------------+
                  |
                  | Wazuh Agent Telemetry
                  v
+-----------------+------------------+
|      Azure Cloud Infrastructure     |
|   Wazuh Manager / Indexer / API    |
|       (Ubuntu 22.04 LTS VM)        |
+-----------------+------------------+
                  |
                  | HTTPS / REST API (Port 55000)
                  v
+-----------------+------------------+
|          Local Host Node           |
|  +------------------------------+  |
|  |   Custom Wazuh MCP Server    |  |
|  |     (Node.js / TypeScript)   |  |
|  +--------------+---------------+  |
|                 | stdio (JSON-RPC) |
|  +--------------v---------------+  |
|  |    Claude Desktop Assistant   |  |
|  +------------------------------+  |
+------------------------------------+
