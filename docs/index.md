# Historical rainfall over Tindivanam

```js
import {getRainfallData} from "./rainfall-data.js";
import {ridgeline} from "./components/ridgeline.js";
```

<div class="card">

```js
const data = getRainfallData();
```

```js
const overlap = view(Inputs.range([0, 20], { step: 0.1, label: "Overlap" }));
const smooth = view(Inputs.toggle({ label: "Smooth", value: true }))
```

```js
ridgeline(data, width, overlap, smooth)
```
</div>