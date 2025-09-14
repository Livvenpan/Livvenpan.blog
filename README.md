# Livvenpan's Blog

一个基于Jekyll的个人技术博客，具有现代化的设计和响应式布局。

## 功能特性

- 🎨 现代化设计，渐变背景和卡片式布局
- 📱 完全响应式，支持移动端和桌面端
- 🧭 完整的导航栏和页脚
- 📝 文章归档和标签系统
- 🔍 SEO优化
- 📡 RSS订阅支持
- 💬 评论系统支持

## 项目结构

```
Livvenpan.blog/
├── _config.yml          # Jekyll配置文件
├── _layouts/            # 布局模板
│   ├── default.html     # 默认布局
│   └── page.html        # 页面布局
├── _includes/           # 可重用组件
│   ├── head.html        # 头部组件
│   ├── navbar.html      # 导航栏组件
│   ├── footer.html      # 页脚组件
│   └── comment.html     # 评论组件
├── _posts/              # 博客文章
├── assets/              # 静态资源
│   ├── css/             # 样式文件
│   └── images/          # 图片资源
├── about.md             # 关于页面
├── archive.md           # 归档页面
├── contact.md           # 联系页面
└── index.md             # 首页
```

## 快速开始

### 1. 安装依赖

# 安装Ruby+Devkit

https://rubyinstaller.org/downloads/

```bash
# 安装Ruby和Jekyll
gem install jekyll bundler

# 安装项目依赖
bundle install
```

### 2. 本地运行

```bash
# 启动Jekyll服务器
bundle exec jekyll serve

# 或者使用简写
bundle exec jekyll s
```

访问 `http://localhost:4000` 查看博客。

### 3. 自定义配置

编辑 `_config.yml` 文件来自定义博客信息：

```yaml
# 网站基本信息
title: 你的博客标题
description: 博客描述
author:
  name: 你的名字
  email: 你的邮箱
  bio: 个人简介
```

### 4. 添加背景图片

将你的背景图片命名为 `background.jpg` 并放在 `assets/images/` 目录下。

## 写文章

在 `_posts/` 目录下创建Markdown文件，文件名格式为：`YYYY-MM-DD-文章标题.md`

文章头部需要包含front matter：

```markdown
---
layout: default
title: 文章标题
date: 2025-01-01
tags: [标签1, 标签2]
excerpt: 文章摘要
---

文章内容...
```

## 部署

### GitHub Pages

1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支为main
4. 等待部署完成

### 其他平台

```bash
# 构建静态文件
bundle exec jekyll build

# 生成的文件在_site目录中
```

## 自定义样式

主要样式文件位于 `assets/css/main.css`，你可以根据需要修改：

- 颜色主题
- 字体设置
- 布局样式
- 响应式断点

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！
