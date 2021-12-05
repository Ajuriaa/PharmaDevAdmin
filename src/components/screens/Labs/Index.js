import React, { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Dimensions, StyleSheet, FlatList, ActivityIndicator, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Image, Text } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get("screen");


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const LaboratoriosScreen = () => {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => { getData() }, []);

    const getData = async () => {
        if (!loading) {
            setLoading(true);
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                const response = await fetch('http://192.168.0.2:7777/api/laboratorio/allL', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },

                });
                const responseJson = await response.json();
                if (responseJson.data.length > 0) {
                    setDataSource([...responseJson.data]);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    const ItemView = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => getItem(item)}>
                <View style={styles.producto}>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }} >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#393E46" }}>{item.LaboratorioNombre}</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 16, color: "#393E46" }} >{item.LaboratorioDescripcion}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        return (
            // Footer View with Loader
            <View style={styles.footer}>
                {loading ? (
                    <ActivityIndicator
                        color="black"
                        style={{ margin: 15 }} />
                ) : null}
            </View>
        );
    };

    const getItem = (item) => {
        // navigation.navigate('ProductScreen', { data: item})
    };

    const searchProducts = async (kword) => {
        let filteredDataS = dataSource.filter(function (item) {
            return item.ProductoNombre.toLowerCase().includes(kword.toLowerCase());
        });
        setFilteredData(filteredDataS)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        getData()
        wait(1000).then(() => setRefreshing(false));
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={{ height: 100, backgroundColor: "#00ADB5", alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginTop: 10
                    }}>Laboratorios</Text>
                    <Input
                        placeholder="🔎"
                        inputStyle={{ backgroundColor: 'white', borderRadius: 7, padding: 10 }}
                        value={search}
                        onChangeText={search => { setSearch(search); searchProducts(search) }}
                    />
                </View>
                <View style={{ flex: 6 }}>
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    >
                        <FlatList
                            data={filteredData && filteredData.length > 0 ? filteredData : dataSource}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={ItemView}
                            ListFooterComponent={renderFooter}
                            initialNumToRender={6}
                        />
                    </RefreshControl>
                </View>
                <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.appButtonContainer} >
                        <Text style={styles.appButtonText}>AÑADIR UN LABORATORIO</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LaboratoriosScreen

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#393E46",
        borderRadius: 7,
        paddingVertical: 8,
        paddingHorizontal: 10,
        shadowColor: "#393E46",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

    }, appButtonText: {
        fontSize: 14,
        color: "#fff",
        alignSelf: "center",
        textTransform: "uppercase"
    }, producto: {
        height: 120,
        backgroundColor: "white",
        borderRadius: 7,
        marginTop: 20,
        flexDirection: "row",
        padding: 5
    },
})