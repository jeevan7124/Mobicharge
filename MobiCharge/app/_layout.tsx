import React from "react";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{headerShown: false}} />
      <Stack.Screen name="profile" options={{headerShown: false}} />
      <Stack.Screen name="bookAppointment" options={{headerShown: false}} />
      <Stack.Screen name="about-us" options={{headerShown: false}} />
      <Stack.Screen name="track-vehicle" options={{headerShown: false}} />
      <Stack.Screen name="admin-home" options={{headerShown: false}} />
      <Stack.Screen name="ViewAppointment" options={{headerShown: false}} />
      <Stack.Screen name="ChargingCompletion" options={{headerShown: false}} />

    </Stack>
  );
};

export default RootLayout;
