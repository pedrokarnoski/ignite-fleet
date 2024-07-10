import { View } from "react-native";

import { LocationInfo, LocationInfoProps } from "./LocationInfo";

type LocationsProps = {
  departure: LocationInfoProps;
  arrival?: LocationInfoProps | null;
};

export function Locations({ departure, arrival = null }: LocationsProps) {
  return (
    <View className="w-full">
      <LocationInfo
        icon="map-pin"
        label={departure.label}
        description={departure.description}
      />

      {arrival && (
        <>
          <View className="h-12 w-[1px] ml-6 border-0.5 bg-gray-400" />

          <LocationInfo
            icon="flag-checkered"
            label={arrival.label}
            description={arrival.description}
          />
        </>
      )}
    </View>
  );
}
