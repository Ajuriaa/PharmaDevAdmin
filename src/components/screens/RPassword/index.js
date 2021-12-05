import React, { useState, useEffect, useContext } from 'react';
import { Pressable, ScrollView } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthContext } from '../../providers/Context';
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { estilos } from './style';

const RPasswordScreen = () => {
    const [actual, setActual] = useState('')
    const [nueva, setNueva] = useState('')
    const [nueva2, setNueva2] = useState('')
    const [alert, setAlert] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [alert1, setAlert1] = useState(false)
    const [mensaje1, setMensaje1] = useState('')
    const [exito, setExito] = useState(false)
    const { signOut } = useContext(AuthContext)
    const [hidePass, setHidePass] = useState(true)
    const [hidePass1, setHidePass1] = useState(true)
    const [hidePass2, setHidePass2] = useState(true)

    const handleNewPass = _ => {
        if (nueva !== nueva2) {
            setMensaje1('Las contraseñas no coinciden')
            setAlert1(!alert1)
            return
        }
        setMensaje(' ¿Está seguro? ')
        setAlert(!alert)
    }

    const confirm = async _ => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            const response = await fetch('http://192.168.0.2:7777/api/usuario/updateP', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonValue.token,
                },
                body: JSON.stringify({
                    Id: jsonValue.Id,
                    oldP: actual,
                    newP: nueva,
                })
            });
            const json = await response.json();
            if (json.msj !== "Registro actualizado  exitosamente.") {
                setMensaje1(json.msj)
                setAlert1(!alert1)
            } else {
                setMensaje1('Perfil actualizado exitosamente, inicie sesión nuevamente para refrescar los datos 💚')
                setAlert1(!alert1)
                setExito(!exito)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View style={styles.container2}>
                    <Input label='Introduzca su contraseña actual'
                        leftIcon={<Icon size={15} name="lock" />}
                        autoCapitalize="none"
                        value={actual}
                        onChangeText={setActual}
                        returnKeyType="go"
                        secureTextEntry={hidePass ? true : false}
                        rightIcon={
                            <Icon
                                name={hidePass ? 'eye-slash' : 'eye'}
                                size={15}
                                color="black"
                                onPress={() => setHidePass(!hidePass)}
                            />
                        } />
                    <Input label='Nueva contraseña' value={nueva}
                        leftIcon={<Icon size={15} name="lock" />}
                        onChangeText={setNueva}
                        autoCapitalize="none"
                        returnKeyType="go"
                        secureTextEntry={hidePass1 ? true : false}
                        rightIcon={
                            <Icon
                                name={hidePass1 ? 'eye-slash' : 'eye'}
                                size={15}
                                color="black"
                                onPress={() => setHidePass1(!hidePass1)}
                            />
                        } />
                    <Input label='Repita la contraseña nueva' value={nueva2}
                        leftIcon={<Icon size={15} name="lock" />}
                        autoCapitalize="none"
                        onChangeText={setNueva2}
                        returnKeyType="go"
                        secureTextEntry={hidePass2 ? true : false}
                        rightIcon={
                            <Icon
                                name={hidePass2 ? 'eye-slash' : 'eye'}
                                size={15}
                                color="black"
                                onPress={() => setHidePass2(!hidePass2)}
                            />
                        } />
                    <Pressable style={styles.appButtonContainer} onPress={handleNewPass}>
                        <Text style={styles.appButtonText}>Confirmar</Text>
                    </Pressable>
                    <AwesomeAlert
                        show={alert}
                        showProgress={false}
                        title="PharmaDev"
                        message={mensaje}
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText=" No "
                        confirmText=" Si "
                        confirmButtonColor="#00ADB5"
                        cancelButtonColor='#ff8080'
                        onCancelPressed={() => {
                            setAlert(!alert)
                        }}
                        onConfirmPressed={() => {
                            setAlert(!alert)
                            confirm()
                        }}
                    />
                    <AwesomeAlert
                        show={alert1}
                        showProgress={false}
                        title="PharmaDev"
                        message={mensaje1}
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        cancelText=" No "
                        confirmText=" CONFIRMAR "
                        confirmButtonColor="#00ADB5"
                        cancelButtonColor='#ff8080'
                        onCancelPressed={() => {
                            setAlert1(!alert1)
                        }}
                        onConfirmPressed={() => {
                            setAlert1(!alert1)
                            exito && signOut()
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default RPasswordScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EEEEEE',
        flex: 1,
        padding: 20,
    },container2:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },appButtonContainer: {
        elevation: 8,
        backgroundColor: "#393E46",
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: "#393E46",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        width: '100%'
    }, appButtonText: {
        fontSize: 14,
        color: "#fff",
        alignSelf: "center",
        textTransform: "uppercase"
    }
})
