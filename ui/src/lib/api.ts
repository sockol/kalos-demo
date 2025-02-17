import { camelCase } from './camelcase.js'

const SERVER_URL = 'http://api:4444'

export default {
    get: async (path: string, params?: Record<string, any>) => {
        const res = await fetch(SERVER_URL + path + paramsToString(params))
        
        const data = await res.json();
        if(data.error){
            throw new Error(data.error)
        }
        return data
    },
    post: async (path: string, input?: Record<string, any>) => {
        const res = await fetch(SERVER_URL + path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input),
        })
        
        const data = await res.json();
        if(data.error){
            throw new Error(data.error)
        }
        return data
    }
}

const paramsToString = (params?: Record<string, any>) => {
    if(!params || !Object.keys(params).length){
        return ''
    }
    let s = ''
    let i = 0
    for(const p in params){
        s += `${i == 0 ? '?' : '&'}${p}=${params[p]}`
        i++
    }
    return s
}