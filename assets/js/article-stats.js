(() => {
  const likeButton = document.querySelector('[data-article-like]');
  if (!likeButton) return;

  const viewsNode = document.querySelector('[data-article-views]');
  const likesNode = document.querySelector('[data-article-likes]');
  const labelNode = likeButton.querySelector('[data-like-label]');
  const articlePath = likeButton.dataset.articlePath || window.location.pathname;
  const shareSlug = likeButton.dataset.shareSlug;
  const likedKey = `sikanglab:liked:${articlePath}`;
  const cacheKey = `sikanglab:likes:${articlePath}`;
  const apiRoot = 'https://gateway-us.umami.is/api';
  const numberFormatter = new Intl.NumberFormat('zh-CN');

  let liked = false;
  let likes = 0;

  try {
    liked = window.localStorage.getItem(likedKey) === '1';
    likes = Number(window.localStorage.getItem(cacheKey)) || 0;
  } catch (_) {}

  const renderLikeState = () => {
    likeButton.classList.toggle('is-liked', liked);
    likeButton.setAttribute('aria-pressed', String(liked));
    likeButton.title = liked ? '已点赞' : '为本文点赞';
    if (labelNode) labelNode.textContent = liked ? 'Liked' : 'Like';
  };

  const renderLikes = value => {
    likes = Math.max(0, Number(value) || 0);
    if (likesNode) likesNode.textContent = numberFormatter.format(likes);
  };

  renderLikeState();
  renderLikes(likes);

  const loadStats = async () => {
    try {
      const shareResponse = await fetch(`${apiRoot}/share/${encodeURIComponent(shareSlug)}`, {
        credentials: 'omit',
      });
      if (!shareResponse.ok) throw new Error('Share configuration unavailable');
      const { websiteId, token } = await shareResponse.json();
      if (!websiteId || !token) throw new Error('Invalid share configuration');

      const headers = {
        'x-umami-share-token': token,
        'x-umami-share-context': '1',
      };
      const endAt = Date.now();
      const encodedPath = encodeURIComponent(articlePath);
      const statsUrl = `${apiRoot}/websites/${websiteId}/stats?startAt=0&endAt=${endAt}&path=${encodedPath}`;
      const eventsUrl = `${apiRoot}/websites/${websiteId}/metrics?startAt=0&endAt=${endAt}&type=event&path=${encodedPath}`;
      const [statsResponse, eventsResponse] = await Promise.all([
        fetch(statsUrl, { headers, credentials: 'omit' }),
        fetch(eventsUrl, { headers, credentials: 'omit' }),
      ]);
      if (!statsResponse.ok || !eventsResponse.ok) throw new Error('Stats unavailable');

      const stats = await statsResponse.json();
      const events = await eventsResponse.json();
      const remoteLikes = Array.isArray(events)
        ? Number(events.find(item => item.x === 'article_like')?.y) || 0
        : 0;

      if (viewsNode) viewsNode.textContent = numberFormatter.format(Number(stats.pageviews) || 0);
      renderLikes(Math.max(likes, remoteLikes));
      try { window.localStorage.setItem(cacheKey, String(likes)); } catch (_) {}
    } catch (_) {
      if (viewsNode) {
        viewsNode.textContent = '—';
        viewsNode.closest('.article-stat')?.setAttribute('title', '浏览量暂时不可用');
      }
    }
  };

  likeButton.addEventListener('click', () => {
    if (liked) return;
    liked = true;
    renderLikes(likes + 1);
    renderLikeState();
    try {
      window.localStorage.setItem(likedKey, '1');
      window.localStorage.setItem(cacheKey, String(likes));
    } catch (_) {}
    if (typeof window.umami?.track === 'function') {
      window.umami.track('article_like', { article: articlePath });
    }
  });

  loadStats();
})();
