import React, { useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Input, Image } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import logo_vertical from '../../../assets/pharmadev.png';
import AwesomeAlert from 'react-native-awesome-alerts';
const { width, height } = Dimensions.get("screen");
import { AuthContext } from '../../providers/Context';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [error, setError] = useState("");
    const [hidePass, setHidePass] = useState(true);

    const { signIn } = useContext(AuthContext)

    const loginHandle = async (username, password) => {
        if (!username || !password) {
            setMensaje("Debe ingresar los datos completos.")
            setAlert(!alert)
        } else {

            const lging = await signIn(username, password)
            if (lging) {
                if (lging.error != "") {
                    setMensaje(lging.msj)
                    setAlert(!alert)
                }
            }
        }
    }

    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={{ alignSelf: "center" }}>
                    <Image
                        style={{ width: width - 30, height: 300, resizeMode: "contain" }}
                        source={logo_vertical}
                    />
                </View>
                <View>
                    <Input
                        placeholder="Correo electrónico o Teléfono"
                        leftIcon={<Icon size={15} name="user" />}
                        value={email}
                        autoCapitalize="none"
                        onChangeText={setEmail}
                    />
                    <Input

                        placeholder="Constraseña"
                        leftIcon={<Icon size={15} name="lock" />}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        returnKeyType="go"
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
                </View>
                <TouchableOpacity style={styles.appButtonContainer} onPress={() => loginHandle(email, password)}>
                    <Text style={styles.appButtonText} allowFontScaling={false}>Iniciar Sesion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('Signup')}>
                    <Text style={{ color: "#00ADB5", fontSize:18 }} allowFontScaling={false}>Crea una cuenta</Text>
                </TouchableOpacity>
                <AwesomeAlert
                    show={alert}
                    showProgress={false}
                    title="PharmaDev/Inicio de sesión"
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
            </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        // alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#00ADB5",
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 12,
        shadowColor: "#00ADB5",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        marginTop: 50,

    },
    appButtonText: {
        fontSize: 16,
        color: "#fff",
        alignSelf: "center",
        textTransform: "uppercase"
    }
});

export default LoginScreen