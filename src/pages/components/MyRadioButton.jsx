import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const MyRadioButton = ({ label, checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          marginLeft: 35,
          marginRight: 35,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 5,
        }}
      >
        <View
          style={{
            marginRight: 6,
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#b00211',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {checked && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: '#b00211',
              }}
            />
          )}
        </View>
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyRadioButton;
