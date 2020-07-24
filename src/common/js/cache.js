// 保存storage相关的方法
import storage from 'good-storage'

// 定义存放在storage中的key
const SEARCH_KEY = '__search__'
const PLAY_KEY = '__play__'

// 最多保存数量
const SEARCH_MAX_LENGTH = 15
const PLAY_MAX_LENGTH = 200

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

// 删除操作
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if(index > -1) {
        arr.splice(index, 1)
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

export function deleteSearch(query) {
    const searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

export function savePlay(song) {
    const songs = storage.get(PLAY_KEY, [])
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, songs)
    return songs
}

export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}