import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';

import Mytext from './components/Mytext';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const UpdateUser = ({ navigation }) => {
  let [inputUserId, setInputUserId] = useState('');
  let [userName, setUserName] = useState('');
  let [userContact, setUserContact] = useState('');
  let [userAddress, setUserAddress] = useState('');
  let [userSocial, setUserSocial] = useState('');


  let updateAllStates = (name, contact, address, social) => {
    setUserName(name);
    setUserContact(contact);
    setUserAddress(address);
    setUserSocial(social);
  };

  let searchUser = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM data_user where user_id = ?',
        [inputUserId],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            updateAllStates(
              res.user_name,
              res.user_contact,
              res.user_address,
              res.user_social
            );
          } else {
            alert('Usuário não encontrado!');
            updateAllStates('', '', '', '');
          }
        }
      );
    });
  };
  let updateUser = () => {

    if (!inputUserId) {
      alert('Por Favor informe o Código!');
      return;
    }
    if (!userName) {
      alert('Por favor informe o Nome !');
      return;
    }
    if (!userContact) {
      alert('Por Favor informe o Telefone !');
      return;
    }
    if (!userAddress) {
      alert('Por Favor informe o E-mail !');
      return;
    }
    if (!userSocial) {
      alert('Por Favor informe o Instagram !');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE data_user set user_name=?, user_contact=? , user_address=?, user_social=? where user_id=?',
        [userName, userContact, userAddress, userSocial, inputUserId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Sucesso',
              'Usuário atualizado com sucesso !!',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Erro ao atualizar o usuário');
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytext text="Filtro de Usuário" />
              <Mytextinput
                placeholder="Entre com o Código do Usuário"
                style={{ padding: 10 }}
                onChangeText={
                  (inputUserId) => setInputUserId(inputUserId)
                }
              />
              <Mybutton
                title="Buscar Usuário"
                customClick={searchUser}
              />
              <Mytextinput
                placeholder="Entre com o Nome"
                value={userName}
                style={{ padding: 10 }}
                onChangeText={
                  (userName) => setUserName(userName)
                }
              />
              <Mytextinput
                placeholder="Entre com o Telefone"
                value={'' + userContact}
                onChangeText={
                  (userContact) => setUserContact(userContact)
                }
                maxLength={10}
                style={{ padding: 10 }}
                keyboardType="numeric"
              />
              <Mytextinput
                value={userAddress}
                placeholder="Entre com o E-mail"
                onChangeText={
                  (userAddress) => setUserAddress(userAddress)
                }
                maxLength={225}
                style={{ padding: 10 }}
              />
              <Mytextinput
                value={userSocial}
                placeholder="Entre com o Instagram"
                onChangeText={
                  (userSocial) => setUserSocial(userSocial)
                }
                maxLength={225}
                style={{ padding: 10 }}
              />
              <Mybutton
                title="Atualizar Usuário"
                customClick={updateUser}
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateUser;