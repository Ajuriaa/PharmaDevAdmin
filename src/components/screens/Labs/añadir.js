import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Image, Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import defaultIMG from '../../../assets/default.jpg'
import DatePicker from 'react-native-datepicker'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LABADDSCREEN = () => {
    const [LaboratorioNombre, setNombre] = useState('')
    const [LaboratorioDescripcion, setDescripcion] = useState('')

    const pressGuardar = async () => {
        if (!LaboratorioNombre || !LaboratorioDescripcion) {
            console.log("Campos Incompletos")
            Alert.alert("PharmaDev", "Escriba los campos correctamente");
        }
        else {
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)

                const respone = await fetch("http://192.168.0.108:7777/api/laboratorio/addL", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,

                    },
                    body: JSON.stringify({
                        LaboratorioNombre: LaboratorioNombre,
                        LaboratorioDescripcion: LaboratorioDescripcion

                    })
                });
                console.log("Datos almacenados")
                Alert.alert("PharmaDev", "Datos almacenados correctamente");
            } catch (error) {
                console.error(error);
            }
        }
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>

                    <Input label='Nombre de la farmacia' value={nombre} onChange={setNombre} />
                    <Input label='Descripcion de la farmacia' value={descripcion} onChange={setDescripcion} />

                    <Button title='Guardar farmacia' containerStyle={{ marginBottom: 10, width: '90%' }} buttonStyle={styles.boton} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LABADDSCREEN

const styles = StyleSheet.create({
    profileIMG: {
        height: 200,
        width: 200,
        marginBottom: 30,
        borderRadius: 7
    },
    boton: {
        elevation: 8,
        borderRadius: 7,
        backgroundColor: '#393E46',
        shadowColor: "#393E46",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
    }
})
