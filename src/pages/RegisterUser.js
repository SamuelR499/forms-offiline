import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import MyRadioButton from './components/MyRadioButton';

import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const RegisterUser = ({ navigation }) => {
  const radiusOptions = ['Pessoa Física', 'Pessoa Jurídica', 'Nutricionista'];

  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userSocial, setUserSocial] = useState('');
  const [userCnpj, setUserCnpj] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(radiusOptions[0]);

  const handleCnpjChange = (text) => {
    const cnpj = text.replace(/\D/g, '');

    if (cnpj.length <= 14) {
      // Formata o CNPJ com pontos, barra e traço conforme o usuário digita
      let formatted = '';
      for (let i = 0; i < cnpj.length; i++) {
        if (i === 2 || i === 5) {
          formatted += `.${cnpj[i]}`;
        } else if (i === 8) {
          formatted += `/${cnpj[i]}`;
        } else if (i === 12) {
          formatted += `-${cnpj[i]}`;
        } else {
          formatted += cnpj[i];
        }
      }
      setUserCnpj(formatted);
    } else {
      setUserCnpj(text); // Se não tiver 14 dígitos, apenas atualize o campo com o valor não formatado
    }
  };

  const handlePhoneChange = (text) => {
    const phone = text.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    let formatted = '';
    for (let i = 0; i < phone.length; i++) {
      if (i === 0) {
        formatted += `(${phone[i]}`;
      } else if (i === 2) {
        formatted += `) ${phone[i]}`;
      } else if (i === 7) {
        formatted += `-${phone[i]}`;
      } else {
        formatted += phone[i];
      }
    }

    setUserContact(formatted);
  };

  const submitData = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO data_user (user_name, user_contact, user_address, user_social, user_cnpj) VALUES (?,?,?,?,?)',
        [userName, userContact, userAddress, userSocial, userCnpj],
        (tx, results) => {
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
                    setUserCnpj('')
                    setSelectedRadius(radiusOptions[0]); // Resetar para a opção padrão
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
    console.log(userName, userContact, userAddress, userSocial, userCnpj);
    console.log(':::::::::::RADIUS::::: --> ', selectedRadius);

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
                    setUserCnpj('')
                    setSelectedRadius(radiusOptions[0]);
                  },
                },
                {
                  text: 'Não',
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
          style={{ marginVertical: 30, margin: 10, alignSelf: 'center' }}
        />
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              {radiusOptions.map((option, index) => (
                <View key={index}>
                  <MyRadioButton
                    label={option}
                    checked={selectedRadius === option}
                    onPress={() => setSelectedRadius(option)}
                  />
                </View>
              ))}
              <Mytextinput
                placeholder="Nome"
                onChangeText={(userName) => setUserName(userName)}
                style={{ padding: 10 }}
                value={userName}
              />
              <Mytextinput
                placeholder="Telefone"
                onChangeText={handlePhoneChange}
                maxLength={14} 
                keyboardType="numeric"
                style={{ padding: 10 }}
                value={userContact}
              />
              <Mytextinput
                placeholder="E-mail"
                onChangeText={(userAddress) => setUserAddress(userAddress)}
                maxLength={225}
                style={{ padding: 10 }}
                value={userAddress}
              />
              <Mytextinput
                placeholder="Instagram (Opcional)"
                onChangeText={(userSocial) => setUserSocial(userSocial)}
                maxLength={225}
                style={{ padding: 10 }}
                value={userSocial}
              />
              { selectedRadius === radiusOptions[1] && (
                <Mytextinput
                placeholder="CNPJ"
                onChangeText={handleCnpjChange}
                maxLength={18} // Defina o máximo para o valor formatado
                keyboardType="numeric"
                style={{ padding: 10 }}
                value={userCnpj}
                />
              )}
              <Mybutton title="Salvar" customClick={register_user} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterUser;
