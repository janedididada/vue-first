// // 定义一个发布者对象
// var pub = {
//     // 缓存列表，存放订阅者回调函数
//     list: {},
//     // 订阅方法
//     subscribe: function (key, fn) {
//         // 如果没有该消息的缓存列表，就创建一个空数组
//         if (!this.list[key]) {
//             this.list[key] = [];
//         }
//         // 将回调函数推入该消息的缓存列表
//         this.list[key].push(fn);
//     },
//     // 取消订阅方法
//     unsubscribe: function (key, fn) {
//         // 如果有该消息的缓存列表
//         if (this.list[key]) {
//             // 遍历缓存列表
//             for (var i = this.list[key].length - 1; i >= 0; i--) {
//                 // 如果存在该回调函数，就从缓存列表中删除
//                 if (this.list[key][i] === fn) {
//                     this.list[key].splice(i, 1);
//                 }
//             }
//         }
//     },
//     // 发布方法
//     publish: function () {
//         // 获取消息类型
//         var key = Array.prototype.shift.call(arguments);
//         // 获取该消息的缓存列表
//         var fns = this.list[key];
//         // 如果没有订阅该消息，就返回
//         if (!fns || fns.length === 0) {
//             return;
//         }
//         // 遍历缓存列表，执行回调函数
//         for (var i = 0; i < fns.length; i++) {
//             fns[i].apply(this, arguments);
//         }
//     }
// };

// // 定义一个订阅者对象A 
// var subA = function (name) {
//     console.log('A收到了消息：' + name);
// };
// // 定义一个订阅者对象B 
// var subB = function (name) {
//     console.log('B收到了消息：' + name);
// };

// // A订阅了test消息 
// pub.subscribe('test', subA);
// // B订阅了test消息 
// pub.subscribe('test', subB);

// // 发布了test消息，传递了参数 'hello'
// pub.publish('test', 'hello');
// // 输出： 
// // A收到了消息：hello 
// // B收到了消息：hello

// // A取消订阅了test消息 
// pub.unsubscribe('test', subA);

// // 发布了test消息，传递了参数 'world'
// pub.publish('test', 'world');
// // 输出： // B收到了消息：world