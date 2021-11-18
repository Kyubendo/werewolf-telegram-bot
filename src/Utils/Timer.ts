export type Timer = {
    stop: () => void,
    extend: (ms: number) => void,
    reset: (ms: number) => void,
    getRemainingTime: () => number
}

export const timer = (callback: Function, initMs: number) => {
    let timeout = setTimeout(callback, initMs)
    let startTime = (new Date).getTime()
    let currentMs = initMs
    return {
        stop: () => clearTimeout(timeout),
        extend: (ms: number) => {
            clearTimeout(timeout)
            currentMs = currentMs - ((new Date).getTime() - startTime) + ms
            startTime = (new Date).getTime()
            timeout = setTimeout(callback, currentMs)
        },
        reset: (ms: number) => {
            clearTimeout(timeout)
            currentMs = ms
            startTime = (new Date).getTime()
            timeout = setTimeout(callback, currentMs)
        },
        getRemainingTime: () => currentMs - ((new Date).getTime() - startTime)
    }
}
