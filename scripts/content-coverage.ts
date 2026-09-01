// Prints the machine-readable content coverage report. Run with:
//   npm run content:coverage

import { computeCoverage } from "../src/lib/content/coverage";

const c = computeCoverage();
console.log(JSON.stringify(c, null, 2));
