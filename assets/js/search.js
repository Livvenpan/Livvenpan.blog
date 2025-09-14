// 博客搜索功能
class BlogSearch {
    constructor() {
        this.searchData = [];
        this.searchIndex = null;
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        await this.loadSearchData();
        this.createSearchUI();
        this.bindEvents();
        this.isInitialized = true;
    }
    
    async loadSearchData() {
        try {
            // 首先尝试从JSON文件加载数据
            const response = await fetch('/assets/data/search.json');
            if (response.ok) {
                this.searchData = await response.json();
                console.log('从JSON文件加载搜索数据:', this.searchData.length, '篇文章');
            } else {
                // 如果JSON文件不存在，从页面中提取数据
                this.searchData = this.extractPostData();
                console.log('从页面提取搜索数据:', this.searchData.length, '篇文章');
            }
        } catch (error) {
            console.error('加载搜索数据失败，使用页面数据:', error);
            // 如果加载失败，从页面中提取数据
            this.searchData = this.extractPostData();
        }
    }
    
    extractPostData() {
        const posts = [];
        
        // 从首页文章列表中提取数据
        const postItems = document.querySelectorAll('.post-item');
        postItems.forEach((item, index) => {
            const titleElement = item.querySelector('.post-title a');
            const metaElement = item.querySelector('.post-meta');
            const excerptElement = item.querySelector('.post-excerpt');
            
            if (titleElement) {
                const post = {
                    id: `post-${index}`,
                    title: titleElement.textContent.trim(),
                    url: titleElement.href,
                    excerpt: excerptElement ? excerptElement.textContent.trim() : '',
                    date: metaElement ? metaElement.textContent.trim() : '',
                    tags: this.extractTags(metaElement),
                    content: this.getPostContent(titleElement.href)
                };
                posts.push(post);
            }
        });
        
        // 如果没有找到文章，尝试从其他页面提取
        if (posts.length === 0) {
            posts.push({
                id: 'current-page',
                title: document.title,
                url: window.location.href,
                excerpt: this.getPageExcerpt(),
                date: this.getPageDate(),
                tags: this.getPageTags(),
                content: this.getPageContent()
            });
        }
        
        return posts;
    }
    
    extractTags(metaElement) {
        if (!metaElement) return [];
        const tagElements = metaElement.querySelectorAll('.tag-badge');
        return Array.from(tagElements).map(tag => tag.textContent.trim());
    }
    
    getPostContent(url) {
        // 这里可以扩展为从服务器获取完整内容
        return '';
    }
    
    getPageExcerpt() {
        const excerptElement = document.querySelector('.post-excerpt, .page-description');
        return excerptElement ? excerptElement.textContent.trim() : '';
    }
    
    getPageDate() {
        const dateElement = document.querySelector('.post-meta');
        return dateElement ? dateElement.textContent.trim() : '';
    }
    
    getPageTags() {
        const tagElements = document.querySelectorAll('.tag-badge');
        return Array.from(tagElements).map(tag => tag.textContent.trim());
    }
    
    getPageContent() {
        const contentElement = document.querySelector('.post-body, .page-content, .tags-content, .archive-content');
        return contentElement ? contentElement.textContent.trim() : '';
    }
    
    createSearchUI() {
        // 创建搜索按钮
        const searchBtn = document.createElement('button');
        searchBtn.id = 'search-btn';
        searchBtn.innerHTML = '🔍';
        searchBtn.title = '搜索文章';
        searchBtn.className = 'search-button';
        document.body.appendChild(searchBtn);
        
        // 创建搜索面板
        const searchPanel = document.createElement('div');
        searchPanel.id = 'search-panel';
        searchPanel.className = 'search-panel';
        searchPanel.innerHTML = `
            <div class="search-header">
                <h3>搜索文章</h3>
                <button id="close-search" class="close-search">×</button>
            </div>
            <div class="search-input-container">
                <input type="text" id="search-input" placeholder="输入关键词搜索文章..." autocomplete="off">
                <div class="search-suggestions" id="search-suggestions"></div>
            </div>
            <div class="search-results" id="search-results"></div>
            <div class="search-footer">
                <div class="search-stats" id="search-stats"></div>
            </div>
        `;
        document.body.appendChild(searchPanel);
        
        // 创建搜索遮罩
        const searchOverlay = document.createElement('div');
        searchOverlay.id = 'search-overlay';
        searchOverlay.className = 'search-overlay';
        document.body.appendChild(searchOverlay);
    }
    
