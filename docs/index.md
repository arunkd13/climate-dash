# Historical rainfall over Tindivanam

```js
import {spiral} from "./components/spiral.js";
import {ridgeline} from "./components/ridgeline.js";
```

```js
const rainfall = FileAttachment("./data/rainfall.json").json();
```

```js
let daysInMonth = [30, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31];
//             J,  F,  M,  A,  M,  J,  J,  A,  S,  O,  N,  D
let daysBeforeMonth = [0];
for (let month = 1; month < 12; month++) {
    daysBeforeMonth[month] = daysBeforeMonth[month - 1] + daysInMonth[month - 1];
}

function getDayOfYear(month, dayOfMonth) {
    return dayOfMonth + daysBeforeMonth[month];
}
```

```js
const data = [];
for (let i = 0; i < rainfall.time.length; i++) {
    let date = new Date(rainfall.time[i]);
    let month = date.getMonth();
    let dayOfMonth = date.getDate() - 1;
    if (month == 1 && dayOfMonth == 28) continue;

    data.push({
        year: date.getFullYear(),
        month,
        dayOfYear: getDayOfYear(month, dayOfMonth),
        value: rainfall.precipitation_sum[i]
    });
}
```

```js
display(rainfall)
display(data)
```

```js
const overlap = view(Inputs.range([0, 100], { step: 0.5, label: "Overlap" }));
```

```js
ridgeline(data, width, overlap)
```