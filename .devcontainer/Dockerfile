FROM node:22-slim

ARG TZ=America/Sao_Paulo
ARG GIT_DELTA_VERSION=0.18.2
ARG ZSH_IN_DOCKER_VERSION=1.2.0
ARG FZF_VERSION=0.70.0

ENV TZ=${TZ} \
    DEVCONTAINER=true \
    DEBIAN_FRONTEND=noninteractive

# System dependencies + iptables for firewall + locale
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git gnupg jq unzip vim nano \
    zsh sudo openssh-client \
    iptables ipset iproute2 dnsutils \
    python3 python3-pip \
    locales \
    && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen \
    && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8

# AWS CLI v2 (multi-arch)
RUN ARCH=$(dpkg --print-architecture) \
    && if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then \
         AWS_URL="https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip"; \
       else \
         AWS_URL="https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"; \
       fi \
    && curl "$AWS_URL" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws

# fzf binary + shell integration (pinned version, multi-arch)
RUN ARCH=$(dpkg --print-architecture) \
    && if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then FZF_ARCH="linux_arm64"; else FZF_ARCH="linux_amd64"; fi \
    && curl -fsSL "https://github.com/junegunn/fzf/releases/download/v${FZF_VERSION}/fzf-${FZF_VERSION}-${FZF_ARCH}.tar.gz" \
       | tar -xz -C /usr/local/bin \
    && mkdir -p /usr/share/doc/fzf/examples \
    && curl -fsSL "https://raw.githubusercontent.com/junegunn/fzf/v${FZF_VERSION}/shell/key-bindings.zsh" \
       -o /usr/share/doc/fzf/examples/key-bindings.zsh \
    && curl -fsSL "https://raw.githubusercontent.com/junegunn/fzf/v${FZF_VERSION}/shell/completion.zsh" \
       -o /usr/share/doc/fzf/examples/completion.zsh

# GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# git-delta for better diffs (multi-arch)
RUN ARCH=$(dpkg --print-architecture) \
    && if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then \
         DELTA_ARCH="aarch64-unknown-linux-gnu"; \
       else \
         DELTA_ARCH="x86_64-unknown-linux-gnu"; \
       fi \
    && curl -fsSL "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/delta-${GIT_DELTA_VERSION}-${DELTA_ARCH}.tar.gz" \
    -o /tmp/delta.tar.gz \
    && tar -xzf /tmp/delta.tar.gz -C /tmp \
    && mv /tmp/delta-${GIT_DELTA_VERSION}-${DELTA_ARCH}/delta /usr/local/bin/delta \
    && rm -rf /tmp/delta*

# Firewall init script
COPY init-firewall.sh /usr/local/bin/init-firewall.sh
RUN chmod +x /usr/local/bin/init-firewall.sh

# Give node user sudo access only for the firewall script
RUN echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall \
    && chmod 0440 /etc/sudoers.d/node-firewall

# Persistent shell history
RUN mkdir -p /commandhistory \
    && touch /commandhistory/.bash_history \
    && touch /commandhistory/.zsh_history \
    && chown -R node:node /commandhistory

# Workspace
RUN mkdir -p /workspace && chown node:node /workspace

USER node

# Pre-trust GitHub SSH host key so git operations don't prompt for confirmation
RUN mkdir -p ~/.ssh && ssh-keyscan -t ed25519,rsa,ecdsa github.com >> ~/.ssh/known_hosts 2>/dev/null

# Claude Code CLI (native installer — must run as node so it installs to /home/node/.local/bin)
RUN curl -fsSL https://claude.ai/install.sh | bash

# Bun runtime (required by claude-mem plugin, v1.1.14+ needed)
RUN curl -fsSL https://bun.sh/install | bash

# uv — Python package manager (optional, enables Chroma vector search in claude-mem)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# ZSH with powerlevel10k theme, git and fzf plugins
RUN sh -c "$(curl -fsSL https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
    -p git \
    -p fzf \
    -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
    -a "source /usr/share/doc/fzf/examples/completion.zsh" \
    -a "export HISTFILE=/commandhistory/.zsh_history" \
    -x

WORKDIR /workspace

ENV HISTFILE=/commandhistory/.zsh_history
ENV SHELL=/bin/zsh
ENV PATH="/home/node/.bun/bin:/home/node/.local/bin:$PATH"

CMD ["zsh"]
