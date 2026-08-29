# System Architecture Overview

This project implements a hybrid architecture combining cloud infrastructure with local components to enable AI-assisted security monitoring without directly exposing the SIEM platform to external AI providers[cite: 1].

## The Three Components

1. **Security Monitoring Platform (Wazuh):** Hosted on an Azure virtual machine (Ubuntu 24.04 LTS, Standard D2s v3, Australia Central). It collects and analyses security data, providing a REST API for programmatic access[cite: 1].
2. **Integration Layer (MCP Connector):** A lightweight local service running on a Windows 11 laptop. It bridges the cloud-based Wazuh API with the local AI assistant using the Model Context Protocol[cite: 1].
3. **AI Analysis Interface (Claude):** The Claude Desktop application running locally, acting as the cognitive layer to interpret security telemetry[cite: 1].

## Data Flow
1. **Event Generation:** Monitored systems generate security events.
2. **SIEM Ingestion:** Events are collected by the Azure-hosted Wazuh instance.
3. **AI Interrogation:** Claude (via the user) requests context. The local MCP connector queries the Wazuh REST API over HTTPS.
4. **Synthesis:** Claude analyzes the JSON responses and presents human-readable security insights[cite: 1].

This setup reflects a realistic enterprise scenario where SIEM platforms run on highly available cloud infrastructure, while analytical tools interface securely via strict API boundaries[cite: 1].
