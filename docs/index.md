# Historical rainfall over Tindivanam

```js
import {spiral} from "./components/spiral.js";
import {ridgeline} from "./components/ridgeline.js";
import {getDayOfYear} from "./components/dates.js";
```

```js
const rainfall = FileAttachment("./data/rainfall.json").json();
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
const overlap = view(Inputs.range([0, 30], { step: 0.1, label: "Overlap" }));
const smooth = view(Inputs.toggle({ label: "Smooth", value: true }))
```

```js
ridgeline(data, width, overlap, smooth)
```
