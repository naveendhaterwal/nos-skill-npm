# nos-skill.
### Universal AI Skill Runtime & Installer

`nos-skill` is a production-grade CLI for installing, managing, and discovering operational AI skills across all major AI agents and IDEs.

**Install operational AI skills into Cursor, Claude Code, Codex, Windsurf, Goose, Gemini CLI, and more.**

---

## 🚀 Quick Install

```bash
# List available skills
npx nos-skill list

# Install a specific skill
npx nos-skill add nos/deploy-ai-project
```

## ✨ Features

- **Universal Registry**: Centralized discovery for high-quality operational skills.
- **Trust Engine**: Heuristic auditing and structure validation for every skill.
- **Semantic Search**: Find the right capability using natural language.
- **Rollback-Safe Installs**: Atomic symlinking and error recovery for local agents.
- **Compatibility Mode**: Seamless support for legacy markdown-only skills.
- **Developer Flow**: Built-in `init` and `publish` commands for skill creators.

## 🤖 Supported Agents

| Agent / IDE | Support | Type |
| :--- | :--- | :--- |
| **Antigravity** | ✅ Native | Global |
| **Cursor** | ✅ Native | Rules |
| **Claude Code** | ✅ Native | Local |
| **Windsurf** | ✅ Native | Context |
| **Goose** | ✅ Native | Global |
| **Gemini CLI** | ✅ Native | Local |

## 🌐 Nosana Ecosystem

The official Nosana registry provides deterministic operational intelligence for decentralized GPU infrastructure:

- `nos/deploy-ai-project`: Workload orchestration compiler.
- `nos/deploy-persistent-api`: Long-running service deployment engine.
- `nos/deploy-ai-agent`: Autonomous agent workload deployer.
- `nos/debug-nosana-deployment`: Incident-response and telemetry debugger.
- `nos/recommend-gpu-market`: Economic cost and market selection engine.

## 🛠️ CLI Commands

| Command | Description |
| :--- | :--- |
| `list` | List all official available skills in the Nosana registry. |
| `installed` | List all skills physically installed in your AI agents. |
| `add <source>` | Install a skill from a GitHub repo, URL, or local path. |
| `remove <name>` | Remove an installed skill from all agents. |
| `search <query>` | Perform semantic search across the registry. |
| `inspect <name>` | Generate an intelligence report for a skill. |
| `graph` | Visualize dependencies between registry skills. |
| `doctor` | Run system diagnostics and integrity checks. |
| `audit` | Run a security audit across the ecosystem. |
| `init` | Scaffold a new structured AI skill. |
| `publish` | Validate and package a skill for the registry. |

## 🛡️ Security & Transparency

- **Heuristic Auditing**: Automatic detection of dangerous commands and shell executions.
- **Local Execution**: Skills are local files; `nos-skill` only manages the linking.
- **Not Sandboxed**: Skills execute with the permissions of your AI agent. Always inspect skills before installation.

## 🏗️ Publishing Skills

Create a new skill using typed templates:

```bash
# Scaffold a new Nosana app
nos-skill init my-new-skill --type nosana-app

# Validate before publishing
nos-skill publish ./my-new-skill
```

## 🤝 Contributing

Contributions to the core runtime and the official registry are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🗺️ Roadmap

- [ ] Global Registry Sync (GitHub mirroring)
- [ ] Automated Dependency Installation
- [ ] Multi-namespace Support
- [ ] Signed Trust Verification

## 📄 License

MIT © [Nosana](https://nosana.io)
