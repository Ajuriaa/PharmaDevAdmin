import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import { Input, CheckBox, Image } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import logo_vertical from '../../../assets/pharmadev.png';
const { width, height } = Dimensions.get("screen");
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthContext } from '../../providers/Context';
import { estilos } from './styles';


export default function Signup() {
    const [identidad, setIdentidad] = useState(null)
    const [nombre, setNombre] = useState(null)
    const [telefono, setTelefono] = useState(null)
    const [email, setEmail] = useState(null)
    const [contraseña, setContraseña] = useState(null)
    const [validacionContraseña, setValidacionContraseña] = useState(null)
    const [checked, toggleChecked] = useState(false)
    const [alert, setAlert] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [hidePass, setHidePass] = useState(true)
    const [hidePass2, setHidePass2] = useState(true)


    const { signUp } = useContext(AuthContext)

    const signupHandle = async() => {
        if (contraseña !== validacionContraseña) {
            setMensaje('Las contraseñas no coinciden')
            setAlert(!alert)
            return
        }
        if (!identidad || !nombre || !contraseña) {
            setMensaje('Debe escribir los datos completos')
            setAlert(!alert)
            return
        }
        if (!telefono) {
            if (!email) {
                setMensaje('Debe ingresar su correo electrónico o teléfono')
                setAlert(!alert)
                return
            }
        }
        if (!email) {
            if (!telefono) {
                setMensaje('Debe ingresar su correo electrónico o teléfono')
                setAlert(!alert)
                return
            }
        }
        if (!checked) {
            setMensaje('Marque la casilla de acepto los términos')
            setAlert(!alert)
            return
        }
        const lging = await signUp(identidad, nombre, telefono, email, contraseña)
        if (lging) {
            if (lging.error != "") {
                setMensaje(lging.msj)
                setAlert(!alert)
            }
        }

    }
    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View>
                    <View style={{ alignSelf: "center" }}>
                        <Image
                            style={{ width: width - 40, height: 200, resizeMode: "contain" }}
                            source={logo_vertical}
                        />
                    </View>
                    <Input
                        placeholder="Número de identidad"
                        leftIcon={<Icon size={15} name="address-card" />}
                        value={identidad}
                        keyboardType="numeric"
                        maxLength={13}
                        returnKeyType="next"
                        onChangeText={setIdentidad}
                    />
                    <Input
                        placeholder="Nombre completo"
                        leftIcon={<Icon size={15} name="user" />}
                        value={nombre}
                        onChangeText={setNombre}
                        returnKeyType="next"
                    />
                    <Input
                        placeholder="Teléfono"
                        leftIcon={<Icon size={15} name="phone" />}
                        keyboardType="numeric"
                        value={telefono}
                        maxLength={8}
                        onChangeText={setTelefono}
                        returnKeyType="next"
                    />
                    <Input
                        placeholder="Correo electrónico"
                        leftIcon={<Icon size={15} name="envelope" />}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        returnKeyType="next"
                    />
                    <Input
                        placeholder="Contraseña"
                        leftIcon={<Icon size={15} name="lock" />}
                        value={contraseña}
                        onChangeText={setContraseña}
                        returnKeyType="next"
                        secureTextEntry={hidePass ? true : false}
                        rightIcon={
                            <Icon
                                name={hidePass ? 'eye-slash' : 'eye'}
                                size={15}
                                color="black"
                                onPress={() => setHidePass(!hidePass)}
                            />
                        }
                    />
                    <Input
                        placeholder="Verificar Contraseña"
                        leftIcon={<Icon size={15} name="lock" />}
                        value={validacionContraseña}
                        onChangeText={setValidacionContraseña}
                        returnKeyType="go"
                        secureTextEntry={hidePass2 ? true : false}
                        rightIcon={
                            <Icon
                                name={hidePass2 ? 'eye-slash' : 'eye'}
                                size={15}
                                color="black"
                                onPress={() => setHidePass2(!hidePass2)}
                            />
                        }
                    />
                    <TouchableOpacity style={styles.appButtonContainer} onPress={() => signupHandle()} >
                        <Text style={styles.appButtonText}>Iniciar Sesion</Text>
                    </TouchableOpacity>
                    <CheckBox
                        title='He leído y acepto los términos y condiciones.'
                        checkedColor='#00ADB5'
                        checked={checked}
                        onPress={() => toggleChecked(!checked)}
                    />
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
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}





const styles = StyleSheet.create(estilos);
