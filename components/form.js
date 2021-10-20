import React, {useState, useEffect} from 'react';
import {
    View,
    Pressable,
    Text,
    StyleSheet,
    Alert
  } from 'react-native';
  import {Picker} from '@react-native-picker/picker';

const Form = ({onPress, showLoading, changeButtonColor, isDarkMode}) => {
    const [paises, setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [pais, setPais] = useState('');
    const [provincia, setProvincia] = useState('');
    const [ciudad, setCiudad] = useState('');

    let backgroundStyle = {
        buttonbackgrColor:{
            backgroundColor:  changeButtonColor ? '#0044FF' : '#000000',
        }
      };

      const styles = StyleSheet.create({
        container:{
            width: '100%',
            color: '#000000',
        },
        itemSize: {
            width: '100%',
            padding: 10,
            alignItems: 'center',
            marginVertical: 5,
            marginHorizontal: 0
        },
        input: {
            backgroundColor: '#FFFFFF',
            color: '#000000'
        },
        textItem: {
            color: isDarkMode ? '#FFFFFF' : '#000000',
            fontSize: 20
        },
        textWhite: {
            color: '#FFFFFF',
            fontSize: 20
        }
    });

    useEffect(async ()=>{
        try{
            setProvincia('');
            setCiudad('');
            setProvincias([]);
            setCiudades([]);
            await getPaisesAsync();
        }catch(e){
            setPaises([]);
        }
    }, [])
    
    const getPaisesAsync = async () => {
        try {
            showLoading(true);
            const response = await fetch(`https://restcountries.com/v3/all`);
            const json = await response.json();
            let toReturn = [];
            json.forEach(pais =>{
                toReturn.push({
                    name: (pais && pais.translations && pais.translations.spa && pais.translations.spa.common ? pais.translations.spa.common : pais.name.common), 
                    flag: pais.flag,
                    originalName: pais.name });
            });
            toReturn.sort((pa, pb) => pa.name > pb.name ? 1 : -1);
            setPaises(toReturn);
            showLoading(false);
        } catch (error) {
            console.error(error);
            showLoading(false); 
        }
    };

    const getCiudadesXProvincia = async (provincia) => {
        try {
            showLoading(true);
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/state/cities`,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    "country": pais.originalName.common,
                    "state": provincia
                })
            });
            const json = await response.json();
            setCiudades(json.data ? json.data : []);
            showLoading(false);
        } catch (error) {
            console.error(error);
            showLoading(false);
        }
    }

    const getProvinciasXPaisAsync = async (country) => {
        try {
            showLoading(true);
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states`,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    country: country
                  })
            });
            const json = await response.json();
            let toReturn = [];
            json.data.states.forEach(state => {
                toReturn.push(state.name);
            })
            toReturn.sort((ca, cb) => ca > cb ? 1 : -1);
            setProvincias(toReturn);
            showLoading(false);
        } catch (error) {
            console.error(error);
            showLoading(false);
        }
    };

    const verificandoYEnviandoInformacion = () => {
        
        if(!ciudad || !provincia || !pais || ciudad.trim() === '' || provincia.trim() === '' || pais.name.trim() === '') {
            Alert.alert('Lo sentimos!', 'Debe proporcionar un país y una ciudad para la búsqueda');
            return;
        }
        onPress({ciudad: ciudad, provincia: provincia, pais: pais.name});
    }

    const paisChangeHandler = async (itemValue) => {
        setProvincias([]);
        setCiudades([]);
        setPais(itemValue);
        await getProvinciasXPaisAsync(itemValue.originalName.common)
    }

    const provinciaChangeHandler = async (itemValue) => {
        setProvincia(itemValue);
        setCiudades([]);
        await getCiudadesXProvincia(itemValue);
    }


    return(
        <View>
            <Picker
                style={[styles.input, styles.itemSize]}
                selectedValue={pais}
                onValueChange={(itemValue, itemIndex) => {
                    paisChangeHandler(itemValue);
                }}>
                {paises.map((item, index) => 
                    <Picker.Item style={styles.textItem} key={item.name+index} label={item.name+' ' +item.flag} value={item} />
                )}
            </Picker>

            <Picker
                style={[styles.input, styles.itemSize]}
                selectedValue={provincia}
                onValueChange={(itemValue, itemIndex) => {
                    provinciaChangeHandler(itemValue);
                }}>
                {provincias.map((item, index) => 
                    <Picker.Item style={styles.textItem} key={item+index} label={item} value={item} />
                )}
            </Picker>

            <Picker
                style={[styles.input, styles.itemSize]}
                selectedValue={ciudad}
                onValueChange={async (itemValue, itemIndex) =>{
                    setCiudad(itemValue);
                }}>
                {ciudades.map((item, index) => 
                    <Picker.Item style={styles.textItem} key={item+index} label={item} value={item} />
                )}
            </Picker>

            <Pressable 
                style={[styles.itemSize, backgroundStyle.buttonbackgrColor]}
                onPressOut={()=>{verificandoYEnviandoInformacion()}}>
              <Text style={styles.textWhite}>Buscar clima</Text>
            </Pressable>
        </View>
    );
}

export default Form;