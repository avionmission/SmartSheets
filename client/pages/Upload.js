import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { Button, ScrollView, Modal, ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ProgressBar, Portal, Provider as PaperProvider } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker'
import axios from 'axios';
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

                const res = await axios.post("http://[YOUR_IP_ADDR]:5000//preview", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                console.log("Server response:", res.data);
                setData(res.data);
            } else {
                console.log("File selection cancelled");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    

    return (
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 15,
        backgroundColor: '#000000',
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
});