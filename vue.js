class Vue {
    constructor(obj_instance) {
        this.$data = obj_instance.data
        Observer(this.$data)
        Compile(obj_instance.el, this)
    }
}

function Observer(data_instance) {
    if (!data_instance || typeof data_instance !== 'object') return;
    const dependency = new Dependency();
    Object.keys(data_instance).map(key => {
        let value = data_instance[key]
        Observer(value)
        Object.defineProperty(data_instance, key, {
            enumerable: true,
            configurable: true,
            get() {
                console.log(`访问了属性${key} 值为${value}`);
                // console.log(Dependency.temp);
                Dependency.temp && dependency.addSub(Dependency.temp);
                if (Dependency.temp) {
                    console.log(Dependency.temp);
                }
                return value
            },
            set(newValue) {
                console.log(`访问了属性${key} 值为${value} 改成${newValue}`);
                value = newValue
                Observer(newValue)
                dependency.notify();
            }
        })
    })

}
//html模板解析-替换DOM内
function Compile(element, vm) {
    vm.$el = document.querySelector(element);
    const fragment = document.createDocumentFragment();
    let child;
    // 每次将child挂载到fragment上面后,child就不会在vm上
    while (child = vm.$el.firstChild) {
        //app下的孩子节点挂在fragment下，app下就没有子节点了，无法显示，所以需要取回来
        fragment.append(child)
    }
    fragment_compile(fragment);

    function fragment_compile(node) {
        const pattern = /\{\{\s*(\S+)\s*\}\}/
        //nodeType为3表示文本节点
        if (node.nodeType == 3) {
            const xxx = node.nodeValue
            const result_regx = pattern.exec(node.nodeValue)
            if (result_regx) {
                const arr = result_regx[1].split('.');
                //获取子属性的值
                const value = arr.reduce((total, current) => total[current], vm.$data)
                //替换当前节点值的内容
                node.nodeValue = xxx.replace(pattern, value)
                new Watcher(vm, result_regx[1], newValue => {
                    node.nodeValue = xxx.replace(pattern, value)

                })
            }
            return
        }
        if (node.nodeType === 1 && node.nodeName == 'INPUT') {
            const attr = Array.from(node.attributes);
            attr.forEach(i => {
                if (i.nodeName === 'v-model') {
                    const value = i.nodeValue.split('.').reduce(
                        (total, current) => total[current], vm.$data
                    )
                    console.log(value);
                    node.value = value
                    new Watcher(vm, i.nodeValue, newValue => {
                        node.value = newValue
                    })
                    node.addEventListener('input', e => {
                        const arr1 = i.nodeValue.split('.');
                        const arr2 = arr1.slice(0, arr1.length - 1);
                        const final = arr2.reduce(
                            (total, current) => total[current], vm.$data
                        )
                        final[arr1[arr1.length - 1]] = e.target.value
                    })
                }
            })

        }
        node.childNodes.forEach(child => fragment_compile(child));

    }
    vm.$el.appendChild(fragment)
}
//依赖 -收集和通知订阅者
class Dependency {
    constructor() {
        this.subscribers = []
    }
    addSub(sub) {
        this.subscribers.push(sub)
    }
    notify() {
        this.subscribers.forEach(sub => sub.update());
    }

}
//订阅者
class Watcher {
    constructor(vm, key, callback) {
        this.vm = vm;
        this.key = key;
        this.callback = callback;
        Dependency.temp = this;
        console.log(`用属性${key}创建了订阅者`);
        key.split('.').reduce((total, current) => total[current], vm.$data)
        Dependency.temp = null
    }
    update() {
        const value = this.key.split('.').reduce((total, current) => total[current], this.vm.$data)
        this.callback(value);
    }
}