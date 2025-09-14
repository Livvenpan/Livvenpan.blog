---
layout: tags
title: 标签云
permalink: /tags/
---

{% assign sorted_tags = site.tags | sort %}

<div class="tags-container">
    {% for tag in sorted_tags %}
        {% assign tag_name = tag[0] %}
        {% assign tag_posts = tag[1] %}

        <div class="tag-group">
            <h2 class="tag-name">
                <a href="#{{ tag_name | slugify }}" class="tag-link">{{ tag_name }}</a>
                <span class="tag-count">({{ tag_posts.size }})</span>
            </h2>
            
            <ul class="tag-posts">
                {% for post in tag_posts %}
                <li class="tag-post-item">
                    <a href="{{ post.url | relative_url }}" class="tag-post-link">
                        {{ post.title }}
                    </a>
                    <span class="tag-post-date">{{ post.date | date: "%Y年%m月%d日" }}</span>
                </li>
                {% endfor %}
            </ul>
        </div>
    {% endfor %}

</div>

{% if site.tags.size == 0 %}

<p>暂无标签，敬请期待！</p> {% endif %}
