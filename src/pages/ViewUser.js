import React, { useState } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import Mytext from './components/Mytext';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const ViewUser = () => {
  let [inputUserId, setInputUserId] = useState('');
  let [userData, setUserData] = useState({});

  let searchUser = () => {
    setUserData({});
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM data1_user where user_id = ?',
        [inputUserId],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            setUserData(results.rows.item(0));
          } else {
            alert('Usuário não encontrado !');
          }
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <Mytext text="Filtro de Usuário" />
          <Mytextinput
            placeholder="Entre com o Código do Usuário"
            onChangeText={
              (inputUserId) => setInputUserId(inputUserId)
            }
            style={{ padding: 10 }}
          />
          <Mybutton title="Buscar Usuário" customClick={searchUser} />
          <View
            style={{
              marginLeft: 35,
              marginRight: 35,
              marginTop: 10
            }}>
            <Text>Código : {userData.user_id}</Text>
            <Text>Nome : {userData.user_name}</Text>
            <Text>Telefone : {userData.user_contact}</Text>
            <Text>E-mail : {userData.user_address}</Text>
            <Text>Instagram : {userData.user_social}</Text>
            <Text>CNPJ : {userData.user_cnpj}</Text>
            <Text>Tipo : {userData.user_type}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewUser;