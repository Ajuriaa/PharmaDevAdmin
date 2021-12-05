import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Image, Input } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import defaultIMG from '../../../assets/default.jpg'
import DatePicker from 'react-native-datepicker'
import * as ImagePicker from 'expo-image-picker';

const PresAdd = () => {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{flex:1, alignItems:'center', justifyContent:'center', margin:10}}>
                    <Input label='Nombre de la Presentacion' value={nombre} onChange={setNombre} />
                    <Input label='Descripcion de la Presentacion' value={descripcion} onChange={setDescripcion} />
                    <Button title='Guardar Presentacion' containerStyle={{marginBottom:10, width:'90%'}} buttonStyle={styles.boton}/>
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
