import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as Location from 'expo-location';
import React, { useEffect } from 'react';

export default function App() {

  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location =  await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Compartilhamento não está disponível para essa plataforma`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  };

  if(selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image 
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail} />
          <TouchableOpacity
            onPress={openShareDialogAsync}
            style={styles.button}>
              <Text style={styles.textButton}>Share this photo</Text>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1}}>
        <Text style={styles.title}>MyTracking</Text>
        <Text style={styles.text}>Gestao Logistica Inteligente</Text>
        <StatusBar style="auto" />
      </View>

      <View style={{ flex: 2}}>
        <TouchableOpacity
          onPress={() => alert(text)}
          style={styles.button}>
          <Text style={styles.textButton}>Localização</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openImagePickerAsync}
          style={styles.button}>
          <Text style={styles.textButton}>Captura de Imagem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => alert('Roteiro Sincronizado')}
          style={styles.button}>
          <Text style={styles.textButton}>Leitura de Código de Barras</Text>
        </TouchableOpacity>
      </View>  
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  title: {
    fontSize:28,
    textAlign: 'center'
  },
  text: {
    fontSize:20,
    color:'blue'
  },
  button: {
    backgroundColor: '#fafaff', 
    marginBottom: 15, 
    borderWidth: 2, 
    borderRadius:7, 
    borderColor: '#8390a5'
  },
  textButton: {
    textAlign: 'center',
    fontSize:20,
    color: '#1c4083',
    padding: 10
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
