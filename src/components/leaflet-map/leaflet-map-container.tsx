import { MapContainer } from "react-leaflet";
import { LeafletMap } from "./leaflet-map";

export function LeafletMapContainer() {

  return (
    <section className="w-[90%] max-w-[900px] h-[500px]">
      <MapContainer
        zoomControl={false}
        center={[51.505, -0.09]}
        zoom={13}
        minZoom={11}
        maxZoom={16}
        className="w-full h-full"
      >
        <LeafletMap />
      </MapContainer>
    </section>
  );
}
