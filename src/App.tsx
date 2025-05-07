import "./App.css";
import { VegaChart } from "./components/vega-chart";
import { levelsChartSpec } from "./consts/levels-chart-spec";

function App() {
  return (
    <section className="w-full h-[100vh] flex items-center justify-center">
      <VegaChart spec={levelsChartSpec} />
    </section>
  );
}

export default App;
