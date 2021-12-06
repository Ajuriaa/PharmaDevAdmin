import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Image, Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const LabEdit = ({route,navigation }) => {
    const [nombre, setNombre] = useState(route.params.data.LaboratorioNombre)
    const [descripcion, setDescripcion] = useState(route.params.data.LaboratorioDescripcion)
    const [show, setShow] = useState(false)


    const pressGuardar = async () => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            const response = await fetch('http://192.168.0.2:7777/api/laboratorio/updateL', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonValue.token,
                },
                body: JSON.stringify({
                    Id: route.params.data.id,
                    LaboratorioNombre: nombre,
                    LaboratorioDescripcion: descripcion
                })
            });
            const responseJson = await response.json();
            if (responseJson.msj === "Registro actualizado  exitosamente.") {
                navigation.goBack()
            }else{
                Alert.alert(responseJson.msj)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDTP = () => {
        setShow(true)
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || fecha;
        setShow(Platform.OS === 'ios');
        setFecha(currentDate);
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                    <Input label='Nombre del laboratorio' value={nombre} onChangeText={setNombre} />
                    <Input label='Descripcion del laboratorio' value={descripcion} onChangeText={setDescripcion} />
                    <Button title='Guardar Cambios'
                        containerStyle={{ marginBottom: 10, width: '95%' }}
                        buttonStyle={styles.boton}
                        onPress={pressGuardar} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LabEdit

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
