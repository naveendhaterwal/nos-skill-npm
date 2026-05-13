<div align="center">
  <img src="https://ibb.co/hqVLdbz" alt="Nosana Logo" width="120" />
  <h1>nos-skill</h1>
  <p><strong>Universal AI Skill Operating System & Installer</strong></p>
  
  <p>
    <a href="https://www.npmjs.com/package/nos-skill"><img src="https://img.shields.io/npm/v/nos-skill?color=00d100&label=npm" alt="NPM Version" /></a>
    <a href="https://nosana.io"><img src="https://img.shields.io/badge/powered_by-Nosana-00d100.svg" alt="Powered by Nosana" /></a>
    <a href="https://github.com/naveendhaterwal/Nosana-skill"><img src="https://img.shields.io/github/stars/naveendhaterwal/Nosana-skill?style=social" alt="GitHub Stars" /></a>
  </p>
</div>

---

`nos-skill` is a production-grade CLI for installing, managing, and orchestrating operational AI skills across all major AI agents and IDEs. 

It injects **deterministic operational intelligence** into your AI environment, enabling autonomous agents to confidently deploy, manage, and debug workloads on the decentralized Nosana GPU compute network.

## ⚡ Supported Agents

Install your skills once, and use them universally across your AI stack:

| Agent / IDE | Support | Integration Type |
| :--- | :--- | :--- |
| **Antigravity** | ✅ Native | Global Intelligence |
| **Cursor** | ✅ Native | Workspace Rules (`.cursorrules`) |
| **Windsurf** | ✅ Native | Context Rules (`.windsurfrules`) |
| **Claude Code** | ✅ Native | Local CLI Tools |
| **Goose** | ✅ Native | Global Extensions |
| **Gemini CLI** | ✅ Native | Local Tools |

---

## 🚀 Quick Start

### Install All Skills (Recommended)
You can instantly install the entire suite of 14 official Nosana operational skills in one command.

```bash
npx nos-skill@beta add-all nos
```

### Install Individual Skills
If you prefer a modular setup, you can list and pick exactly what you need.

```bash
# List all available skills in the registry
npx nos-skill list

# Install a specific skill
npx nos-skill add nos/deploy-ai-project
```

### Verify Installation
Check which skills are physically installed and active in your agents:

```bash
npx nos-skill installed
```

---

## 🧠 The Nosana Ecosystem

The official `nos` registry contains production-ready operational intelligence for managing AI workloads.

### Core Deployments
- `nos/deploy-ai-project`: Workload orchestration compiler.
- `nos/deploy-persistent-api`: Long-running service deployment engine.
- `nos/deploy-ai-agent`: Autonomous agent workload deployer.

### Operations & Diagnostics
- `nos/debug-nosana-deployment`: Incident-response and telemetry debugger.
- `nos/nosana-failure-recovery-operator`: Automated failure remediation engine.
- `nos/recommend-gpu-market`: Economic cost and market selection engine.
- `nos/network-monitor`: Blockchain state & network utilization tracker.
- `nos/node-operator`: Compute host infrastructure management.

### Advanced Orchestration
- `nos/nosana-deployment-architect`: Deployment architecture mapping.
- `nos/nosana-ai-deployment-operator`: Complex AI deployment execution.
- `nos/skill-composer`: Asynchronous orchestration controller.
- `nos/nosana-market-analyst`: Deep market analysis intelligence.

---

## 🛠️ CLI Reference

### Installation & Management
| Command | Description |
| :--- | :--- |
| `add-all [namespace]` | **NEW** — Install all skills in a namespace (default: `nos`). |
| `add <source>` | Install a skill from the registry, a GitHub repo, or a local path. |
| `remove <name>` | Remove an installed skill from all mapped AI agents. |
| `update` | Update all eligible skills against the upstream registry. |
| `sync` | Synchronize installed skills across newly detected AI agents. |

### Discovery & Intelligence
| Command | Description |
| :--- | :--- |
| `list` | List all available skills in the registry. |
| `installed` | List skills currently active in your agents. |
| `search <query>` | Perform semantic natural language search across the registry. |
| `inspect <name>` | Generate a deep AI intelligence breakdown report for a skill. |
| `graph` | Visualize the dependency graph between active skills. |
| `export` | Export the current system state to JSON/YAML. |

### System Integrity & Development
| Command | Description |
| :--- | :--- |
| `doctor` | Run deep system diagnostics and detect skill corruption. |
| `repair` | Automatically fix missing files and recoverable corruption. |
| `audit` | Run a security and architecture audit across installed skills. |
| `init <dir>` | Scaffold a new structured AI skill using official templates. |
| `publish <path>` | Validate, package, and test a skill before registry publishing. |
| `migrate <path>` | Migrate a legacy markdown-only skill to the structured schema. |

---

## 🛡️ Security & Trust

`nos-skill` features a robust **Trust Engine**:
- **Heuristic Auditing**: Automatic static analysis detects dangerous bash commands, unauthorized network calls, and obfuscated code patterns.
- **Rollback-Safe Installs**: Atomic symlinking ensures corrupted installations are automatically reverted.
- **Local Execution**: Skills are distributed as local intelligence files. `nos-skill` orchestrates the context injection—your agent executes it natively.

> **Note**: Skills execute with the permission boundaries of your host AI agent. Always `inspect` or `audit` external skills before utilizing them.

---

## 🏗️ Developing Custom Skills

The CLI includes built-in tooling for building your own operational skills. 

```bash
# Scaffold a new advanced workflow skill
npx nos-skill init my-custom-skill --type workflow

# Validate architecture and run local tests
npx nos-skill publish ./my-custom-skill
```

---

## 📄 License

MIT © [Nosana](https://nosana.io). Built for the decentralized compute revolution.
