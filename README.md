# 🛡️ VRC-Sentry

VRC-Sentry is a management and analytics tool designed specifically for VRChat groups. Its primary goal is to consolidate fragmented group data and moderation logs into a single, intuitive dashboard that streamlines staff workflows.

Having served on a few VRChat moderation teams, I have experienced firsthand how complex and taxing the role can be. While many management tools exist, I have struggled to find one that balances effective administration with a respect for user privacy. VRC-Sentry is my attempt to give back to the VRChat community by bringing order to its naturally chaotic environment.

### 🚧 Project Status
This project is still in its early stages, and I'll be looking for alpha and beta testers once the core features are stable and ready for testing.

### ⚖️ Privacy & Ethics
Because I value privacy in my own work, I've built this with those same rules in mind:
- The data stays on your self-hosted instance (one per group) and I won't be supporting "global blacklists"
- Users can request their data to be deleted (while keeping necessary moderation audit logs).
- Everything is built to stay within VRChat's guidelines.

### 🛠️ My Approach to this Project

For this project, I've also chosen to keep my use of AI very limited. In practice, that means two things:
- As a "rubber duck" for quick questions and brainstorming, using `google/gemma-4-26b-a4b-qat`.
- For inline code completion, using `qwen2.5-coder-7b-instruct` to speed up development.

My reasoning is simple: In a community like VRChat, where so many artists and creators contribute unique, meaningful work, I want my tools to support that craft rather than substitute for it. I've also found that leaning heavily on AI(via "vibe-coding") tends to introduce technical debt, hurt maintainability, and slow down my own skill growth. I'd rather stay in control of my workflow and my costs without depending on big-tech subscriptions.

Thus any AI used for this project runs on my own hardware and is powered by my home's solar panels and battery system (except for a few days in the winter). ☀️

### 📄 License
Licensed under the GNU General Public License v3.0 (GPL-3.0).
