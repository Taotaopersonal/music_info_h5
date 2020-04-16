/**
 函数
 Swiper

 作用
 快速实现幻灯片效果

 实例
 new Swiper('#container', {
        loop: true,
        auto: true,
        dots: true,
        timeout: 3000
    });

 */
/**
 *
 * @param selector   选择器
 * @param options   选项
 *      loop        是否无缝滚动
 *      auto        是否自动播放
 *      dots        是否显示导航点
 *      timeout     切换的周期
 * @constructor
 *  new Swiper('#box');
 *  new Swiper('#box', {}, {
 *      //是在 touchstart 事件当中触发
 *      start: function(){
 *          console.log('幻灯片要开始切换啦!!');
 *      },
 *      end: function(){
 *          console.log('幻灯片切换完毕');
 *      }
 *  });
 *
 *  new Swiper(box);
 *  new Swiper(container);
 *
 */
//.floor .container
function Swiper(selector, options, callback) {
    //对 loop 选项进行功能控制
    // if (options !== undefined) {
    //     if (options.loop !== undefined) {
    //         var loop = options.loop;
    //     } else {
    //         var loop = false;
    //     }
    // } else {
    //     var loop = false;
    // }
    //选项参数的初始化
    var loop = options !== undefined && options.loop !== undefined ? options.loop : false;
    var auto = options !== undefined && options.auto !== undefined ? options.auto : false;
    var dots = options !== undefined && options.dots !== undefined ? options.dots : false;
    var timeout = options !== undefined && options.timeout !== undefined ? options.timeout : 2000;


    //获取元素
    if (typeof selector === 'string') {
        var container = document.querySelector(selector);// .floor .container
    }
    if(typeof selector === 'object'){
        var container = selector;
    }
    var wrapper = container.querySelector('.swiper-wrapper');
    var swiperItems = wrapper.querySelectorAll('.swiper-item');
    var swiperPagination = container.querySelector('.swiper-pagination');
    var index = 0;
    var points = container.getElementsByTagName('span');
    var len = swiperItems.length;
    var timer = null;//定时器变量
    var isFirst = true;//是否为第一次  顾名思义
    // var direction = 1;// 2
    var isHori = false;

    //复制一份幻灯片内容
    if (loop) {
        wrapper.innerHTML += wrapper.innerHTML;
    }

    var length = container.querySelectorAll('.swiper-item').length;

    //绑定事件
    container.addEventListener('touchstart', function (e) {
        if (loop) {
            //判断当前的下标
            if (index == 0) {
                index = len;
                //根据 index 移动 wrapper 的位置
                switchSlide(index, false);
            }
            //检测右侧边界
            if (index == length - 1) {
                index = len - 1;
                //根据 index 移动 wrapper 的位置
                switchSlide(index, false);
            }
        }
        //获取按下时 尺寸信息
        container.x = e.changedTouches[0].clientX;
        container.y = e.changedTouches[0].clientY;
        // ????
        container.l = transformCSS(wrapper, 'translateX');
        //移除过渡
        wrapper.style.transition = 'none';
        //按下时的时间戳
        container.d1 = Date.now();
        //停止定时器
        clearInterval(timer);
        //运行用户的自定义回调
        if (callback && callback.start && typeof callback.start === 'function') {
            callback.start();
        }
    });

    //触摸滑动
    container.addEventListener('touchmove', function (e) {
        //获取滑动之后的触点位置
        container._x = e.changedTouches[0].clientX;
        var newLeft = container._x - container.x + container.l;
        container._y = e.changedTouches[0].clientY;
        var disX = Math.abs(container._x - container.x);
        var disY = Math.abs(container._y - container.y);

        if (isFirst) {
            isFirst = false;
            //判断方向
            if (disX > disY) {
                //不允许垂直滑动
                isHori = true;
            } else {
                //垂直滑动的话 水平不允许滑动
                isHori = false;
            }
        }
        //后续的滑动行为 根据滑动的方向来决定
        if (isHori) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            return;
        }

        //设置left值
        transformCSS(wrapper, 'translateX', newLeft);
        //运行用户的自定义回调
        if (callback && callback.moving && typeof callback.moving === 'function') {
            callback.moving();
        }
    });

    //触摸结束事件
    container.addEventListener('touchend', function (e) {
        //启动定时器
        autoRun();
        //检测变量还原
        isFirst = true;
        //获取结束时触点的位置
        container._x = e.changedTouches[0].clientX;
        //触摸结束时的时间戳
        container.d2 = Date.now(); // (new Date).getTime();
        //判断滑动的位移是否超过容器的宽度一半
        var disX = Math.abs(container._x - container.x);
        //计算时间差
        var disTime = container.d2 - container.d1;
        //判断方向
        if(!isHori) return;
        //判断时间差 位移差
        if (disX > container.offsetWidth / 2 || disTime <= 500) {
            //向右滑动
            if (container._x > container.x) {
                index--;
            }
            if (container._x < container.x) {
                index++;
            }
        }

        //根据 index 设置 wrapper 的位置
        switchSlide(index);

    });

    //初始化函数 init 初始化
    function init() {
        //设置容器元素的样式
        // position:relative;
        // overflow: hidden;
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        //根据幻灯片的个数 设置包裹元素的宽度
        wrapper.style.width = length + '00%';
        //设置每一个幻灯片的宽度
        var items = container.querySelectorAll('.swiper-item');
        items.forEach(function (item) {
            item.style.width = 100 / length + '%';
        });
        //判断是否显示导航点
        if (!dots) return;
        //动态创建小圆点
        for (var i = 0; i < len; i++) {
            //创建小圆点元素
            var span = document.createElement('span');
            //判断
            if (i === 0) {
                span.className = 'active';
            }
            swiperPagination.appendChild(span);
        }
    }

    init();

    //自动播放
    function autoRun() {
        if (!auto) return;
        //防止定时器重复
        clearInterval(timer);
        //定时器 自动播放
        timer = setInterval(function () {
            //下标自增
            index++;
            //切换幻灯片
            switchSlide(index);
        }, timeout);
    }

    autoRun();

    //函数封装  根据 index 切换幻灯片 10
    function switchSlide(i, isTransition = true) {
        //判断索引是否越界
        if (i <= 0) {
            i = 0;
        }

        if (i >= length - 1) {
            i = length - 1;
        }
        //判断
        if (isTransition) {
            wrapper.style.transition = 'all 0.5s';
        } else {
            wrapper.style.transition = 'none';
        }
        //根据 index 计算 translateX 的值
        var newLeft = -i * container.offsetWidth;
        transformCSS(wrapper, 'translateX', newLeft);

        index = i;

        //切换幻灯片完毕
        if (callback && callback.end && typeof callback.end === 'function') {
            callback.end();// 获取 index 的值 -1  this.index()
        }

        if (!dots) return;
        //切换小圆点
        for (var j = 0; j < points.length; j++) {
            points[j].className = '';
        }
        //设置导航点的样式
        points[i % len].className = 'active';
        //保持 下标统一
    }

    //判断越界  过渡结束后的事件 transitionend
    wrapper.addEventListener('transitionend', function () {
        //越界检测
        if (index == length - 1) {
            index = len - 1;
            switchSlide(index, false);
        }
    });

    //对外暴露函数
    this.switchSlide = switchSlide;

    // this.index = index;// 传值 不是 传址
    this.index = function () {
        return index;
    }
}


