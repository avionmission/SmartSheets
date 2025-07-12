import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'
import axios from 'axios';
import { Table, Row, Rows } from 'react-native-table-component';

export default function Analysis() {
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

        const res = await axios.post("http://192.168.0.105:5000//preview", formData, {
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

      <StatusBar style="light"/>

      {!data && (<View style={styles.uploadContainer}>
        <Text style={styles.uploadPrompt}>Upload your data to perform Analysis: </Text>
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickFile(setData)}>
          <Text style={styles.uploadButtonText}>Upload Excel File</Text>
        </TouchableOpacity>
      </View>)}

      {data && (
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#000000',
  },
  tableWrapper: {
    flexDirection: 'column',
    backgroundColor: '#222222',
    margin: 10,
    borderRadius: 8,
  },
  tableContainer: {
    marginTop: 10,
    //maxHeight: 500,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#1DCD9F',
  },
  head: {
    height: 40,
    backgroundColor: '#1DCD9F',
  },
  headText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000'
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: '#ffffff',
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
});