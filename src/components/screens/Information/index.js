import React, { useState, useEffect, useContext } from 'react';
import { Pressable, ScrollView } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Image, Input } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import defaultIMG from '../../../assets/default.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthContext } from '../../providers/Context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { estilos } from './style';

const informationScreen = () => {
    const [identidad, setIdentidad] = useState('')
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [telefono, setTelefono] = useState('')
    const [url, setUrl] = useState('')
    const [alert, setAlert] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [exito, setExito] = useState(false)

    const { signOut } = useContext(AuthContext)

    const getData = async () => {
        var jsonValue = await AsyncStorage.getItem('@usuario')
        jsonValue = JSON.parse(jsonValue)
        setNombre(jsonValue.usuarioNombre)
        setCorreo(jsonValue.usuarioCorreo)
        setTelefono(jsonValue.usuarioTelefono)
        setIdentidad(jsonValue.Id)
        setUrl(`http://192.168.0.2:7777/users/${jsonValue.Id}.png?${Math.random()}`)

    }

    useEffect(() => { getData() }, []);

    const updateProfile = async () => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            const response = await fetch('http://192.168.0.2:7777/api/usuario/updateU', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonValue.token,
                },
                body: JSON.stringify({
                    Id: identidad,
                    usuarioNombre: nombre,
                    usuarioTelefono: telefono,
                    usuarioCorreo: correo
                })
            });
            const json = await response.json();
            if (json.msj !== "Registro actualizado  exitosamente.") {
                setMensaje(json.msj)
                setAlert(!alert)
            } else {
                setMensaje('Perfil actualizado exitosamente, inicie sesión nuevamente para refrescar los datos 💚')
                setAlert(!alert)
                setExito(!exito)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
        if (!result.cancelled) {
            try {
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
            }
        }
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
            <View style={styles.container2}>
                <Image source={{ uri: url, CACHE: 'reload' }} style={styles.profileIMG} onPress={pickImage}
                    defaultSource={defaultIMG} key={(new Date()).getTime()} />
                <Input label='N° Identidad' disabled={true} value={identidad}
                    onChangeText={setIdentidad} />
                <Input label='Nombre Completo' value={nombre}
                    onChangeText={setNombre} />
                <Input label='Correo Electrónico' value={correo}
                    onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" />
                <Input label='Teléfono' value={telefono}
                    onChangeText={setTelefono} />
                <Pressable style={styles.appButtonContainer} onPress={updateProfile}>
                    <Text style={styles.appButtonText}>Confirmar</Text>
                </Pressable>
                <AwesomeAlert
                    show={alert}
                    showProgress={false}
                    title="PharmaDev"
                    message={mensaje}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    cancelText="COMPRENDO"
                    confirmText="COMPRENDO"
                    confirmButtonColor="#00ADB5"
                    onCancelPressed={() => {
                        setAlert(!alert)
                    }}
                    onConfirmPressed={() => {
                        setAlert(!alert)
                        exito && signOut()
                    }}
                />
            </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default informationScreen

const styles = StyleSheet.create(estilos)