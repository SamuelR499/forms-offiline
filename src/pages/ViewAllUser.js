import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { DatabaseConnection } from '../database/database-connection';
import Mybutton from './components/Mybutton';
import {openURL} from 'expo-linking';
const db = DatabaseConnection.getConnection();

const ViewAllUser = () => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM data_user',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        }
      );
    });
  }, []);

  const handleClick = async () => {
    const csvData = flatListItems
      .map((item) =>
      `${item.user_id},${item.user_name},${item.user_contact},${item.user_address}`
      )
      .join('\n');
      openURL(`mailto:samuel.ribeiro@fitoway.com.br?subject=SendMail&body=${csvData}`);
     alert('teste');
  };

  let listItemView = (item) => {
    return (
      <View
        key={item.user_id}
        style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
        <Text style={styles.textheader}>Código</Text>
        <Text style={styles.textbottom}>{item.user_id}</Text>

        <Text style={styles.textheader}>Nome</Text>
        <Text style={styles.textbottom}>{item.user_name}</Text>

        <Text style={styles.textheader}>Contato</Text>
        <Text style={styles.textbottom}>{item.user_contact}</Text>

        <Text style={styles.textheader}>E-mail</Text>
        <Text style={styles.textbottom}>{item.user_address}</Text>

        <Text style={styles.textheader}>Instagram</Text>
        <Text style={styles.textbottom}>{item.user_social}</Text>

      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Mybutton  title="Exportar" customClick={handleClick} />
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ marginTop: 30 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textheader: {
    color: '#111',
    fontSize: 12,
    fontWeight: '700',

  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
});

export default ViewAllUser;