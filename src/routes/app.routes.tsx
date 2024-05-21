import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator();

import { Arrival } from "@/screens/Arrival";
import { Departure } from "@/screens/Departure";
import { Home } from "@/screens/Home";

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="arrival" component={Arrival} />
      <Screen name="departure" component={Departure} />
    </Navigator>
  );
}
