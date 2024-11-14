import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification'

function App() {

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  };

  const getFcmToken = async () => {
    const token = await messaging().getToken();
    console.log('Fcm Token:', token);
  }

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "default-channel-id",
        channelName: "default Channel",
        channelDescription: "A default channel",
        soundName: "default",
        importance: 4,
        vibrate: true
      },
      (created) => console.log(`Channel created: ${created}`)
    )
  }, [])

  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in foreground:', remoteMessage);

      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body
      });
    });

    return unsubscribe;
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});


