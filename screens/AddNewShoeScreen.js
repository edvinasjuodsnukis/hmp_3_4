import { StyleSheet, Text, Touchable, TouchableOpacity, View, Image, FlatList, Modal, TouchableWithoutFeedback, TextInput, Button, Platform  } from 'react-native'
import React, { useState, useEffect } from 'react'
import { images, icons, COLORS, FONTS, SIZES } from '../constants'
import uuid from 'react-native-uuid';
import { auth, db } from '../firebase'
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'

export default function AddNewShoeScreen() {
    
    const [name, setName] = useState()
    const [bgColor, setBgColor] = useState()
    const [type, setType] = useState()
    const [price, setPrice] = useState()
    const [sizes, setSizes] = useState()
    const [img, setImg] = useState()

    const navigation = useNavigation()

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };
    
    const writeData = () => {
        const id = uuid.v4()
        db
          .ref('shoe/' + id)
          .set({
            name: name,
            bgColor: bgColor,
            type: type,
            price: price,
            sizes: sizes,
            img: image
          })
          .then(() => {
            console.log("New document created, ID: ", id);
            alert("Shoe Added!")
            setName("")
            setBgColor("")
            setType("")
            setPrice("")
            setSizes([""])
            setImg("")
            navigation.replace("Home")
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          });
      }

      function renderAddShoeBlock() {
        return (
            // {
            // var: tempColor = "",
            // if (value={bgColor} == ""){
            //     tempColor = "#E0DACC"
            // },
            // else: {
            //     tempColor = 
            // }},
            <View style={{ flexDirection: 'row', padding: 24, alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ marginRight: 10 }}>
          {/* Name  */}
          <TextInput
            style={{ backgroundColor: bgColor, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, borderWidth: 2 }}
            placeholder='Enter Name here'
            placeholderTextColor={'#808080'}
            value={name}
            onChangeText={text =>setName(text)}
          />
          {/* Color */}
          <TextInput
            style={{ backgroundColor: bgColor, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, borderWidth: 2 }}
            placeholder='Enter Color here'
            placeholderTextColor={'#808080'}
            value={bgColor}
            onChangeText={text =>setBgColor(text)}
          />
          {/* Type  */}
          <TextInput
            style={{ backgroundColor: bgColor, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, borderWidth: 2}}
            placeholder='Enter Type here'
            placeholderTextColor={'#808080'}
            value={type}
            onChangeText={text => setType(text)}
          />
          {/* Price  */}
          <TextInput
            style={{ backgroundColor: bgColor, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, borderWidth: 2 }}
            placeholder='Enter Price here'
            placeholderTextColor={'#808080'}
            value={price}
            onChangeText={text => setPrice(text)}
          />
          {/* Sizes  */}
          <TextInput
            style={{ backgroundColor: bgColor, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, borderWidth: 2 }}
            placeholder='Enter Sizes here'
            placeholderTextColor={-bgColor}
            value={[sizes]}
            onChangeText={text => setSizes([text])}
          />
          <Button title = "add shoe" onPress={() => writeData()}>
            
          </Button>
        
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            
        </View>
        
      </View>
        )
      }
  return (
    <View>
      {renderAddShoeBlock()}
    </View>
  )
}

const styles = StyleSheet.create({})