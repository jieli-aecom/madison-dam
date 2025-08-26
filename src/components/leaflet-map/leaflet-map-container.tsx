import { MapContainer } from "react-leaflet";
import { LeafletMap } from "./leaflet-map";
import { useMemo, useState } from "react";
import { CENTER_LAT, CENTER_LNG, MAX_BOUNDS } from "../../consts/map";
import { FEET_IN_MILE } from "../../consts/factors";
import { Icon } from '@mui/material';

export function LeafletMapContainer() {
  const [distanceFt, setDistanceFt] = useState<number | null>(null);

  const displayDistanceString = useMemo(() => {
    if (distanceFt === null) return "- ft";
    if (distanceFt <= FEET_IN_MILE) {
      return `${Math.round(distanceFt).toLocaleString()} ft`;
    }
    return `${(Math.round(distanceFt * 100 / FEET_IN_MILE) / 100).toLocaleString()} mi`;
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
      <div className="absolute opacity-85 rounded-lg py-2 px-3 left-[12px] top-[12px] bg-white z-400 flex gap-2 items-center justify-between">
        <div className="text-xs flex items-center gap-2 w-[14rem]">
          <Icon className="text-[1.2rem]">ads_click</Icon>
          How far am I from the temporary drawdown shoreline? Click on map.
        </div>
        {displayDistanceString !== null && <div className="font-semibold text-xl flex justify-end w-[5rem]">{displayDistanceString.toLocaleString()}</div>}
      </div>
    </section>
  );
}
