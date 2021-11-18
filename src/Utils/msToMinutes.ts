export const msToMinutes = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    return `${Math.floor(seconds / 60)}:${seconds % 60}`
}