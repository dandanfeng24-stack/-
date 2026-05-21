
async function loadResources() {
  const box = document.querySelector("#resources");
  try {
    const response = await fetch("./data/resources.json");
    const resources = await response.json();
    box.innerHTML = "";
    resources.forEach(res => {
      const card = document.createElement("article");
      card.className = "panel-card";
      card.innerHTML = `
        <span class="tag">${escapeHTML(res.type)}</span>
        <h2>${escapeHTML(res.title)}</h2>
        <p style="color:var(--muted);line-height:1.7;">${escapeHTML(res.description)}</p>
        <button class="primary-btn" data-download="${escapeHTML(res.id)}">领取资料</button>
      `;
      box.appendChild(card);
    });
    document.addEventListener("click", e => {
      const id = e.target.getAttribute("data-download");
      if (!id) return;
      const res = resources.find(r => r.id === id);
      if (!res) return;
      const user = requireLogin();
      if (!user) return;
      recordDownload(res);
      alert(`已记录领取：${res.title}\n\n原型版不提供真实文件下载。正式版可接入文件下载、邮箱发送或微信资料分发。`);
    });
  } catch(err) {
    box.innerHTML = `<div class="empty-state"><p>资料数据加载失败：${escapeHTML(err.message)}</p></div>`;
  }
}
loadResources();
