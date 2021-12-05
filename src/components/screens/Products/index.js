import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProductScreen = () => {
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{ flex: 1}}>
                <View style={{ flex: 1,backgroundColor: "#00ADB5",alignItems:'center', justifyContent:'center' }}>
                    <Text style={{
                        color:'white',
                        fontSize:22,
                        fontWeight:'bold'
                    }}>Productos</Text>
                </View>
                <View style={{ flex: 6 }}>
                    
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProductScreen

const styles = StyleSheet.create({})
