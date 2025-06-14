import "./App.css";
import { VegaChart } from "./components/vega-chart";
import { levelsChartSpec } from "./consts/levels-chart-spec";
import { LeafletMapContainer } from "./components/leaflet-map/leaflet-map-container";

function App() {
  return (
    <section className="w-full h-[100vh] flex h-full items-center overflow-y-auto justify-center py-8">
      <section className="w-full max-w-[1200px] gap-8 overflow-y-auto flex flex-col items-center">
        <section className="w-full flex flex-col items-center gap-4 overflow-x-auto">
          <h2 className="m-0 text-xl">Madison Reservoir Dam Rehabilitation Temporary Drawdown Chart</h2>
          <VegaChart spec={levelsChartSpec} />
        </section>
        <section className="w-full flex flex-col items-center gap-4">
          <h2 className="m-0 text-xl">Madison Reservoir Dam Rehabilitation Temporary Drawdown Map</h2>
          <LeafletMapContainer />
        </section>
      </section>
    </section>
  );
}

export default App;
