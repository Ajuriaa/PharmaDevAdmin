import React, { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Dimensions, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Image, Text } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get("screen");
import Icons from "react-native-vector-icons/FontAwesome";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ProductScreen = ({ navigation }) => {
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
                const response = await fetch('http://192.168.0.2:7777/api/producto/allP', {
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

    const eliminar = async (ProductoId)=>{
        if (!loading) {
            setLoading(true);
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                const response = await fetch('http://192.168.0.2:7777/api/producto/delP', {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },
                    body: JSON.stringify({
                        id: ProductoId
                    })

                });
                const responseJson = await response.json();
                if (responseJson.msj == "El registro ha sido eliminado") {
                    getData()
                    setFilteredData([])
                    setSearch('')
                } else {
                    Alert.alert('Pharmadev',responseJson.msj)
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const ItemView = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => getItem(item)}>
                <View style={styles.producto}>
                    <View style={{ flex: 1 }}>
                        <Image
                            style={{ width: 110, height: 110, resizeMode: "contain" }}
                            source={{ uri: item.productoImagen }}
                        />
                    </View>
                    <View style={{ flex: 2, paddingLeft: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#393E46" }}>{item.ProductoNombre}</Text>
                            <Icons size={26} name="trash" color="white" style={{
                                marginRight: 20,
                                backgroundColor: 'red',
                                borderRadius: 7,
                                paddingHorizontal: 20,
                                textAlign: 'center',
                                textAlignVertical:'center'
                            }}
                            onPress={_ => eliminar(item.id)} />
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#393E46" }} >L.{item.ProductoPrecio}</Text>
                        </View>
                        <View style={styles.row} >
                            <View style={{ flex: 1 }}>
                                <Text>{item.Inventarios[0].InventarioFechaCaducidad.slice(0, 10)}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={styles.txtContador}>
                                    <Text style={styles.txtContadorTexto}>{item.Inventarios[0].InventarioExistencia}</Text>
                                </View>
                            </View>
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
        navigation.navigate('EditPScren', { data: item})
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
        wait(500).then(() => setRefreshing(false));
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
                    }}>Productos</Text>
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
                    <TouchableOpacity style={styles.appButtonContainer} onPress={() => { navigation.navigate('NewPScreen') }}>
                        <Text style={styles.appButtonText}>AÑADIR UN PRODUCTO</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProductScreen

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
    }, txtContador: {
        backgroundColor: "#00ADB5",
        borderRadius: 7,
        paddingVertical: 8,
        paddingHorizontal: 16,
        shadowColor: "#00ADB5",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        marginLeft: 10,
        marginRight: 10
    },
    txtContadorTexto: {
        fontSize: 16,
        color: "#fff",
        alignSelf: "center",
        textTransform: "uppercase",
        fontWeight: 'bold'
    }, row: {
        flex: 1,
        flexDirection: "row"
    },
})
