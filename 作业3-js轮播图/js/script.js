document.addEventListener('DOMContentLoaded', () => {
    // 导航栏元素
    const navItems = document.querySelectorAll('.nav-item');
    const bgElement = document.getElementById('background');
    const indicator = document.querySelector('.nav-indicator');
    const descText = document.getElementById('description-text');
    const cardTitle = document.getElementById('card-title');

    // 卡片标题
    const cardTitles = [
        "梦的联结",
        "孤身的奔赴",
        "错位的真相",
        "交错的拯救",
        "茫茫人海中的重逢"
    ];

    // 描述文案
    const textContent = [
        "东京少年泷与乡间少女三叶，某日起在梦境中不定期互换身体。他们用手机日记沟通，以对方的身份体验截然不同的人生，从慌乱到默契，对彼此产生了模糊而深刻的情感联结。",
        "互换停止后，强烈的好奇与思念驱使三叶独自乘上前往东京的列车。她在拥挤都市中寻觅，终于在地铁上与泷相遇，却震惊地发现对方并不认识自己。她黯然留下发绳后离去，而泷手中缠绕的绳结，将成为未来唯一的信物。",
        "三年后的泷，凭着记忆中的风景与掌心的绳结找到系守町，面对的却是已毁灭的废墟与三叶的逝者名单。他前往神体饮下口嚼酒，终于在\"黄昏之时\"穿越时空，与三年前的三叶重逢。两人在手心写下约定，决心扭转悲剧。",
        "两人制定计划后，三叶在自己的时空里拼尽全力说服镇长父亲，最终成功疏散全镇，改写了历史。却也因时间修正而失去了对彼此的记忆。",
        "彗星坠落，抹去了二人的记忆,却抹不去二人对彼此的情感。八年后，已成年的泷与三叶在东京各自生活，却总感到在寻找什么。无数次地铁中的擦肩而过后，他们终于在阶梯上驻足回首，同时问出：\"你的名字是？\""
    ];

    // ========== 3D 轮播图功能 ==========
    const carouselAxis = document.querySelector('.carousel-axis');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    // 为每个导航项保存独立的轮播图状态
    const carouselStates = {};
    let currentNavIndex = 0;
    const totalItems = 5; // 每组5张图片
    const angleStep = 360 / totalItems; // 每张图片的角度间隔（72度）
    
    // 自动切换相关变量
    let autoPlayTimer = null;
    const autoPlayInterval = 2000; // 2秒自动切换

    // 初始化每个导航项的轮播图状态
    navItems.forEach((item, index) => {
        carouselStates[index] = {
            currentIndex: 0,
            images: []
        };
    });

    // 轮播图的图片
    function CarouselImages(navIndex) {
        const carouselData = navItems[navIndex].getAttribute('data-carousel');
        if (!carouselData) return;
        
        try {
            const images = JSON.parse(carouselData);
            carouselStates[navIndex].images = images;
            
            // 轮播图项的图片源
            carouselItems.forEach((item, index) => {
                if (images[index]) {
                    const img = item.querySelector('img');
                    if (img) {
                        img.src = images[index];
                        img.alt = `Img${index + 1}`;
                    }
                }
            });
            
            // 设置轮播图显示位置
            angle_Carousel();
        } catch (e) {
            console.error('解析轮播图数据失败:', e);
        }
    }

    // 创建指示器
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalItems; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    // 更新轮播图旋转角度
    function angle_Carousel() {
        const state = carouselStates[currentNavIndex];
        // 使用currentIndex直接计算旋转角度，实现连续旋转（首尾连接）
        const rotation = -state.currentIndex * angleStep;
        carouselAxis.style.transform = `rotateY(${rotation}deg)`;
        
        // 显示当前图片索引（用于指示器和图片更新）
        const displayIndex = ((state.currentIndex % totalItems) + totalItems) % totalItems;
        
        // 更新指示器状态
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === displayIndex);
        });

        // 更新图片亮度：让两侧图片变暗应该变暗
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            // 每个图片的初始角度
            const initialAngle = index * angleStep; // 0, 72, 144, 216, 288
            // 当前图片的角度（考虑旋转）
            const currentAngle = (initialAngle + rotation) % 360;
            // 将角度标准化到 -180 到 180 度范围
            let normalizedAngle = currentAngle;
            if (normalizedAngle > 180) {
                normalizedAngle = normalizedAngle - 360;
            } else if (normalizedAngle < -180) {
                normalizedAngle = normalizedAngle + 360;
            }
            
            // 如果角度在 -36 到 36 度范围内（正前方），保持亮度，否则变暗
            if (Math.abs(normalizedAngle) <= 36) {
                item.classList.remove('dimmed');
            } else {
                item.classList.add('dimmed');
            }
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        const state = carouselStates[currentNavIndex];
        // 计算最接近目标索引的 currentIndex 值，保持旋转方向一致
        const currentDisplayIndex = ((state.currentIndex % totalItems) + totalItems) % totalItems;
        const diff = index - currentDisplayIndex;
        state.currentIndex = state.currentIndex + diff;
        angle_Carousel();
        // 重置自动播放定时器
        resetAutoPlay();
    }

    // 上一张
    function prevSlide() {
        const state = carouselStates[currentNavIndex];
        // 直接减1，不取模，实现连续反向旋转
        state.currentIndex = state.currentIndex - 1;
        angle_Carousel();
        // 重置自动播放定时器
        resetAutoPlay();
    }

    // 下一张
    function nextSlide() {
        const state = carouselStates[currentNavIndex];
        // 直接加1，不取模，实现连续正向旋转（首尾连接）
        state.currentIndex = state.currentIndex + 1;
        angle_Carousel();
        // 重置自动播放定时器
        resetAutoPlay();
    }
    
    // 启动自动播放
    function startAutoPlay() {
        stopAutoPlay(); // 先清除已有的定时器
        autoPlayTimer = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }
    
    // 重置自动播放（用于手动切换后重新计时）
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 更新指示器位置（仅位置，不改变激活状态，不发光）
    function IndicatorPosition(index) {
        const rect = navItems[index].getBoundingClientRect();
        const parentRect = navItems[index].parentElement.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - parentRect.left}px`;
        // 悬浮时不发光
        indicator.classList.remove('active');
    }

    // 更新导航状态
    function Nav(index) {
        // 更新激活状态
        navItems.forEach(item => item.classList.remove('active'));
        navItems[index].classList.add('active');

        // 设置指示器平滑滑动并添加发光效果
        const rect = navItems[index].getBoundingClientRect();
        const parentRect = navItems[index].parentElement.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - parentRect.left}px`;
        // 点击激活时发光
        indicator.classList.add('active');

        // 切换背景图（平滑过渡）
        const bgUrl = navItems[index].getAttribute('data-bg');
        if (bgUrl) {
            bgElement.style.opacity = 0;
            setTimeout(() => {
                bgElement.style.backgroundImage = `url('${bgUrl}')`;
                bgElement.style.opacity = 1;
            }, 20);
        }

        // 切换卡片标题
        if (cardTitle) {
            cardTitle.style.opacity = 0;
            setTimeout(() => {
                cardTitle.textContent = cardTitles[index];
                cardTitle.style.opacity = 1;
            }, 50);
        }

        // 切换描述文字（淡入淡出）
        descText.style.opacity = 0;
        setTimeout(() => {
            descText.textContent = textContent[index];
            descText.style.opacity = 1;
            // 重新初始化下划线效果
            if (descriptionText) {
                wrapTextInSpans(descriptionText);
            }
        }, 50);

        // 切换轮播图
        currentNavIndex = index;
        // 重置为第一张图片（currentIndex = 0）
        carouselStates[index].currentIndex = 0;
        CarouselImages(index);
        angle_Carousel();
        // 重置自动播放
        resetAutoPlay();
    }

    // 绑定轮播图控制事件
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // 初始化
    setTimeout(() => {
        const firstBg = navItems[0].getAttribute('data-bg');
        if (firstBg) {
            bgElement.style.backgroundImage = `url('${firstBg}')`;
        }
        
        // 初始化轮播图
        if (indicatorsContainer) {
            createIndicators();
        }
        
        Nav(0);
        
        // 启动自动播放
        startAutoPlay();
    }, 100);
    
    // 轮播图容器悬停事件：暂停/恢复自动播放
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }

    // 绑定点击事件和悬浮事件
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => Nav(index));
        
        // 鼠标悬浮时，平滑移动指示器到当前项
        item.addEventListener('mouseenter', () => {
            IndicatorPosition(index);
        });
    });

    // 当鼠标离开导航栏时，恢复指示器到当前激活项的位置并恢复发光
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.addEventListener('mouseleave', () => {
            const activeItem = document.querySelector('.nav-item.active');
            if (activeItem) {
                const activeIndex = parseInt(activeItem.getAttribute('data-index'));
                const rect = navItems[activeIndex].getBoundingClientRect();
                const parentRect = navItems[activeIndex].parentElement.getBoundingClientRect();
                indicator.style.width = `${rect.width}px`;
                indicator.style.left = `${rect.left - parentRect.left}px`;
                // 激活项的发光效果
                indicator.classList.add('active');
            }
        });
    }

    // 窗口大小变化时重新校准
    window.addEventListener('resize', () => {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            const index = parseInt(activeItem.getAttribute('data-index'));
            Nav(index);
        }
    });

    // ========== 文本悬停下划线效果 ==========
    const descriptionText = document.getElementById('description-text');
    
    // 将文本拆分成单个字符，每个字符用span包裹
    function wrapTextInSpans(element) {
        const text = element.textContent;
        let html = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === ' ') {
                html += '<span class="char-span space-char" data-index="' + i + '">&nbsp;</span>';
            } else if (char === '\n') {
                html += '<span class="char-span newline-char" data-index="' + i + '"><br></span>';
            } else {
                // 转义HTML特殊字符
                let escapedChar = char;
                if (char === '<') escapedChar = '&lt;';
                else if (char === '>') escapedChar = '&gt;';
                else if (char === '&') escapedChar = '&amp;';
                html += '<span class="char-span" data-index="' + i + '">' + escapedChar + '</span>';
            }
        }
        element.innerHTML = html;
    }

    // 处理鼠标移动事件
    function handleMouseMove(element, e) {
        const spans = element.querySelectorAll('.char-span');
        if (spans.length === 0) return;
        
        // 获取鼠标相对于段落的坐标
        const rect = element.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 找到鼠标位置附近的字符
        let hoveredIndex = -1;
        let minDistance = Infinity;
        
        spans.forEach((span) => {
            const spanRect = span.getBoundingClientRect();
            const spanLeft = spanRect.left - rect.left;
            const spanTop = spanRect.top - rect.top;
            const spanWidth = spanRect.width || 5;
            const spanHeight = spanRect.height || 20;
            
            // 计算鼠标到字符中心的距离
            const centerX = spanLeft + spanWidth / 2;
            const centerY = spanTop + spanHeight / 2;
            const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
            
            // 如果鼠标在字符范围内，或者距离很近
            if ((mouseX >= spanLeft && mouseX <= spanLeft + spanWidth &&
                mouseY >= spanTop && mouseY <= spanTop + spanHeight) || distance < 30) {
                const index = parseInt(span.getAttribute('data-index'));
                if (distance < minDistance) {
                    minDistance = distance;
                    hoveredIndex = index;
                }
            }
        });
        
        // 如果找到了鼠标所在的字符，显示附近4个字符的下划线
        if (hoveredIndex >= 0) {
            showUnderlines(element, hoveredIndex, 4);
        } else {
            clearUnderlines(element);
        }
    }

    // 显示指定索引附近指定数量字符的下划线
    function showUnderlines(element, centerIndex, count) {
        const spans = element.querySelectorAll('.char-span');
        const halfCount = Math.floor(count / 2);
        const startIndex = Math.max(0, centerIndex - halfCount);
        const endIndex = Math.min(spans.length - 1, centerIndex + halfCount);
        
        // 清除所有下划线
        spans.forEach(span => span.classList.remove('underlined'));
        
        // 添加下划线
        spans.forEach((span) => {
            const index = parseInt(span.getAttribute('data-index'));
            if (index >= startIndex && index <= endIndex) {
                span.classList.add('underlined');
            }
        });
    }

    // 清除所有下划线
    function clearUnderlines(element) {
        const spans = element.querySelectorAll('.char-span');
        spans.forEach(span => span.classList.remove('underlined'));
    }

    // 初始化文本悬停下划线效果
    if (descriptionText) {
        // 等待文本内容加载后再初始化
        setTimeout(() => {
            wrapTextInSpans(descriptionText);
            
            // 绑定鼠标移动事件
            descriptionText.addEventListener('mousemove', (e) => {
                handleMouseMove(descriptionText, e);
            });
            
            descriptionText.addEventListener('mouseleave', () => {
                clearUnderlines(descriptionText);
            });
        }, 200);
    }

    // ========== 音乐控制功能 ==========
    const musicBtn = document.getElementById('music-btn');
    // 因版权问题未获取原电影音乐，暂时注释掉音乐相关代码
    // const backgroundMusic = document.getElementById('background-music');
    let isPlaying = false;

    if (musicBtn) {
        // 点击音乐按钮切换发光和旋转状态
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                // 移除发光和旋转效果
                musicBtn.classList.remove('playing');
                isPlaying = false;
            } else {
                // 添加发光和旋转效果
                musicBtn.classList.add('playing');
                isPlaying = true;
            }
        });

        // 暂时注释掉音乐播放相关代码
        /*
        if (backgroundMusic) {
            // 点击音乐按钮切换播放/暂停
            musicBtn.addEventListener('click', () => {
                if (isPlaying) {
                    // 暂停音乐并移除发光效果
                    backgroundMusic.pause();
                    musicBtn.classList.remove('playing');
                    isPlaying = false;
                } else {
                    // 播放音乐并添加发光效果
                    backgroundMusic.play().then(() => {
                        musicBtn.classList.add('playing');
                        isPlaying = true;
                    }).catch((error) => {
                        console.error('播放音乐失败:', error);
                        // 如果音频路径未设置，提示用户
                        if (backgroundMusic.src === '' || !backgroundMusic.src) {
                            console.warn('请先设置音频文件路径');
                        }
                    });
                }
            });

            // 监听音频结束事件，实现循环播放（虽然已经设置了loop属性，但这里作为备用）
            backgroundMusic.addEventListener('ended', () => {
                backgroundMusic.currentTime = 0;
                backgroundMusic.play();
            });

            // 确保音频循环播放
            backgroundMusic.loop = true;
        }
        */
    }
});