
import { getHistory } from "./services/inMemoryWeatherService";

console.log("Testing getHistory...");
const h = getHistory();
console.log("History length:", h.length);
if (h.length >= 100) {
    console.log("✅ SUCCESS: History has 100+ points");
    console.log("First point:", h[0]);
    console.log("Last point:", h[h.length - 1]);
} else {
    console.error("HISTORY IS EMPTY!");
}
