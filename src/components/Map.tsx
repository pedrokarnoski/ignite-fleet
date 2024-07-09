import { colors } from "@/styles/colors";
import { useRef } from "react";
import { Platform } from "react-native";
import MapView, {
  LatLng,
  MapViewProps,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import { IconBox } from "./IconBox";

type MapProps = MapViewProps & {
  coords: LatLng[];
};

export function Map({ coords, ...rest }: MapProps) {
  const mapRef = useRef<MapView>(null);

  const lastCoord = coords[coords.length - 1];

  async function onMapLoaded() {
    if (coords.length > 1) {
      mapRef.current?.fitToSuppliedMarkers(["departure", "arrival"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      zoomControlEnabled={true}
      style={{ width: "100%", height: 200 }}
      region={{
        latitude: lastCoord.latitude,
        longitude: lastCoord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onMapLoaded={onMapLoaded}
      {...rest}
    >
      <Marker identifier="departure" coordinate={coords[0]}>
        <IconBox icon="map-pin" size="SMALL" />
      </Marker>

      {coords.length > 1 && (
        <>
          <Marker identifier="arrival" coordinate={coords[coords.length - 1]}>
            <IconBox icon="flag-checkered" size="SMALL" />
          </Marker>

          <Polyline
            coordinates={[...coords]}
            strokeColor={colors["brand-light"]}
            strokeWidth={6}
          />
        </>
      )}
    </MapView>
  );
}
