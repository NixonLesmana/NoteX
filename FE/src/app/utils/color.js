export function colorForNote(note, pallete) {
    const number = Number(note?.int_id) || (note?.slug?.length ?? 0) || 0;
    return pallete[number % pallete.length]
}