// Format ordinal numbers (1st, 2nd, 3rd, etc.)
export function formatOrdinal(num: number): string {
    // Format number with commas
    const formattedNum = num.toLocaleString('en-US')

    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) {
        return formattedNum + "st"
    }
    if (j === 2 && k !== 12) {
        return formattedNum + "nd"
    }
    if (j === 3 && k !== 13) {
        return formattedNum + "rd"
    }
    return formattedNum + "th"
}
