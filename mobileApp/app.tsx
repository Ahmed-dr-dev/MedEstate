import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  useEffect(() => {
    // Replace <YOUR-IP> with your computer's local IP address
    axios.get('http://<YOUR-IP>:3000/')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching from backend:', error.message);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello from Expo + TypeScript!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
