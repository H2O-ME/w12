apps.copilot.initCopilot = () => {
    // 初始化聊天界面
    apps.copilot.chat = $('#win-copilot>.chat')[0];
    apps.copilot.input = $('#win-copilot>.inputbox>.input');
    apps.copilot.send = $('#win-copilot>.inputbox>.send');
    
    // 绑定发送消息事件
    apps.copilot.input.on('keydown', (e) => {
        if(e.keyCode === 13) {
            apps.copilot.sendMessage();
        }
    });
    
    apps.copilot.send.on('click', () => {
        apps.copilot.sendMessage();
    });
};

apps.copilot.sendMessage = async () => {
    const input = apps.copilot.input;
    const msg = input.val().trim();
    if(!msg) return;
    
    // 添加用户消息
    apps.copilot.addMessage('user', msg);
    input.val('');
    
    try {
        // 调用 Cloudflare AI
        const response = await fetch('你的Cloudflare Worker URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{
                    role: 'user',
                    content: msg
                }]
            })
        });
        
        const data = await response.json();
        // 添加 AI 回复
        apps.copilot.addMessage('ai', data.tasks[0].response.response);
        
    } catch(err) {
        apps.copilot.addMessage('system', '发生错误: ' + err.message);
    }
};

apps.copilot.addMessage = (type, content) => {
    const chat = apps.copilot.chat;
    const line = document.createElement('div');
    line.className = `line ${type}`;
    line.innerHTML = `<div class="text">${content}</div>`;
    chat.appendChild(line);
    chat.scrollTop = chat.scrollHeight;
}; 