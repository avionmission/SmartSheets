import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'
import axios from 'axios';
import { Table, Row, Rows } from 'react-native-table-component';

export default function App() {
  const [data, setData] = useState(null);
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if(data) {
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

      // Updated condition for newer expo-document-picker versions
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
    <View style={styles.container}>
      <Button title="Upload Excel File" onPress={() => pickFile(setData)} />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  tableWrapper: {
    flexDirection: 'column',
  },
  tableContainer: {
    marginTop: 10,
    maxHeight: 400,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  headText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  cell: {
    width: 120,
  },
});