export const basicEscape = (str: string) => str.replaceAll(/[`>#+\-=|{}.!]/g, c => `\\${c}`)
    .replaceAll(/(?<!])\(|(\))(?<!\[.+]\(.+)/g, c => `\\${c}`)

export const specialEscape = (str: string) => str.replaceAll(/[_*~]/g, c => `\\${c}`)
