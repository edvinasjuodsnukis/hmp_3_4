import { StyleSheet, Text, Touchable, TouchableOpacity, View, Image, FlatList, Modal, TouchableWithoutFeedback, TextInput, Button, CheckBox, Switch} from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { images, icons, COLORS, FONTS, SIZES } from '../constants'
import { Svg, Polygon } from 'react-native-svg'
import { recentlyViewedLabel } from '../constants/images'
import { BlurView } from "expo-blur"

import uuid from 'react-native-uuid';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"])


const HomeScreen = () => {

  const [backCount, setBackCount] = React.useState(0)
  //this.backCount = 0
  const [showAddToBagModal, setShowAddToBagModal] = React.useState(false)
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [selectedSize, setSelectedSize] = React.useState("")

  const [name, setName] = useState("Nike Metcon Free")
  const [bgColor, setBgColor] = useState("#A02E41")
  const [type, setType] = useState("TRAINING")
  const [price, setPrice] = useState("$108")
  const [sizes, setSizes] = useState([6, 7, 8, 9, 10, 11])
  const [img, setImg] = useState("")
  
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    var query = db.ref("shoe").orderByKey();
    query.once("value")
      .then(function (snapshot) {
        const items = []
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          //console.log(key)
          const { name, bgColor, type, price, sizes, img } = childSnapshot.val()
          items.push({
            id: key,
            name,
            bgColor,
            type,
            price,
            sizes,
            img
          })
        });
        setBlogs(items)
        //console.log(items.id)
      })
  }
  useEffect(() => {
    fetchBlogs();
  }, [])

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
        img: img
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
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      });
  }

  const updateData = (id) => {
    db
      .ref('shoe/')
      .set({
        name: name,
        bgColor: bgColor,
        type: type,
        price: price,
      })
      .then(() => {
        console.log("Updated shoe ID: ", id);
        alert("Shoe Updated!")
        setName("")
        setBgColor("")
        setType("")
        setPrice("")
        setSizes([""])
        setImg("")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      });
  }

  const deleteItem = (id) => {
    db.ref("shoe/" + id).remove()
    .then(() => {
      alert("Item Deleted")
      navigation.replace("Home")

    })
    .catch(() => alert("No"))
  }

  const navigation = useNavigation()
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }


  //Render

  function renderTrendingShoes(item, index) {
    var trendingStyle = {};

    if (index == 0) {
      trendingStyle = { marginLeft: SIZES.padding }
    }

    return (
      <TouchableOpacity
        style={{ height: 240, width: 180, justifyContent: 'center', marginHorizontal: SIZES.base, ...trendingStyle }}
        onPress={() => {
          setSelectedItem(item)
          setShowAddToBagModal(true)
        }}
      >
        <Text style={{ color: COLORS.gray, ...FONTS.h5 }}>{item.type}</Text>
        <View
          style={[{
            flex: 1,
            justifyContent: 'flex-end',
            marginTop: SIZES.base,
            borderRadius: 10,
            marginRight: SIZES.padding,
            paddingLeft: SIZES.radius,
            paddingRight: SIZES.padding,
            paddingBottom: SIZES.radius,
            backgroundColor: item.bgColor
          }, styles.trendingShadow]}
        >
          <View style={{ height: '35%', justifyContent: 'space-between' }}>
            <Text style={{ color: COLORS.white, ...FONTS.body4 }}>{item.name}</Text>
            <Text style={{ color: COLORS.white, ...FONTS.body }}>{item.price}</Text>
          </View>
        </View>

        <View style={{ position: "absolute", top: 27, right: 0, width: "95%", height: "100%", marginTop: -1 }}>
          <Svg height="100%" width="100%">
            <Polygon

              points="0, 0 160, 0 160, 80"
              fill="white"
            />
          </Svg>
        </View>

        <Image
          source={{uri: item.img}}
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 50,
            right: 0,
            width: "98%",
            height: 80,
            transform: [
              { rotate: "-15deg" }
            ]
          }}
        />

      </TouchableOpacity>
    )
  }


  function renderRecentlyViewed(item, index) {
    return (
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row' }}
        onPress={() => {
          setSelectedItem(item)
          //setSelectedSize("")
          setShowAddToBagModal(true)
        }}
      >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Image
            source={{uri:item.img}}
            resizeMode="contain"
            style={{
              width: 130,
              height: 100

            }}
          />
        </View>
        <View style={{ flex: 1.5, marginLeft: SIZES.radius, justifyContent: 'center' }}>
          <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>{item.name}</Text>
          <Text style={{ ...FONTS.h3 }}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEditShoe = () => {
    return (
      <View style={{ justifyContent: "center", width: "85%", backgroundColor: selectedItem.bgColor }}>
        <View style={{ alignItems: "center", justifyContent: "center", marginTop: -SIZES.padding * 2 }}>
          <Image
            source={{uri:selectedItem.img}}
            resizeMode="contain"
            style={{
              width: "90%",
              height: 170,
              transform: [
                { rotate: "-15deg" }
              ]
            }}
          />
        </View>
        <Button title = "Delete" onPress={() => deleteItem(selectedItem.id)}/>
        <TextInput style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding, color: COLORS.white, ...FONTS.body2 }}
          value={selectedItem.name}
          onChangeText={name => setName(name)}
        ></TextInput>
        <TextInput style={{ marginTop: SIZES.base / 2, marginHorizontal: SIZES.padding, color: COLORS.white, ...FONTS.body3 }}
          value={selectedItem.type}
          onChangeText={type => setType(type)}
        ></TextInput>
        <TextInput style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding, color: COLORS.white, ...FONTS.h1 }}
          value={selectedItem.price}
          onChangeText={price => setPrice(price)}
        ></TextInput>
        


        <View style={{ flexDirection: "row", marginTop: SIZES.radius, marginHorizontal: SIZES.padding }}>
          <View>
            <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Select Size</Text>
          </View>
          <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row", marginLeft: SIZES.radius }}>
            {renderShoeSizes()}
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: "100%",
            height: 70,
            marginTop: SIZES.base,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
          onPress={() => {
            setSelectedItem(null)
            setSelectedSize("")
            setShowAddToBagModal(false)
            setBackCount(0)
            setShowEditModal(false)
          }}
        >
          <TouchableOpacity 
          onPress={() => updateData(selectedItem.id)}
          >
           <Text style={{ color: COLORS.white, ...FONTS.largeTitleBold }}>SAVE EDIT</Text></TouchableOpacity>
        </TouchableOpacity>
      </View>
    )
  }
  function renderShoeSizes() {
    return (
      selectedItem.sizes.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={{
              width: 35,
              height: 25,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 5,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: COLORS.white,
              borderRadius: 5,
              backgroundColor: selectedItem.sizes[index] == selectedSize ? COLORS.white : null
            }}
            onPress={() => {
              setSelectedSize(item)
            }}
          >
            <Text style={{ color: selectedItem.sizes[index] == selectedSize ? COLORS.black : COLORS.white, ...FONTS.body4 }}>{item}</Text>
          </TouchableOpacity>
        )
      })
    )
  }

  function renderModalMain() {
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={showAddToBagModal}
    >

      <BlurView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        blurType="light"
        blurAmount={20}
        reducedTransparencyFallbackColor="white"
      >
        {/* Button to close MODAL */}
        <TouchableOpacity
          style={styles.absolute}
          onPress={() => {
            setSelectedItem(null)
            setSelectedSize("")
            setShowAddToBagModal(false)

          }}
        >
        </TouchableOpacity>

        {/* MODAL content */}
        {/* MODAL for EDIT */}
        <TouchableWithoutFeedback
          //visible={showEditModal}
          onPress={() => {
            setBackCount(backCount + 1)
            if (backCount == 3) {
              clearTimeout(this.backTimer)
              console.warn("Clicked three times! edit")
              setSelectedSize("")
              setShowAddToBagModal(false)
              setShowEditModal(true)
              //console.warn(backCount)
            } else {

              this.backTimer = setTimeout(() => {
                setBackCount(0)
              }, 2000)

            }
          }}
        >
          {/* MODAL main */}
          <View style={{ justifyContent: "center", width: "85%", backgroundColor: selectedItem.bgColor }}>
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: -SIZES.padding * 2 }}>
              <Image
                source={{uri:selectedItem.img}}
                resizeMode="contain"
                style={{
                  width: "90%",
                  height: 170,
                  transform: [
                    { rotate: "-15deg" }
                  ]
                }}
              />
            </View>
            <Text style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding, color: COLORS.white, ...FONTS.body2 }}>{selectedItem.name}</Text>
            <Text style={{ marginTop: SIZES.base / 2, marginHorizontal: SIZES.padding, color: COLORS.white, ...FONTS.body3 }}>{selectedItem.type}</Text>
            <Text style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding, color: COLORS.white, ...FONTS.h1 }}>{selectedItem.price}</Text>
            <View style={{ flexDirection: "row", marginTop: SIZES.radius, marginHorizontal: SIZES.padding }}>
              <View>
                <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Select Size</Text>
              </View>
              <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row", marginLeft: SIZES.radius }}>
                {renderShoeSizes()}
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: "100%",
                height: 70,
                marginTop: SIZES.base,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
              onPress={() => { //ADD TO BAG
                setSelectedItem(null)
                setSelectedSize("")
                setShowAddToBagModal(false)
              }}
            >
              <Text style={{ color: COLORS.white, ...FONTS.largeTitleBold }}> Add To Bag</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
    )
  }

  function renderSwitchKey() {

    

  return (
    <View style={{ marginLeft: 35}}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
  }

  function renderModalMainEdit() {
    return (
      <Modal
            animationType="slide"
            transparent={true}
            visible={showEditModal}
          >
            <BlurView
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              blurType="light"
              blurAmount={20}
              reducedTransparencyFallbackColor="white"
            >
              {renderEditShoe()}

            </BlurView>
          </Modal>
    )
  }
  var start = 0
    var end = 4
    var selectedCategory = 0
    if (isEnabled) {
      start = 0
      end = 4
    } else if (!isEnabled) {
      start = 4
      end = 9
    }
  return (
    
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleSignOut}>
        <Text style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding, ...FONTS.largeTitleBold }}>
          SIGN OUT
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Add New Shoe")}>
      <Text style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding, ...FONTS.largeTitleBold }}>
        ADD NEW SHOE
      </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate("QR Scanner")}
      >
      <Text style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding, ...FONTS.largeTitleBold }}>
        QR Scanner
      </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Add New Shoe")}>
      <Text style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding, ...FONTS.largeTitleBold }} >
        TRENDING 
      </Text>
      </TouchableOpacity>
      {renderSwitchKey()}


      {/* Trending */}
      <View style={{ height: 260, marginTop: SIZES.radius }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={blogs.slice(start, end)}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => renderTrendingShoes(item, index)}
        />
      </View>

      {/* Recently Viewed */}

      <View
        style={[{
          flex: 1,
          flexDirection: 'row',
          marginTop: SIZES.padding,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: COLORS.white
        }, styles.recentContainerShadow]}
      >
        <View
          style={{ width: 70, marginLeft: SIZES.base }}
        >
          <Image
            source={images.recentlyViewedLabel}
            resizeMode="contain"
            style={{
              width: "100%",
              height: "100%"
            }}
          />
        </View>
        <View style={{ flex: 1, paddingBottom: SIZES.padding }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={blogs}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => renderRecentlyViewed(item, index)}
          />
        </View>

        {/* MODAL */}
        {selectedItem &&
          renderModalMain()
        }
        {/* MODAL edit */}
        {selectedItem &&
          renderModalMainEdit()
        }
        

      </View>

      
      {/* <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity> */}
    </View>

  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,

  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  trendingShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  recentContainerShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})