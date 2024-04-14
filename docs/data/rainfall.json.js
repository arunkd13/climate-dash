
const latitude = 12.23;
const longitude = 79.66;
const startDate = "2000-01-01";
const endDate = "2024-04-08";

const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum&timezone=auto`;

async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status} - ${url}`);
  return await response.json();
}

const rainfall = await json(url);

process.stdout.write(JSON.stringify(rainfall.daily));
console.error(url);