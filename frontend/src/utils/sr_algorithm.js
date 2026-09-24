const GRADES = Object.freeze({
    EASY: 5,
    GOOD: 4,
    HARD: 2.5,
    AGAIN: 0
});

function sr_a(grade, repetitions, easy_factor, interval) {
    if (grade >= GRADES.GOOD) {
        if (repetitions === 0) {
            interval = 0.5;
        } else if (repetitions === 1) {
            interval = 1;
        } else {
            interval = Math.round(interval * easy_factor);
        }

        repetitions++;
    } else {
        repetitions = 0;
        interval = 0.1;
    }

    easy_factor += 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
    easy_factor = Math.max(easy_factor, 1.2);

    return [repetitions, easy_factor, interval];
}

export {
    sr_a,
    GRADES
}