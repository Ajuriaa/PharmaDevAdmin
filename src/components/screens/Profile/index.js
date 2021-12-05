import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("screen");
import { AuthContext } from '../../providers/Context';
import { estilos } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function ProfileScreen({ navigation }) {
    const { signOut } = useContext(AuthContext)
    const [alert, setAlert] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [exito, setExito] = useState(false)

    const handleResPass = async _ => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            if (jsonValue.usuarioCorreo) {
                const response = await fetch('http://192.168.0.2:7777/api/autenticacion/recPass', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },
                    body: JSON.stringify({
                        correo: jsonValue.usuarioCorreo
                    })
                });
                const json = await response.json();
                if (json.msj !== "correo enviado") {
                    setMensaje(json.msj)
                    setAlert(!alert)
                } else {
                    setMensaje('Perfil actualizado exitosamente, se envió a su correo electrónico su nueva contraseña, por favor inicie sesión nuevamente para refrescar los datos 💚')
                    setAlert(!alert)
                    setExito(!exito)
                }
            } else {
                setMensaje('Para realizar esta acción debe registrar previamente un correo electrónico válido en Informacion Personal ')
                setAlert(!alert)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View style={styles.encabezado}>
                    <View style={styles.encabezadoTexto}>
                        <Text style={styles.titulo1}>INFORMACIÓN DE PERFIL</Text>
                    </View>
                </View>
                <View style={styles.cuerpo}>
                    <View style={styles.cuerpo2}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={styles.cajas}>
                                <TouchableOpacity style={{ flex: 1 }}
                                    onPress={() => navigation.navigate('InformationScreen')}>
                                    <View style={styles.iconoCaja}>
                                        <Icon
                                            size={60} color="#393E46"
                                            name='address-card'
                                        />
                                    </View>
                                    <View style={styles.textoCaja}>
                                        <Text>Información Personal</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cajas2}>
                                <TouchableOpacity style={{ flex: 1 }}
                                    onPress={_ => navigation.navigate('RPasswordScreen')}>
                                    <View style={styles.iconoCaja}>
                                        <Icon
                                            size={60} color="#393E46"
                                            name='eye-slash'
                                        />
                                    </View>
                                    <View style={styles.textoCaja}>
                                        <Text>Cambio de Contraseña</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cajas2}>
                                <TouchableOpacity style={{ flex: 1 }}
                                    onPress={handleResPass}>
                                    <View style={styles.iconoCaja}>
                                        <Icon
                                            size={60} color="#393E46"
                                            name='lock'
                                        />
                                    </View>
                                    <View style={styles.textoCaja}>
                                        <Text>Olvidó la Contraseña</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.pie}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={styles.btnCerrar} onPress={() => { signOut() }}>
                            <Text style={styles.txtCerrar}>Cerrar Sesion</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <AwesomeAlert
                    show={alert}
                    showProgress={false}
                    title="PharmaDev"
                    message={mensaje}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    cancelText=" No "
                    confirmText=" CONFIRMAR "
                    confirmButtonColor="#00ADB5"
                    cancelButtonColor='#ff8080'
                    onCancelPressed={() => {
                        setAlert(!alert)
                    }}
                    onConfirmPressed={() => {
                        setAlert(!alert)
                        exito && signOut()
                    }}
                />
            </ScrollView>
        </SafeAreaProvider>
    );
}



const styles = StyleSheet.create(estilos);