    bindEvents() {
        const searchBtn = document.getElementById('search-btn');
        const searchPanel = document.getElementById('search-panel');
        const searchInput = document.getElementById('search-input');
        const closeBtn = document.getElementById('close-search');
        const overlay = document.getElementById('search-overlay');
        
        // 打开搜索面板
        searchBtn.addEventListener('click', () => {
            this.openSearch();
        });
        
        // 关闭搜索面板
        closeBtn.addEventListener('click', () => {
            this.closeSearch();
        });
        
        overlay.addEventListener('click', () => {
            this.closeSearch();
        });
        
        // 搜索输入
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
        
        // 键盘事件
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
        
        // 全局快捷键 Ctrl+K 或 Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });
    }
    
    openSearch() {
        const panel = document.getElementById('search-panel');
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        panel.classList.add('show');
        overlay.classList.add('show');
        input.focus();
        
        // 清空之前的结果
        this.clearResults();
    }
    
    closeSearch() {
        const panel = document.getElementById('search-panel');
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        panel.classList.remove('show');
        overlay.classList.remove('show');
        input.value = '';
        this.clearResults();
    }
    
    performSearch(query) {
        if (!query.trim()) {
            this.clearResults();
            return;
        }
        
        const results = this.searchPosts(query);
        this.displayResults(results, query);
    }
    
    searchPosts(query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        const results = [];
        
        this.searchData.forEach(post => {
            let score = 0;
            const searchableText = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
            
            // 计算匹配分数
            searchTerms.forEach(term => {
                // 标题匹配权重最高
                if (post.title.toLowerCase().includes(term)) {
                    score += 10;
                }
                // 标签匹配权重较高
                if (post.tags.some(tag => tag.toLowerCase().includes(term))) {
                    score += 8;
                }
                // 摘要匹配权重中等
                if (post.excerpt.toLowerCase().includes(term)) {
                    score += 5;
                }
                // 内容匹配权重较低
                if (post.content.toLowerCase().includes(term)) {
                    score += 2;
                }
            });
            
            if (score > 0) {
                results.push({ ...post, score });
            }
        });
        
        // 按分数排序
        return results.sort((a, b) => b.score - a.score);
    }
    
    displayResults(results, query) {
        const resultsContainer = document.getElementById('search-results');
        const statsContainer = document.getElementById('search-stats');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">没有找到相关文章</div>
                    <div class="no-results-suggestion">尝试使用其他关键词</div>
                </div>
            `;
            statsContainer.textContent = '';
            return;
        }
        
        // 显示统计信息
        statsContainer.textContent = `找到 ${results.length} 篇相关文章`;
        
        // 显示搜索结果
        resultsContainer.innerHTML = results.map(post => `
            <div class="search-result-item" data-url="${post.url}">
                <div class="result-header">
                    <h4 class="result-title">${this.highlightText(post.title, query)}</h4>
                    <div class="result-meta">
                        ${post.date ? `<span class="result-date">${post.date}</span>` : ''}
                        ${post.tags.length > 0 ? `<span class="result-tags">${post.tags.map(tag => `<span class="result-tag">${tag}</span>`).join('')}</span>` : ''}
                    </div>
                </div>
                ${post.excerpt ? `<div class="result-excerpt">${this.highlightText(post.excerpt, query)}</div>` : ''}
            </div>
        `).join('');
        
        // 绑定点击事件
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                if (url) {
                    window.location.href = url;
                    this.closeSearch();
                }
            });
        });
    }
    
    highlightText(text, query) {
        if (!query.trim()) return text;
        
        const terms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        let highlightedText = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }
    
    clearResults() {
        const resultsContainer = document.getElementById('search-results');
        const statsContainer = document.getElementById('search-stats');
        
        resultsContainer.innerHTML = '';
        statsContainer.textContent = '';
    }
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
    window.blogSearch = new BlogSearch();
});
