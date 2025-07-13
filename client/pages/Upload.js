import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { Button, ScrollView, Modal, ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ProgressBar, Portal, Provider as PaperProvider, MD3DarkTheme, useTheme } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker'
import axios from 'axios';
import { API_BASE_URL } from '@env'
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Upload() {
    const [data, setData] = useState(null);
    const [tableHead, setTableHead] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (data) {
            setTableHead(data.columns);

            const rows = data.preview.map(rowObject =>
                data.columns.map(col => rowObject[col])
            );
            setTableData(rows);
        }
    }, [data])

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-excel"
                ],
                copyToCacheDirectory: true
            });

            console.log("DocumentPicker result:", result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                const fileUri = file.uri;
                const fileName = file.name;
                const fileType = file.mimeType;

                console.log("File selected:", fileName, fileType);

                const formData = new FormData();
                formData.append("file", {
                    uri: fileUri,
                    name: fileName,
                    type: fileType,
                });

                console.log("Sending request to server...");
                console.log(API_BASE_URL);

                const res = await axios.post(`${API_BASE_URL}/preview`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                console.log("Server response (columns): ", res.data.columns);
                setData(res.data);
            } else {
                console.log("File selection cancelled");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const handleCleanData = async (setData) => {
        try {
            console.log("Starting data cleaning request...");

            const response = await axios.get(`${API_BASE_URL}/clean`);

            if (response.data && response.data.preview) {
                console.log("Data cleaning complete:", response.data.columns);
                setData({
                    columns: response.data.columns || [],
                    preview: response.data.preview,
                });
            } else {
                Alert.alert("Cleaning failed", "Unexpected response from server.");
                console.error("Unexpected response:", response.data);
            }
        } catch (error) {
            console.error("Error cleaning data:", error);
            Alert.alert("Error", "Failed to clean data. Is the server running?");
        }
    };

    const theme = useTheme;
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');

    const handlePress = () => {
        setIsLoading(true);

        const steps = [
            'Removing empty rows and columns',
            'Parsing dates and fixing formats',
            'Handling missing values',
            'Inferring and correcting data types',
            'Finalizing cleaned dataset',
        ];

        const totalDuration = 10000; // 10 seconds
        const delayPerStep = totalDuration / steps.length; // 2000ms per step

        // Set the first step immediately
        setLoadingStep(`1/${steps.length} ${steps[0]}`);

        // Background cleaning process
        handleCleanData(setData); 

        // Schedule the remaining steps using a loop
        for (let i = 1; i < steps.length; i++) {
            setTimeout(() => {
                setLoadingStep(`${i + 1}/${steps.length} ${steps[i]}`);
                // No setProgress call here as it's not needed
            }, delayPerStep * i); // Calculate delay based on step index
        }

        // Schedule to hide the loading modal after the total duration
        setTimeout(() => {
            setIsLoading(false);
            setLoadingStep(''); // Clear the step text
        }, totalDuration);
    };

    return (
        <PaperProvider theme={MD3DarkTheme}>
            <SafeAreaView style={styles.container}>

                <StatusBar style="light" />

                {!data && (<View style={styles.uploadContainer}>
                    <Text style={styles.uploadPrompt}>Upload your data to perform Analysis: </Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={() => pickFile(setData)}>
                        <Text style={styles.uploadButtonText}>Upload Excel File</Text>
                    </TouchableOpacity>
                </View>)}

                {data && (<View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                        <View style={styles.tableWrapper}>
                            <Table borderStyle={styles.tableBorder}>
                                <Row
                                    data={tableHead}
                                    style={styles.head}
                                    textStyle={styles.headText}
                                    widthArr={tableHead.map(() => styles.cell.width)}
                                />
                            </Table>
                            <ScrollView style={styles.tableContainer}>
                                <Table borderStyle={styles.tableBorder}>
                                    <Rows
                                        data={tableData}
                                        textStyle={styles.text}
                                        widthArr={tableHead.map(() => styles.cell.width)}
                                    />
                                </Table>
                            </ScrollView>
                        </View>
                    </ScrollView>
                    {/* FAB : Data Cleaning */}
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={handlePress}
                        activeOpacity={0.7} // Reduce opacity slightly on press
                    >
                        <MaterialCommunityIcons name="broom" size={32} color="#0b4738" />
                    </TouchableOpacity>
                </View>
                )}

                <Portal>
                    <Modal
                        visible={isLoading}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => { /* optional */ }}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#1DCD9F" />
                                <Text style={styles.loadingText}>{loadingStep}</Text>
                            </View>
                        </View>
                    </Modal>
                </Portal>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 15,
        backgroundColor: '#171717',
    },
    tableWrapper: {
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        margin: 0,
        borderRadius: 8,
    },
    tableContainer: {
        marginTop: 0,
        //maxHeight: 500,
    },
    tableBorder: {
        borderWidth: 1,
        borderColor: '#4c635d',
    },
    head: {
        height: 40,
        backgroundColor: '#4c635d',
    },
    headText: {
        margin: 6,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#8cbaae',
        fontFamily: 'monospace'
    },
    text: {
        margin: 6,
        textAlign: 'center',
        color: '#bab8b8',
        fontFamily: 'monospace'
    },
    cell: {
        width: 120,
    },
    uploadButton: {
        backgroundColor: '#1DCD9F',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 15,
    },
    uploadButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    uploadContainer: {
        flex: 1,
        color: "#ffffff",
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadPrompt: {
        color: '#7a7979',
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#1DCD9F',
        justifyContent: 'center',
        alignItems: 'center',
        right: 20,
        bottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 6,
    },
    fabText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingContainer: {
        width: 300,
        height: 140,
        backgroundColor: '#2b2b2b',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'sans-serif-light',
        marginBottom: 10,
    },
});