import { get_level_mult } from "../config/player_configs";

const calculate_stat = (stat, level) => 
    Math.round(stat * get_level_mult(level));

export {
    calculate_stat
}