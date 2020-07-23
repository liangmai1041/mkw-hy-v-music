// 保存storage相关的方法
import storage from 'good-storage'

// 定义存放在storage中的key
const SEARCH_KEY = '__search__'

// 最多保存数量
const SEARCH_MAX_LENGTH = 15

function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    if(index === 0) return
    if(index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if(maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

// 保存历史记录的方法 拿到输入框内容,拿到一个函数,再拿到最大保存数量
export function saveSearch(query) {
    const searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY, searches)
    return searches
}

// 向外暴露出 获取当前浏览器存储SEARCH_KEY 内容的方法,外部需要查看的时候直接调用此方法即可
export function loadStorage() {
    return storage.get(SEARCH_KEY, [])
}