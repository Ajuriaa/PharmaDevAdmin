import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Image, Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import defaultIMG from '../../../assets/default.jpg'
import DatePicker from 'react-native-datepicker'
import * as ImagePicker from 'expo-image-picker';

const NewPScreen = () => {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState('')
    const [url, setUrl] = useState(null)
    const [fecha, setFecha] = useState('')

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
        if (!result.cancelled) {
            /* try {
                let fileType = result.uri.substring(result.uri.lastIndexOf(".") + 1);
                let formData = new FormData();
                formData.append("photo", {
                    uri: result.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`
                });
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                formData.append('Id', jsonValue.Id)
                const response = await fetch('http://192.168.0.2:7777/api/usuario/profileIMG', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },
                    body: formData,
                });
                const responseJson = await response.json();
                setTimeout(() => setUrl(`http://192.168.0.2:7777/users/${jsonValue.Id}.png?${Math.random()}`), 1000)
            } catch (error) {
                console.log(error);
            } */
            setUrl(result.uri)
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{flex:1, alignItems:'center', justifyContent:'center', margin:10}}>
                    {url && <Image source={{ uri: url}} style={styles.profileIMG}/>}
                    <Button title='Agregar Imagen' containerStyle={{marginBottom:20, width:'90%'}} 
                        buttonStyle={styles.boton} onPress={pickImage}/>
                    <Input label='Nombre del producto' value={nombre} onChange={setNombre} />
                    <Input label='Descripcion del producto' value={descripcion} onChange={setDescripcion} />
                    <Input label='Precio del producto' value={precio} onChange={setPrecio} keyboardType='numeric' />
                    <Input label='Existencias' value={precio} onChange={setPrecio} keyboardType='numeric' />
                    <DatePicker
                        placeholder='Seleccione la fecha de vencimiento del lote'
                        style={{width: '90%', marginBottom:20}}
                        date={fecha}
                    onDateChange={setFecha}/>
                    <Button title='Guardar producto' containerStyle={{marginBottom:10, width:'90%'}} buttonStyle={styles.boton}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NewPScreen

const styles = StyleSheet.create({
    profileIMG: {
        height: 200,
        width: 200,
        marginBottom: 30,
        borderRadius: 7
    },
    boton:{
        elevation: 8,
        borderRadius:7, 
        backgroundColor:'#393E46',
        shadowColor: "#393E46",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
    }
})
