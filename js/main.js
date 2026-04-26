/* =============================================
   Wesley投资 - 主交互脚本 (v2.0)
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 移动端导航切换
    // =========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // =========================================
    // 滚动效果
    // =========================================
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section[id], .hero[id]');

    // 导航栏滚动效果 & 回到顶部按钮
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

        // 导航栏阴影
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 回到顶部按钮
        if (scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // 当前板块高亮导航
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // 回到顶部
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =========================================
    // 入场动画 — anim-fade-up 系统
    // =========================================
    const fadeElements = document.querySelectorAll('.anim-fade-up');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // =========================================
    // 数字递增动画
    // =========================================
    function animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            if (isNaN(target)) return;

            const increment = target / 60;
            let current = 0;

            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    number.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target + '+';
                }
            };

            updateNumber();
        });
    }

    // 使用 IntersectionObserver 触发数字动画
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(heroStats);
    }

    // =========================================
    // 平滑滚动增强
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('Wesley投资 网站已加载完成');

    // =========================================
    // 微信二维码弹窗
    // =========================================
    const wechatContact = document.getElementById('wechatContact');
    const wechatModal = document.getElementById('wechatModal');
    const modalClose = document.querySelector('.modal-close');

    if (wechatContact && wechatModal) {
        wechatContact.addEventListener('click', function() {
            wechatModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = function() {
            wechatModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        wechatModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    // =========================================
    // 快速入口 — 滚动滑动轮播
    // =========================================
    const quickLinks = document.getElementById('quickLinks');
    const carouselTrack = document.getElementById('carouselTrack');
    if (quickLinks && carouselTrack) {
        const slides = carouselTrack.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        const progressContainer = document.getElementById('carouselProgress');

        // 创建进度条
        for (var i = 0; i < totalSlides; i++) {
            var bar = document.createElement('span');
            bar.className = 'carousel-progress-bar' + (i === 0 ? ' active' : '');
            progressContainer.appendChild(bar);
        }

        // 设置滚动高度 = 5屏
        quickLinks.style.height = (totalSlides * 100) + 'vh';

        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    var rect = quickLinks.getBoundingClientRect();
                    // 当 sticky 区域进入视口时，rect.top 为 0
                    // 总可滚动高度 = quickLinks 高度 - 视口高度
                    var viewH = window.innerHeight;
                    var totalH = quickLinks.offsetHeight;
                    var scrollable = totalH - viewH;
                    if (scrollable <= 0) { ticking = false; return; }

                    // 计算当前进度 (0~1)
                    var progress = -rect.top / scrollable;
                    progress = Math.max(0, Math.min(1, progress));

                    // 映射到 slide 索引
                    var index = Math.round(progress * (totalSlides - 1));

                    carouselTrack.style.transform = 'translateX(-' + (index * 100) + '%)';

                    // 更新进度条
                    var bars = progressContainer.querySelectorAll('.carousel-progress-bar');
                    bars.forEach(function(b, i) {
                        b.classList.toggle('active', i <= index);
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    }
});
