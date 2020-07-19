export function addClass(el, className) {
    if(hasClass(el, className)) {
        return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}

export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

export function getData(el, name, val) {
    const prefix = 'data-'
    name = prefix + name
    if(val) {
        return el.setAttribute(name, val)
    }else{
        return el.getAttribute(name)
    }
}

// 自定义auto prefix 的方法
const elementStyle = document.createElement('div').style
// 定义一个自运行函数 拿到浏览器厂商名称
const vendor = (() => {
    const transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }
    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }
    return false
})()

export function prefixStyle(style) {
    // 如果没有厂商浏览器错误
    if (vendor === false) {
        return false
    }
    // 如果厂商是这个标准模式,那么直接返回style
    if (vendor === 'standard') {
        return style
    }
    // 依据对应的厂商返回对应的拼接style
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}