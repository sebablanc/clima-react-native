/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  ActivityIndicator,
  Animated
} from 'react-native';

import Form from './components/form';
import Forecast from './components/forecast-data';


const App = () => {

  const [pronostico, setPronostico] = useState(null);
  const [pais, setPais] = useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [provincia, setProvincia] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isSunny, setIsSunny] = useState(true);

  const LAT_LONG_API = '386dd6ce1d264600874c58cbb85542d6';
  const API = '91c7547821a8de367ab8da906df872bf';
  const isDarkMode = useColorScheme() === 'dark';

  let backgroundStyle = {
    backgrColor:{
      backgroundColor: pronostico && pronostico.clouds && pronostico.clouds.all>50 ? '#666666' : '#0099FF',
    }
  };


  const findData = async (event)=>{
    setShowLoading(true);
    if(event.ciudad !== '' && event.pais !== ''){
      setPais(event.pais);
      setCiudad(event.ciudad);
      setProvincia(event.provincia);
      const latLng = await encontrarLongitudLatitud(event.ciudad, event.provincia, event.pais);
      const pron = await encontrarPronostico(latLng.lat, latLng.lng);
      setIsSunny(pron && pron.clouds && pron.clouds.all<=50);
      setPronostico(pron);
    }
    setShowLoading(false);
  }

  const encontrarLongitudLatitud = async (ciudad, provincia, pais) => {
    try {
      ciudad = ciudad.replace(/ /g,"%20").replace(/á/g,"a").replace(/é/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u");
      provincia = provincia.replace(/ /g,"%20").replace(/á/g,"a").replace(/é/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u");
      pais = pais.replace(/ /g,"%20").replace(/á/g,"a").replace(/é/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u");
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${LAT_LONG_API}&q=${ciudad+' '+provincia+' '+pais}`);
      const json = await response.json();
      const result = json.results[0].geometry;
      return result;
    }catch(e){
      console.error(e);
    }
  }


  const encontrarPronostico = async (lat, lng) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&exclude=minutely,hourly,alerts&units=metric&lang=sp&appid=${API}`);
      const json = await response.json();
      return json;
    }catch(e){
      console.error(e);
    }
  }

  let ciudadLayout =
    ciudad !== null && pais !== null?
      <Text style={[styles.TextStyle]}>{ciudad+', '+provincia+', '+pais}</Text>
    : <View style={styles.textContainer}>
      </View>;
    
    let pronosticoLayout =
      pronostico === null ?
        <Text style={[styles.textContainer, styles.TextStyle]}>¡Conocé la temperatura en cualquier parte del mundo!</Text>
     :
        <Forecast data={pronostico}/>;
    
    let loading = showLoading ? 
                  <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" />
                      <Text style={styles.loadingText}>Cargando...</Text>
                  </View> 
                  : null;

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[backgroundStyle.backgrColor, styles.container]}>
          {ciudadLayout}
          {pronosticoLayout}
          {loading}
          <Form onPress={findData} showLoading={setShowLoading} changeButtonColor={isSunny} isDarkMode={isDarkMode}/>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    color: '#000000',
    padding: 10,
    height: '100%'
  },
  textContainer: {
    flex: 1,
  },
  TextStyle: {
    fontSize: 25,
    color: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    
  },
  loadingContainer: {
    position: 'absolute',
    width: '50%',
    height: '20%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'center',
    top: '35%',
    borderRadius: 10,
    zIndex: 9,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10
  }
});

export default App;
