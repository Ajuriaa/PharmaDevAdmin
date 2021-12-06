import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Image, Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import defaultIMG from '../../../assets/default.jpg'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditPScren = ({route,navigation }) => {
    const [nombre, setNombre] = useState(route.params.data.ProductoNombre)
    const [descripcion, setDescripcion] = useState(route.params.data.ProductoDescripcion)
    const [precio, setPrecio] = useState(route.params.data.ProductoPrecio.toString())
    const [existencia, setExistencia] = useState(route.params.data.Inventarios[0].InventarioExistencia)
    const [url, setUrl] = useState(route.params.data.productoImagen)
    const [fecha, setFecha] = useState(new Date(route.params.data.Inventarios[0].InventarioFechaCaducidad))
    const [imagen, setImagen] = useState(null)
    const [laboratorio, setLaboratorio] = useState(route.params.data.Laboratorio.id)
    const [presentacion, setPresentacion] = useState(route.params.data.Presentacion.id)
    const [laboratorios, setLaboratorios] = useState([])
    const [presentaciones, setPresentaciones] = useState([])
    const [show, setShow] = useState(false)

    const getPresentaciones = async () => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            const response = await fetch('http://192.168.0.2:7777/api/presentacion/allP', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonValue.token,
                }
            });
            const json = await response.json();
            setPresentaciones(json.data)
        } catch (error) {
            console.error(error);
        }
    }

    const getLaboratorios = async () => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            const response = await fetch('http://192.168.0.2:7777/api/laboratorio/allL', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonValue.token,
                }
            });
            const json = await response.json();
            setLaboratorios(json.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPresentaciones()
        getLaboratorios()
    }, [])

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
            setUrl(result.uri)
            setImagen(result)
        }
    };

    const pressGuardar = async () => {
        try {
            let formData = new FormData();
            if (imagen) {
                let fileType = imagen.uri.substring(imagen.uri.lastIndexOf(".") + 1);
                formData.append("photo", {
                    uri: imagen.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`
                });
            }
            let jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            formData.append('ProductoNombre', nombre)
            formData.append('ProductoDescripcion', descripcion)
            formData.append('ProductoPrecio', precio)
            formData.append('LaboratorioId', laboratorio)
            formData.append('PresentacionId', presentacion)
            formData.append('InventarioExistencia', existencia)
            formData.append('id', route.params.data.id)
            formData.append('InventarioFechaCaducidad', fecha.toISOString().slice(0, 10))
            const response = await fetch('http://192.168.0.2:7777/api/producto/updateP', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + jsonValue.token,
                },
                body: formData,
            });
            const json = await response.json();
            json.msj === 'Registro actualizado  exitosamente.' ? navigation.goBack() : Alert.alert('Parmdev',json.msj)
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
                    {url && <Image source={{ uri: url }} style={styles.profileIMG} />}
                    <Button title='Agregar Imagen' containerStyle={{ marginBottom: 20, width: '95%' }}
                        buttonStyle={styles.boton} onPress={pickImage} />
                    <Input label='Nombre del producto' value={nombre} onChangeText={setNombre} />
                    <Input label='Descripcion del producto' value={descripcion} onChangeText={setDescripcion} />
                    <Input label='Precio del producto' value={precio} onChangeText={setPrecio} keyboardType='numeric' />
                    <Input label='Existencias' value={existencia} onChangeText={setExistencia} keyboardType='numeric' />

                    <Text style={{ fontSize: 16, color: '#86939e', fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 10, marginBottom: 10 }}>Fecha de vencimiento: {fecha.toISOString().slice(0, 10)} </Text>
                    <Button title='Seleccionar Fecha' containerStyle={{ marginBottom: 20, width: '95%' }}
                        buttonStyle={styles.boton} onPress={handleDTP} />
                    {show && <DateTimePicker
                        value={fecha}
                        mode='date'
                        onChange={onChange}
                    />}
                    <Text style={{ fontSize: 16, color: '#86939e', fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 10 }}>Laboratorio</Text>
                    <Picker
                        selectedValue={laboratorio}
                        onValueChange={(itemValue, itemIndex) =>
                            setLaboratorio(itemValue)
                        }
                        style={{ width: '95%', marginBottom: 10 }}>
                        {laboratorios.map(x => {
                            return <Picker.Item label={x.LaboratorioNombre} value={x.id} key={x.id} />
                        })}
                    </Picker>
                    <Text style={{ fontSize: 16, color: '#86939e', fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 10 }}>Presentacion</Text>
                    <Picker
                        selectedValue={presentacion}
                        onValueChange={(itemValue, itemIndex) =>
                            setPresentacion(itemValue)
                        }
                        style={{ width: '95%', marginBottom: 10 }}>
                        {presentaciones.map(x => {
                            return <Picker.Item label={x.PresentacionNombre} value={x.id} key={x.id} />
                        })}
                    </Picker>
                    <Button title='Guardar Cambios'
                        containerStyle={{ marginBottom: 10, width: '95%' }}
                        buttonStyle={styles.boton}
                        onPress={pressGuardar} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditPScren

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
