import { View } from 'react-native';

import { SignIn } from '@/screens/SignIn';

import { StatusBar } from 'expo-status-bar';

import "@/styles/global.css";

export default function App() {
  return (
    <View className='flex-1'>
      <SignIn />
      <StatusBar style="auto" />
    </View>
  );
}