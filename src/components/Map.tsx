import MapView, {
  LatLng,
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

type MapProps = MapViewProps & {
  coords: LatLng[];
};

export function Map({ coords, ...rest }: MapProps) {
  const lastCoord = coords[coords.length - 1];

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ width: "100%", height: 200 }}
      region={{
        latitude: lastCoord.latitude,
        longitude: lastCoord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker coordinate={coords[0]} />
    </MapView>
  );
}
