import { reverseGeocodeAsync } from "expo-location";

type AddressLocationProps = {
  latitude: number;
  longitude: number;
};

export async function getAddressLocation({
  latitude,
  longitude,
}: AddressLocationProps) {
  try {
    const addressResponse = await reverseGeocodeAsync({ latitude, longitude });
    const streetName = addressResponse[0]?.street ?? addressResponse[0]?.name;
    return streetName;
  } catch (error) {
    console.log(error);
  }
}
