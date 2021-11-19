export const msToMinutes = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const [m, s] = [Math.floor(seconds / 60), seconds % 60]
    return `${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`
}