import {FileAttachment} from "npm:@observablehq/stdlib";
import {getDayOfYear} from "./components/dates.js";

export async function getRainfallData() {
    const rainfall = await FileAttachment("./data/rainfall.json").json();

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

    return data;
}
