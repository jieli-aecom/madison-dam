import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const tileAccount = "mapbox";
const tileStyle = "satellite-v9";
const tileToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapboxUrl = `https://api.mapbox.com/styles/v1/${tileAccount}/${tileStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${tileToken}`;
const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';

export function LeafletMap() {
  return (
    <section className="w-full max-w-[900px] h-[500px]">
      <MapContainer
        zoomControl={false}
        center={[51.505, -0.09]}
        zoom={13}
        minZoom={11}
        maxZoom={16}
        className="w-full h-full"
      >
        <TileLayer attribution={mapboxAttribution} url={mapboxUrl} />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}
