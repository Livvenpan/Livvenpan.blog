---
layout: default
title: 首页
---

<div class="home-hero">
    <h1>欢迎来到 {{ site.title }}</h1>
    <p>{{ site.description }}</p>
</div>

<section class="recent-posts">
    <h2>最新文章</h2>

    {% if site.posts.size > 0 %}
        <ul class="post-list">
            {% for post in site.posts limit:5 %}
            <li class="post-item">
                <h3 class="post-title">
                    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                </h3>
                <div class="post-meta">
                    {{ post.date | date: "%Y年%m月%d日" }}
                    {% if post.tags.size > 0 %}
                    · 标签：{{ post.tags | join: ', ' }}
                    {% endif %}
                </div>
                {% if post.excerpt %}
                <div class="post-excerpt">
                    {{ post.excerpt | strip_html | truncate: 200 }}
                </div>
                {% endif %}
            </li>
            {% endfor %}
        </ul>
        
        {% if site.posts.size > 5 %}
        <div style="text-align: center; margin-top: 2rem;">
            <a href="{{ '/archive' | relative_url }}" class="btn">查看所有文章</a>
        </div>
        {% endif %}
    {% else %}
        <p>暂无文章，敬请期待！</p>
    {% endif %}

</section>
