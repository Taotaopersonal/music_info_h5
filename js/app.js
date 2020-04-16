// 适配的功能
(function () {
    function shipei() {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
    }

    shipei();
    window.onresize = shipei;
}());

//阻止默认行为
(function () {
    //获取元素
    var app = document.querySelector('#app');
    app.addEventListener('touchstart', function (e) {
        e.preventDefault();
    });
}());

//头部交互逻辑
(function () {
    //获取元素
    var input = document.querySelector('#header input');
    var app = document.querySelector('#app');
    var menuBtn = document.querySelector('#header .menu');
    var hiddenMenu = document.querySelector('#header .hidden-menu');
    //绑定事件
    input.addEventListener('touchstart', function (e) {
        //JS让其获得焦点
        input.focus();
        //阻止冒泡
        e.stopPropagation();
    });

    //
    app.addEventListener('touchstart', function (e) {
        input.blur();
    });

    //菜单按钮的触摸开始事件  $('#box').addClass('active')  class='abc active'
    menuBtn.addEventListener('touchstart', function () {
        //菜单按钮的显示变换
        menuBtn.classList.toggle('close');
        //隐藏菜单的显示和隐藏
        hiddenMenu.classList.toggle('close');
    });
}());

//导航区
(function () {
    //获取元素
    var nav = document.querySelector('#nav');
    var navList = nav.querySelector('.navList');
    var navItems = navList.querySelectorAll('li');
    var isMove = false;

    //绑定事件
    nav.addEventListener('touchstart', function (e) {
        //获取按下时的触点位置
        nav.x = e.changedTouches[0].clientX;
        //获取包裹元素距离左侧的偏移量
        nav.l = transformCSS(navList, 'translateX');
        //移除过渡
        navList.style.transition = 'none';
        //设置时间戳
        nav.startTime = Date.now();
    });

    //触摸滑动
    nav.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        //触摸滑动后的位置
        nav._x = e.changedTouches[0].clientX;
        if (Math.abs(nav._x - nav.x) >= 3) {
            isMove = true;
        }
        //计算新的 translateX 的值
        var translateX = nav._x - nav.x + nav.l;
        //判断是否越界
        if (translateX > 0) {
            translateX = translateX / 2;
        }
        var minTranslateX = -(navList.offsetWidth - nav.offsetWidth)
        if (translateX < minTranslateX) {
            translateX = minTranslateX + (nav._x - nav.x) / 2;
        }
        //设置变形的位移
        transformCSS(navList, 'translateX', translateX);
    });

    //触摸结束
    nav.addEventListener('touchend', function (e) {
        //获取触点的位置
        nav._x = e.changedTouches[0].clientX;
        isMove = false;
        //获取当前抬手时 元素的偏移位置
        var translateX = transformCSS(navList, 'translateX');
        //获取触摸结束时的时间戳
        nav.endTime = Date.now();
        //v    s   t
        var disX = nav._x - nav.x;
        var disTime = nav.endTime - nav.startTime;

        var v = disX / disTime;
        //通过 v 参数 得到惯性移动的位移s   v 0.5-1-2     s  50
        var s = v * 100;
        translateX = translateX + s;
        //增加过渡
        navList.style.transition = 'all 0.5s ease-out';

        //判断是否越界
        if (translateX > 0) {
            translateX = 0;
            //设置过渡的样式
            navList.style.transition = 'all 0.4s cubic-bezier(0,.92,.31,1.5)';
        }
        //右侧越界
        var minTranslateX = -(navList.offsetWidth - nav.offsetWidth);
        if (translateX < minTranslateX) {
            translateX = minTranslateX;
            //设置过渡的样式
            navList.style.transition = 'all 0.4s cubic-bezier(0,.92,.31,1.5)';
        }

        //设置元素的偏移
        transformCSS(navList, 'translateX', translateX);
    });

    //遍历绑定事件
    navItems.forEach(function (item) {
        item.addEventListener('touchend', function () {
            //判断
            if (isMove) return;
            //移除所有item元素的active类名
            navItems.forEach(function (i) {
                i.classList.remove('active');
            });
            item.classList.add('active');
        });
    });
}());

//轮播图
(function () {
    new Swiper('#swiper-container', {
        loop: true,
        auto: true,
        dots: true,
        timeout: 2000
    });
}());

//楼层
(function () {
    //获取所有的楼层
    var floors = document.querySelectorAll('.floor');

    floors.forEach(function (floor) {
        var navItems = floor.querySelectorAll('.nav-item');
        var moveBorder = floor.querySelector('.move-border');
        var container = floor.querySelector('.container');
        var swiperItems = floor.querySelectorAll('.swiper-item');
        //幻灯片功能
        var swiper = new Swiper(container, {
            loop: false,
            auto: false,
            dots: false
        }, {
            start: function () {
                console.log('你点了我!!');
            },
            end: function () {
                //根据 index来修改 底部边框的位置
                var index = swiper.index();
                var translateX = index * navItems[0].offsetWidth;
                //设置
                transformCSS(moveBorder, 'translateX', translateX);

                //检测状态
                var isLoaded = swiperItems[index].getAttribute('is-loaded');
                //如果已经加载完毕
                if (isLoaded == '1') return;
                //将当前幻灯片的内容 设置为 mv 数据
                setTimeout(function () {
                    var firstSlide = swiperItems[0];
                    //设置当前幻灯片的内容 为第一张幻灯片的内容
                    swiperItems[index].innerHTML = firstSlide.innerHTML;
                    //设置当前标签的 is-loaded 属性
                    swiperItems[index].setAttribute('is-loaded', 1);
                }, 2000);
            },
            moving: function () {
                console.log('幻灯片正在切换中.....');
            }
        });

        //绑定事件
        navItems.forEach(function (item, key) {
            //将 key 写入到元素对象身上
            item.index = key;
            item.addEventListener('touchstart', function (e) {
                //修改那个底部 元素位置即可
                //1. translateX(√)  left
                //2. 设置为多少
                /**
                 * 0    0
                 * 1    50
                 * 2    100
                 * N    50N
                 */
                    //获取标签属性值
                    // var index = this.getAttribute('data-index');// $(this).index();
                    //通过标签的属性来获取下标  <div class="nav-item" data-index="0">内地</div>
                var index = this.dataset.index;
                //计算
                var translateX = index * navItems[0].offsetWidth;
                //设置
                transformCSS(moveBorder, 'translateX', translateX);

                //根据下标来切换幻灯片的显示的内容  index  0  0   1   -363     2  -726   N  -363*N
                swiper.switchSlide(index);
            });
        });
    })
}());

//内容整体滑动
(function () {
    new Touchscroll('#app', '#main');
}());