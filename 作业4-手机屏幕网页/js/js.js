/* ============================================
   开屏动画控制函数
   功能：实现3秒倒计时，支持手动跳过
   ============================================ */

/**
 * 初始化开屏动画
 * 实现倒计时功能，3秒后自动隐藏，或点击跳过按钮提前关闭
 */
function initSplash() {
    // 获取DOM元素
    const splash = document.getElementById('splashScreen');  // 开屏层容器
    const countdownNum = document.getElementById('countdownNum');  // 倒计时数字显示
    const skipBtn = document.getElementById('skipBtn');  // 跳过按钮
    
    // 如果开屏层不存在，直接返回
    if (!splash) return;
    
    let count = 3;  // 倒计时初始值
    let timer = null;  // 定时器变量
    
    /**
     * 更新倒计时数字
     * 每秒更新一次，倒计时到0时自动隐藏开屏层
     */
    function updateCountdown() {
        countdownNum.textContent = count;  // 更新显示的数字
        count--;  // 递减
        
        // 倒计时结束，隐藏开屏层
        if (count < 0) {
            hideSplash();
        }
    }
    
    /**
     * 隐藏开屏层
     * 添加hide类触发CSS淡出动画，500ms后完全隐藏
     */
    function hideSplash() {
        // 清除定时器，避免重复执行
        if (timer) {
            clearInterval(timer);
        }
        // 添加hide类，触发CSS淡出动画
        splash.classList.add('hide');
        // 500ms后完全隐藏（等待动画完成）
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);
    }
    
    // 开始倒计时：每秒执行一次updateCountdown
    timer = setInterval(updateCountdown, 1000);
    
    // 点击跳过按钮：立即隐藏开屏层
    skipBtn.addEventListener('click', hideSplash);
    
    // 3秒后自动隐藏：作为备用方案，确保即使倒计时有问题也能隐藏
    setTimeout(hideSplash, 3000);
}

/* ============================================
   页面加载完成后执行的主函数
   功能：初始化所有交互功能
   ============================================ */

// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 先初始化开屏动画
    initSplash();
    
    /* ============================================
       底部菜单交互功能
       功能：点击菜单项时切换激活状态
       ============================================ */
    const menus = document.querySelectorAll('.menu-item');
    menus.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();  // 阻止默认跳转行为
            // 移除所有菜单项的active类
            menus.forEach(i => i.classList.remove('active'));
            // 给当前点击的菜单项添加active类
            this.classList.add('active');
        });
    });
    
    /* ============================================
       顶部导航菜单交互功能
       功能：点击导航项时切换激活状态
       ============================================ */
    const navs = document.querySelectorAll('.nav-item');
    navs.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有导航项的active类
            navs.forEach(i => i.classList.remove('active'));
            // 给当前点击的导航项添加active类
            this.classList.add('active');
        });
    });
    
    /* ============================================
       建筑展示区域拖拽滚动功能
       功能：支持鼠标拖拽和触摸滑动，实现横向滚动
       ============================================ */
    const slider = document.querySelector('.building-slider');
    let dragging = false;  // 是否正在拖拽
    let startPos;  // 拖拽开始时的鼠标/触摸位置
    let scrollPos;  // 拖拽开始时的滚动位置
    
    if (slider) {
        /* ---------- 桌面端鼠标拖拽事件 ---------- */
        // 鼠标按下：开始拖拽
        slider.addEventListener('mousedown', (e) => {
            dragging = true;
            slider.classList.add('active');  // 添加active类，可用于样式反馈
            startPos = e.pageX - slider.offsetLeft;  // 记录起始X坐标
            scrollPos = slider.scrollLeft;  // 记录起始滚动位置
        });
        
        // 鼠标离开：结束拖拽
        slider.addEventListener('mouseleave', () => {
            dragging = false;
            slider.classList.remove('active');
        });
        
        // 鼠标释放：结束拖拽
        slider.addEventListener('mouseup', () => {
            dragging = false;
            slider.classList.remove('active');
        });
        
        // 鼠标移动：执行滚动
        slider.addEventListener('mousemove', (e) => {
            if(!dragging) return;  // 如果不在拖拽状态，直接返回
            e.preventDefault();  // 阻止默认行为
            const x = e.pageX - slider.offsetLeft;  // 当前鼠标X坐标
            const move = (x - startPos) * 2;  // 计算移动距离（乘以2增加灵敏度）
            slider.scrollLeft = scrollPos - move;  // 更新滚动位置
        });
        
        /* ---------- 移动端触摸滑动事件 ---------- */
        // 触摸开始：开始滑动
        slider.addEventListener('touchstart', (e) => {
            dragging = true;
            slider.classList.add('active');
            startPos = e.touches[0].pageX - slider.offsetLeft;  // 获取第一个触摸点的X坐标
            scrollPos = slider.scrollLeft;
        });
        
        // 触摸结束：结束滑动
        slider.addEventListener('touchend', () => {
            dragging = false;
            slider.classList.remove('active');
        });
        
        // 触摸移动：执行滚动
        slider.addEventListener('touchmove', (e) => {
            if(!dragging) return;
            e.preventDefault();  // 阻止默认滚动行为
            const x = e.touches[0].pageX - slider.offsetLeft;
            const move = (x - startPos) * 2;
            slider.scrollLeft = scrollPos - move;
        });
    }
    
    /* ============================================
       滚动动画功能（Intersection Observer API）
       功能：当卡片进入视口时触发淡入上浮动画
       ============================================ */
    // Intersection Observer配置
    const obConfig = {
        threshold: 0.05,  // 当元素5%进入视口时触发
        rootMargin: '0px'  // 不扩展根边距
    };
    
    // 创建Intersection Observer实例
    const ob = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口：应用淡入上浮动画
                entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                entry.target.style.opacity = '1';  // 显示
                entry.target.style.transform = 'translateY(0)';  // 上浮到正常位置
            } else {
                // 元素离开视口：立即重置状态（无过渡），确保下次进入时能再次触发动画
                entry.target.style.transition = 'none';  // 无过渡，立即重置
                entry.target.style.opacity = '0';  // 隐藏
                entry.target.style.transform = 'translateY(20px)';  // 下移20px，准备上浮动画
            }
        });
    }, obConfig);
    
    // 监听所有卡片元素：活动卡片、特色卡片、建筑卡片
    document.querySelectorAll('.activity-card, .feature-card, .building-card').forEach(card => {
        // 设置初始隐藏状态：透明且下移20px
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        // 开始观察该元素
        ob.observe(card);
    });
    
    /* ============================================
       活动按钮点击反馈功能
       功能：点击按钮时提供视觉反馈和提示
       ============================================ */
    const btns = document.querySelectorAll('.activity-button');
    btns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();  // 阻止默认跳转
            
            // 点击反馈：按钮缩小到95%，150ms后恢复
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // 获取活动标题：从最近的.activity-content容器中查找标题
            const title = this.closest('.activity-content').querySelector('.activity-title').textContent;
            console.log(`点击了活动：${title}`);
            
            // 弹出提示：显示活动处理信息
            alert(`已为您处理活动：${title}`);
        });
    });
    
    /* ============================================
       用户头像点击反馈功能
       功能：点击头像时提供视觉反馈
       ============================================ */
    const user = document.querySelector('.user-profile');
    if (user) {
        user.addEventListener('click', function() {
            // 点击反馈：头像缩小到90%，150ms后恢复
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            console.log('点击了个人资料');
        });
    }
    
    // 页面初始化完成
    console.log('页面加载完成');
});