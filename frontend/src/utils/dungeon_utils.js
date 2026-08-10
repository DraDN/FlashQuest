const get_room_progression_index = (round) => {
    return ((round - 1) % 10) + 1;
}

const get_floor_index = (round) => {
    return Math.floor((round - 1) / 10);
}

export { get_room_progression_index, get_floor_index }