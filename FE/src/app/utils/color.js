function hashString(str = "") {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // convert to unsigned 32-bit
    }

    return hash;
}

export function colorForNote(note, palette) {
    const key = String(note?.slug || note?.id || "");
    const number = hashString(key);

    return palette[number % palette.length];
}