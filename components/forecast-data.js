import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


const ForecastData = ({data}) => {

    return(
        <View style={styles.container}>
            <View style={styles.tempDataContainer}>
                <Text style={styles.tempDataText}>{data && data.main && data.main.temp ? data.main.temp +' ºC' : 'no hay temp'}</Text>
                <Image
                    style={styles.tinyLogo}
                    source={{
                        uri: "https://openweathermap.org/img/w/" + (data && data.weather ? data.weather[0].icon : null) + ".png",
                    }}
                />
            </View>
            <Text style={styles.tempDataDescription}>{data && data.weather ? data.weather[0].description : 'no hay temp'}</Text>
            <View style={styles.tempDataContainer}>
                <Text style={styles.tempMinMaxText}>Min: {data && data.main && data.main.temp_min ? data.main.temp_min+' ºC' : 'no hay temp'}</Text>
                <Text style={styles.tempMinMaxText}>Max: {data && data.main && data.main.temp_max ? data.main.temp_max+' ºC' : 'no hay temp'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tempDataText: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
    },
    tempDataDescription: {
        color: 'white',
        fontSize: 25,
        marginBottom: 10,
    },
    tempDataContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tempMinMaxText: {
        color: 'white',
        fontSize: 20,
        marginHorizontal: 10
    },
    tinyLogo: {
        width: 100,
        height: 100,
        zIndex: 1
    },
});

export default ForecastData;