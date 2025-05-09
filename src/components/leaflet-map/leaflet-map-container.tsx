import { MapContainer } from "react-leaflet";
import { LeafletMap } from "./leaflet-map";
import { useState } from "react";

export function LeafletMapContainer() {
  const [latlng, setLatlng] = useState<number[]>([0, 0]);

  return (
    <section className="w-[90%] max-w-[900px] h-[500px] relative">
      <MapContainer
        zoomControl={false}
        center={[51.505, -0.09]}
        zoom={13}
        minZoom={11}
        maxZoom={16}
        className="w-full h-full"
      >
        <LeafletMap setLatlng={setLatlng} />
      </MapContainer>
      <div className="absolute right-[12px] top-[12px] bg-white w-[30px] h-[30px] z-400">
        d
      </div>
    </section>
  );
}
