# Historical rainfall over Tindivanam

```js
import {getRainfallData} from "./rainfall-data.js";
import {ridgeline} from "./components/ridgeline.js";
import {stream} from "./components/stream.js";
import {heatmap} from "./components/heatmap.js";
```

```js
const data = getRainfallData();
```

<div class="grid grid-cols-2">
    <div class="card">

```js
const type = view(Inputs.select(["ridgeline", "stream", "heatmap"], { value: "ridgeline", label: "Graph type" }));
```
   </div>

   <div class="card">

```js
const overlap = view(Inputs.range([0, 20], { disabled: type != "ridgeline", step: 0.1, label: "Overlap" }));
const smooth = view(Inputs.toggle({ disabled: type != "ridgeline", label: "Smooth", value: true }));
```
  </div>
</div>

<div class="card">


```js
const graph = new Map([
    ["ridgeline", (data, width) => ridgeline(data, width, overlap, smooth)],
    ["stream", stream],
    ["heatmap", heatmap]
]);
```

```js
graph.get(type)(data, width)
```

</div>