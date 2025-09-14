---
layout: archive
title: 文章归档
permalink: /archive/
---

{% for post in site.posts %} {% assign currentdate = post.date | date: "%Y" %}
{% if currentdate != date %} {% unless forloop.first %}</ul></div>{% endunless
%}

<div class="archive-year">
<h2>{{ currentdate }}年</h2>
<ul class="archive-list"> {% assign date = currentdate %} {% endif %}
<li>
<a href="{{ post.url | relative_url }}">{{ post.title }}</a>
<span class="post-date">{{ post.date | date: "%m月%d日" }}</span>
</li> {% if forloop.last %}</ul></div>{% endif %} {% endfor %}
