export const basicEscape = (str: string) => str.replace(/[`>#+\-=|{}.!]/g, c => `\\${c}`)
    .replace(/(?<!])\(|(\))(?<!\[.+]\(.+)/g, c => `\\${c}`)

export const specialEscape = (str: string) => str.replace(/[_*~]/g, c => `\\${c}`)
