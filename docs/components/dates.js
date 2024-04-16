
let daysInMonth = [30, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31];
//                 J,  F,  M,  A,  M,  J,  J,  A,  S,  O,  N,  D
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let daysBeforeMonth = [0];
for (let month = 1; month < 12; month++) {
    daysBeforeMonth[month] = daysBeforeMonth[month - 1] + daysInMonth[month - 1];
}

function getDayOfYear(month, dayOfMonth) {
    return dayOfMonth + daysBeforeMonth[month];
}

function getMonth(dayOfYear) {
    let month = daysBeforeMonth.length - 1;
    while (dayOfYear < daysBeforeMonth[month]) month--;
    return monthLabels[month];
}

export { daysBeforeMonth, getDayOfYear, getMonth };
