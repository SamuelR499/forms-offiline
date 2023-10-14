import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Image
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';


const db = DatabaseConnection.getConnection();

const RegisterUser = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userSocial, setUserSocial] = useState('');

  const submitData = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO mytable_user (user_name, user_contact, user_address, user_social) VALUES (?,?,?,?)',
        [userName, userContact, userAddress, userSocial],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Sucesso',
              'Usuário Registrado com Sucesso !!!',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    setUserName('')
                    setUserContact('')
                    setUserAddress('')
                    setUserSocial('')
                    navigation.navigate('Register')
                  },
                },
              ],
              { cancelable: false }
            );
          } else alert('Erro ao tentar Registrar o Usuário !!!');
        }
      );
    });
    
  };

  const register_user = () => {
    console.log(userName, userContact, userAddress);

    if (!userName) {
      alert('Por favor preencha o nome !');
      return;
    }
    if (!userContact) {
      alert('Por favor preencha o contato !');
      return;
    }
    if (!userAddress) {
      alert('Por favor preencha o e-mail !');
      return;
    }

    Alert.alert(
      'Aviso de Coleta de Dados',
      'Nós coletamos os dados solicitados neste formulário. Seus dados serão usados exclusivamente para os fins indicados e não serão compartilhados com terceiros sem o seu consentimento.\n\nAo clicar em "Concordo", você concorda com o uso responsável de seus dados.',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            Alert.alert(
              'Confirmação',
              'Tem certeza que deseja sair? O conteúdo do formulário será perdido.',
              [
                {
                  text: 'Sim',
                  onPress: () => {
                    setUserName('')
                    setUserContact('')
                    setUserAddress('')
                    setUserSocial('')
                  },
                },
                {
                  text: 'Não',
                  onPress: () => console.log('Não saiu'),

                },
              ],
              { cancelable: false }
            );
          }
        },
        {
          text: 'Concordo',
          onPress: () => submitData(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Image
        source={require('../../assets/images/ftw_logo.webp')}
        style={{ marginTop: 30, margin: 10, alignSelf: 'center' }}
      />
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytextinput
                placeholder="Nome"
                onChangeText={
                  (userName) => setUserName(userName)
                }
                style={{ padding: 10 }}
                value={userName}
              />
              <Mytextinput
                placeholder="Telefone"
                onChangeText={
                  (userContact) => setUserContact(userContact)
                }
                maxLength={10}
                keyboardType="numeric"
                style={{ padding: 10 }}
                value={userContact}
              />
              <Mytextinput
                placeholder="E-mail"
                onChangeText={
                  (userAddress) => setUserAddress(userAddress)
                }
                maxLength={225}
                style={{ padding: 10 }}
                value={userAddress}
              />
              <Mytextinput
                placeholder="Instagram (Opcional)"
                onChangeText={
                  (userSocial) => setUserSocial(userSocial)
                }
                maxLength={225}
                style={{ padding: 10 }}
                value={userSocial}
              />
              <Mybutton title="Salvar" customClick={register_user} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterUser;