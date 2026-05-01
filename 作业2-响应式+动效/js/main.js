// 轮播图功能对象（全局作用域）
var carousel = {
	currentIndex: 0,
	totalItems: 0,
	autoPlayTimer: null,
	
	init: function() {
		var $container = $('.carousel-container');
		if ($container.length === 0) return;
		
		var $items = $container.find('.carousel-item');
		this.totalItems = $items.length;

		
		// 创建指示器
		var $indicators = $container.find('.carousel-indicators');
		for (var i = 0; i < this.totalItems; i++) {
			var $indicator = $('<span></span>');
			if (i === 0) $indicator.addClass('active');
			$indicators.append($indicator);
		}
		
		// 绑定箭头点击事件
		$container.find('.carousel-prev').on('click', function() {
			carousel.prevSlide();
		});
		
		$container.find('.carousel-next').on('click', function() {
			carousel.nextSlide();
		});
		
		// 绑定指示器点击事件
		$indicators.find('span').on('click', function() {
			var index = $(this).index();
			carousel.goToSlide(index);
		});
		
		// 开始自动播放
		this.startAutoPlay();
		
		// 鼠标悬停时暂停自动播放
		$container.on('mouseenter', function() {
			carousel.stopAutoPlay();
		}).on('mouseleave', function() {
			carousel.startAutoPlay();
		});
	},
	
	goToSlide: function(index) {
		var $items = $('.carousel-container .carousel-item');
		var $indicators = $('.carousel-container .carousel-indicators span');
		
		$items.eq(this.currentIndex).removeClass('active');
		$indicators.eq(this.currentIndex).removeClass('active');
		
		this.currentIndex = index;
		
		$items.eq(this.currentIndex).addClass('active');
		$indicators.eq(this.currentIndex).addClass('active');
	},
	
	nextSlide: function() {
		var nextIndex = (this.currentIndex + 1) % this.totalItems;
		this.goToSlide(nextIndex);
	},
	
	prevSlide: function() {
		var prevIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
		this.goToSlide(prevIndex);
	},
	
	startAutoPlay: function() {
		var self = this;
		this.stopAutoPlay(); // 先清除之前的定时器
		this.autoPlayTimer = setInterval(function() {
			self.nextSlide();
		}, 3000); // 每3秒切换一次
	},
	
	stopAutoPlay: function() {
		if (this.autoPlayTimer) {
			clearInterval(this.autoPlayTimer);
			this.autoPlayTimer = null;
		}
	},
	
	setContainerHeight: function(img) {
		var $container = $('.carousel-container');
		var containerWidth = $container.width();
		var imgAspectRatio = img.naturalWidth / img.naturalHeight;
		var containerHeight = containerWidth / imgAspectRatio;
		$container.css('height', containerHeight + 'px');
	}
};

// 窗口大小改变事件
window.onresize = function() {
	var wit = $(window).width();
	var bl = wit / 1920;
	if (wit <= 1920) {
		$('.Warp').css('zoom', bl);
	}
	// 窗口大小改变时重新计算轮播容器高度（已禁用，使用CSS固定高度）
	// 如果需要自动计算高度，取消下面的注释
	/*
	var $container = $('.carousel-container');
	if ($container.length > 0) {
		var $firstImg = $container.find('.carousel-item').first().find('img');
		if ($firstImg.length > 0 && $firstImg[0].complete) {
			carousel.setContainerHeight($firstImg[0]);
		}
	}
	*/
};

// 导航按钮激活状态管理
var navigation = {
	init: function() {
		var self = this;
		// 获取所有导航链接
		var $navLinks = $('.header .nav ul li a');
		
		// 检查URL中的hash，设置对应的active状态
		var hash = window.location.hash;
		if (hash) {
			var section = hash.substring(1); // 去掉 # 号
			$navLinks.removeClass('active');
			$navLinks.filter('[data-section="' + section + '"]').addClass('active');
		} else {
			// 如果没有hash，默认激活第一个（HOME）
			$navLinks.first().addClass('active');
		}
		
		// 绑定点击事件
		$navLinks.on('click', function(e) {
			e.preventDefault();
			var $this = $(this);
			var section = $this.data('section');
			
			// 移除所有active状态
			$navLinks.removeClass('active');
			// 添加当前点击的active状态
			$this.addClass('active');
			
			// 更新URL hash（但不跳转）
			window.location.hash = section;
			
			// 滚动到页面顶部（因为是同一页）
			$('html, body').animate({
				scrollTop: 0
			}, 300);
		});
	}
};

// 文本悬停下划线效果 - 已注释，改用纯CSS实现
/*
var textHoverUnderline = {
	init: function() {
		var self = this;
		// 处理所有带有 hover-underline-text 类的段落
		$('.hover-underline-text').each(function() {
			self.wrapTextInSpans($(this));
		});
		
		// 绑定鼠标移动事件
		$('.hover-underline-text').on('mousemove', function(e) {
			self.handleMouseMove($(this), e);
		}).on('mouseleave', function() {
			self.clearUnderlines($(this));
		});
	},
	
	// 将文本拆分成单个字符，每个字符用span包裹
	wrapTextInSpans: function($p) {
		var text = $p.text();
		var html = '';
		
		for (var i = 0; i < text.length; i++) {
			var char = text[i];
			// 所有字符都用span包裹，包括空格和换行符
			if (char === ' ') {
				html += '<span class="char-span space-char" data-index="' + i + '">&nbsp;</span>';
			} else if (char === '\n') {
				html += '<span class="char-span newline-char" data-index="' + i + '"><br></span>';
			} else {
				// 转义HTML特殊字符
				var escapedChar = char;
				if (char === '<') escapedChar = '&lt;';
				else if (char === '>') escapedChar = '&gt;';
				else if (char === '&') escapedChar = '&amp;';
				html += '<span class="char-span" data-index="' + i + '">' + escapedChar + '</span>';
			}
		}
		$p.html(html);
	},
	
	// 处理鼠标移动事件
	handleMouseMove: function($p, e) {
		var $spans = $p.find('.char-span');
		if ($spans.length === 0) return;
		
		// 获取鼠标相对于段落的坐标
		var pOffset = $p.offset();
		var mouseX = e.pageX - pOffset.left;
		var mouseY = e.pageY - pOffset.top;
		
		// 找到鼠标位置附近的字符
		var hoveredIndex = -1;
		var minDistance = Infinity;
		
		$spans.each(function() {
			var $span = $(this);
			var spanOffset = $span.offset();
			var spanLeft = spanOffset.left - pOffset.left;
			var spanTop = spanOffset.top - pOffset.top;
			var spanWidth = $span.outerWidth() || 5; // 如果宽度为0，给一个默认值
			var spanHeight = $span.outerHeight() || 20;
			
			// 计算鼠标到字符中心的距离
			var centerX = spanLeft + spanWidth / 2;
			var centerY = spanTop + spanHeight / 2;
			var distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
			
			// 如果鼠标在字符范围内，或者距离很近
			if ((mouseX >= spanLeft && mouseX <= spanLeft + spanWidth &&
				mouseY >= spanTop && mouseY <= spanTop + spanHeight) || distance < 30) {
				var index = parseInt($span.data('index'));
				if (distance < minDistance) {
					minDistance = distance;
					hoveredIndex = index;
				}
			}
		});
		
		// 如果找到了鼠标所在的字符，显示附近10个字符的下划线
		if (hoveredIndex >= 0) {
			this.showUnderlines($p, hoveredIndex, 10);
		} else {
			this.clearUnderlines($p);
		}
	},
	
	// 显示指定索引附近指定数量字符的下划线
	showUnderlines: function($p, centerIndex, count) {
		var $spans = $p.find('.char-span');
		var halfCount = Math.floor(count / 2);
		var startIndex = Math.max(0, centerIndex - halfCount);
		var endIndex = Math.min($spans.length - 1, centerIndex + halfCount);
		
		// 清除所有下划线
		$spans.removeClass('underlined');
		
		// 添加下划线
		$spans.each(function() {
			var index = parseInt($(this).data('index'));
			if (index >= startIndex && index <= endIndex) {
				$(this).addClass('underlined');
			}
		});
	},
	
	// 清除所有下划线
	clearUnderlines: function($p) {
		$p.find('.char-span').removeClass('underlined');
	}
};
*/

// 页面加载完成后初始化
$(function() {
	var wit = $(window).width();
	var bl = wit / 1920;
	if (wit <= 1920) {
		$('.Warp').css('zoom', bl);
	}
	
	// 初始化轮播
	carousel.init();
	
	// 初始化导航
	navigation.init();
	
	// 初始化文本悬停下划线效果 - 已注释，改用纯CSS实现
	// textHoverUnderline.init();
});


