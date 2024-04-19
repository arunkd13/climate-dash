# Historical rainfall

```js
import {getRainfallData} from "./rainfall-data.js";
import {ridgeline} from "./components/ridgeline.js";
import {stream} from "./components/stream.js";
import {heatmap} from "./components/heatmap.js";
```

<div class="grid grid-cols-2">
    <div class="card">

```js
const location = view(Inputs.select(["Tindivanam", "Chennai"], { value: "Tindivanam", label: "Location" }));
const type = view(Inputs.select(["ridgeline", "stream", "heatmap"], { value: "ridgeline", label: "Graph type" }));
```
   </div>

   <div class="card">

```js
const scale = view(Inputs.radio(["linear", "symlog"], { value: "linear", label: "Scale" }));
const overlap = view(Inputs.range([0, 20], { disabled: type != "ridgeline", step: 0.1, label: "Overlap" }));
const smooth = view(Inputs.toggle({ disabled: type != "ridgeline", label: "Smooth", value: true }));
```
  </div>
</div>

```js
const data = getRainfallData(location);
```

<div class="card">

```js
const graph = new Map([
    ["ridgeline", (data, width, scale) => ridgeline(data, width, scale, overlap, smooth)],
    ["stream", stream],
    ["heatmap", heatmap]
]);
```

```js
graph.get(type)(data, width, scale)
```

</div>