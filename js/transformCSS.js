/**
 函数名:
    transformCSS

 作用:
     - 设置元素的 transform 变形
     - 获取元素的 transform 变形值

 示例
 需求
     设置变形
     #box  div  translateX  200px
     transformCSS(box, 'translateX', 200);// ==> box.style.transform = 'translateX(200px)';
     transformCSS(box, 'scale', 2);
     transformCSS(box, 'rotate', 45);

 获取元素变形样式值
    var x = transformCSS(box, 'translateX'); // 200
 */

// var store = {};// {translateX:200, scale:3}  => translateX(200px) scale(3);

function transformCSS(el, type, value) {
    //设置
    /**
     * transformCSS(box,'translateX', 200);  // box.style.transform = 'translateX(200px');
     transformCSS(box,'scale', 3);
     transformCSS(box,'rotate', 45);
     */
    if (el.store === undefined) {
        el.store = {
            translateZ: 0
        };//
    }

    //设置
    if (arguments.length === 3) {
        //box.style.transform = 'translateX(200px');
        //将变形样式 存储到 store 对象中
        el.store[type] = value;

        var str = '';
        //遍历对象
        for (var i in el.store) {
            // str = 'translateX(200px');
            switch (i) {
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    str += i + '(' + el.store[i] + 'px) ';
                    break;

                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'scaleZ':
                    str += i + '(' + el.store[i] + ') ';
                    break;

                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                    str += i + '(' + el.store[i] + 'deg) ';
                    break;
            }
        }

        //设置样式
        el.style.transform = str;
    }

    //读取
    if(arguments.length === 2){
        // 如果 store 中存在该属性 则返回 如果不存在 则返回默认值  translate 0  rotate 0  scale  1
        // var x = transformCSS(box, 'translateX'); // 200
        if(el.store[type] !== undefined){
            return el.store[type];
        }else{
            // 判断 type 变量的值 前五个字母是否为 scale
            if(type.substr(0, 5) === 'scale'){
                return 1;
            }else{
                return 0;
            }
        }
    }

}
