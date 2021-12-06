import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Image, Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';

const PresAdd = ({navigation}) => {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const pressGuardar = async () => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            const response = await fetch('http://192.168.0.2:7777/api/presentacion/addP', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonValue.token,
                },
                body: JSON.stringify({
                    PresentacionNombre: nombre,
                    PresentacionDescripcion: descripcion
                })
            });
            const responseJson = await response.json();
            if (responseJson.msj === "Registro almacenado correctamente") {
                navigation.goBack()
            }else{
                Alert.alert(responseJson.msj)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{flex:1, alignItems:'center', justifyContent:'center', margin:10}}>
                    <Input label='Nombre de la Presentacion' value={nombre} onChangeText={setNombre} />
                    <Input label='Descripcion de la Presentacion' value={descripcion} onChangeText={setDescripcion} />
                    <Button title='Guardar Presentacion' containerStyle={{marginBottom:10, width:'90%'}} buttonStyle={styles.boton} onPress={pressGuardar}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PresAdd

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
