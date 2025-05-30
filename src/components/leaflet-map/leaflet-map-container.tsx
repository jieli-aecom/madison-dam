import { MapContainer } from "react-leaflet";
import { LeafletMap } from "./leaflet-map";
import { useMemo, useState } from "react";
import { CENTER_LAT, CENTER_LNG, MAX_BOUNDS } from "../../consts/map";
import { FEET_IN_MILE } from "../../consts/factors";

export function LeafletMapContainer() {
  const [distanceFt, setDistanceFt] = useState<number | null>(null);

  const displayDistanceString = useMemo(() => {
    if (distanceFt === null) return null;
    if (distanceFt <= FEET_IN_MILE) {
      return `${Math.round(distanceFt).toLocaleString()} ft`;
    }
    return `${(distanceFt / FEET_IN_MILE).toLocaleString()} miles`;
  }, [distanceFt]);

  return (
    <section className="w-[90%] max-w-[900px] h-[500px] relative">
      <MapContainer
        zoomControl={false}
        center={[CENTER_LAT, CENTER_LNG]}
        maxBounds={MAX_BOUNDS}
        zoom={14}
        minZoom={13}
        maxZoom={18}
        className="w-full h-full"
      >
        <LeafletMap setDistanceFt={setDistanceFt} />
      </MapContainer>
      <div className="absolute opacity-85 rounded-lg p-2 left-[12px] top-[12px] bg-white z-400 flex flex-col gap-2 items-end max-w-[14.5rem]">
        <div className="text-xs flex items-center gap-1">
          <span className="material-symbols-outlined">left_click</span>How far
          am I from the temporary drawdown shoreline? Click on map.
        </div>
        {displayDistanceString !== null && <div className="font-semibold text-xl">{displayDistanceString.toLocaleString()}</div>}
      </div>
    </section>
  );
}
