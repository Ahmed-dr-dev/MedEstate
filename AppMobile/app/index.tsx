import { Button, Text, View } from "react-native";
import { API_BASE_URL } from "@env";
export default function Home() {  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Text>{API_BASE_URL}</Text>
      <Button title="Test Connection" onPress={() => {
        fetch(`${API_BASE_URL}/TestConnection`)
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
      }} />
    </View>
  );
}