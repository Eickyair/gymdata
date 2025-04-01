import { Pressable, StyleSheet, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import * as Google from "expo-auth-session/providers/google";
export default function TabOneScreen() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: "",
  });
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#4285F4",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
