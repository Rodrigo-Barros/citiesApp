import React, {useState, Component} from 'react';
import {Button, TouchableOpacity, FlatList, Text, TextInput, View} from 'react-native';
import {NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


const styles = {
  // Home
  home:{
    flex:1,
    backgroundColor:'#FFF',
    cityArea:{
      padding:10,
      color: '#000',
      fontSize: 20,
      borderBottomWidth:0.5,
      borderBottomColor:'#000'
    },
    title:{
      fontSize:30,
      padding:10,
      color:'#fff',
      backgroundColor:'#ac00b6'
    },
  },

  // submitCity
  submitCity:{
    container:{
      flex:1,
      backgroundColor:'#ac00b6',
      alignItems:'center',
      justifyContent:'center'
    },
    title:{
      fontSize:30,
      color:'#fff'
    },
    input:{
      backgroundColor:'#fff',
      padding:10,
      width: '90%',
      marginBottom: 10
    },
    btn:{
      width:'90%',
      padding:10,
      backgroundColor:'#8e8e8e',
    },
    btnText:{
      textAlign:'center',
      color:'#fff',
    }
  },
  // locations
  locations: {
    flex: 1,
    backgroundColor: '#eae9ef',
    paddingTop:10,
    card: {
      backgroundColor:'#ffffff',
      width:'90%',
      left:'5%',
      marginBottom: 10
    },
    title:{
      fontSize:20,
      textAlign:'center',
      fontWeight:'bold',
      paddingTop:5,
      paddingBottom:5,
      borderBottomWidth:0.3,
      borderBottomColor:'#e7ecf0'
    },
    description: {
      padding:10,
      marginBottom:5
    },
    btn: {
      width:70,
      height: 70,
      backgroundColor:'#ac00b6',
      alignItems:'center',
      justifyContent:'center',
      borderRadius: 50,
      position:'absolute',
      bottom:15,
      right:10
    },
    btnText: {
      fontSize: 20,
      fontWeight: 'bold',
      color:'#fff'
    }
  },
  // newLocation
  newLocation:{
    container:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#f2f2f2'
    },
    title:{
      fontSize:20,
      marginBottom:10
    },
    input:{
      width:'90%',
      backgroundColor:'#e2e2e2',
      marginBottom:10,
      padding:20
    },
    textarea:{
      padding:20,
      marginBottom:10,
      backgroundColor: '#e2e2e2',
      width:'90%'
    },
    btnSubmit:{
      backgroundColor:'#8e8e8e',
      width:'90%',
      alignItems:'center',
      padding:10,
      marginBottom:10
    },
    btnText:{
      color:'#fff',
      lineHeight: 40
    },
    btnClose: {
      backgroundColor: '#9e9e9e',
      marginRight: 'auto',
      zIndex: 0,
      height: 40,
      paddingLeft: 20,
      paddingRight: 20,
      marginLeft:'5%'
    }
  }
}

const Home = ({route, navigation}) => {
  const {cities} = route.params;
  const showLocations = (item, index) => {
    navigation.navigate('LOCATIONS',{cities, currentCity:index})
  }

  return (
    <View style={styles.home}>
      <Text style={styles.home.title}>CITIES</Text>
      <FlatList 
        data={cities}
        keyExtractor={(item,index)=> index.toString()} 
        renderItem={({item,index})=>
          <Text style={styles.home.cityArea} onPress={()=>{ showLocations(item,index) }}>{item.city}</Text>
        }
      />
    </View>
  )
}

const newCity = ({route, navigation}) => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const addCity = () => {
    let cities = route.params.cities;
    cities.push({city, country});
    navigation.navigate('CITIES', {cities});
  }
  return (
    <View style={styles.submitCity.container}>
      <Text style={ styles.submitCity.title }>
        CITIES
      </Text>
      <TextInput style={styles.submitCity.input}
        placeholder="City Name"
        onChangeText={ (text)=>{setCity(text)} }
      />
      <TextInput style={styles.submitCity.input} 
        placeholder="Country Name"
        onChangeText={ (text) =>{ setCountry(text) } }
      />
      <TouchableOpacity style={styles.submitCity.btn} onPress={addCity}>
        <Text style={styles.submitCity.btnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const locations = ({route, navigation}) => {
  const {cities} = route.params;
  const {currentCity} = route.params;

  const showAddLocation = () => {
    navigation.navigate('NEW LOCATION', {cities, currentCity})
  }

  let cityLocations = []
  if (route.params.cities[currentCity].hasOwnProperty('locations'))
    cityLocations = route.params.cities[currentCity].locations

  return (
    <View style={styles.locations}>
      <FlatList
        data={cityLocations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
          <View style={styles.locations.card}>
            <Text style={styles.locations.title}>{item.name} - {cities[currentCity].country}</Text>
            <Text style={styles.locations.description}>Type:{item.type}</Text>
            <Text style={styles.locations.description}>Address:{item.address}</Text>
            <Text style={styles.locations.description}>Notes:{item.notes}</Text>
          </View>
        } />
      <TouchableOpacity style={styles.locations.btn} onPress={()=>{ showAddLocation() }}>
        <Text style={styles.locations.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const newLocation = ({route, navigation}) => {
  const cities = route.params.cities;
  const city = cities[route.params.currentCity];
  const cityName = city.city
  const {currentCity} = route.params;
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [address, setAdress] = useState('');
  const [notes, setNotes] = useState('');

  const addLocation = () => {
    if (!cities[currentCity].hasOwnProperty('locations'))
      cities[currentCity].locations = []
    cities[currentCity].locations.push({name, type, address, notes})
    console.log(cities[currentCity])
    navigation.navigate('LOCATIONS',{cities,currentCity})
  }
  return (
    <View style={styles.newLocation.container} >
      <Text style={styles.newLocation.title}>New Location in {cityName}</Text>
      <TextInput style={styles.newLocation.input} onChangeText={(text) => setName(text)} placeholder="Name" />
      <TextInput style={styles.newLocation.input} onChangeText={(text) => setType(text)} placeholder="Type"/>
      <TextInput style={styles.newLocation.input} onChangeText={(text) => setAdress(text)} placeholder="Address"/>
      <TextInput style={styles.newLocation.textarea} onChangeText={(text) => setNotes(text)} placeholder="Notes"/>


      <TouchableOpacity style={styles.newLocation.btnSubmit} onPress={()=>addLocation()}>
        <Text style={styles.newLocation.btnText}>Add Location</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.newLocation.btnClose} onPress={() => navigation.goBack()}>
        <Text style={styles.newLocation.btnText}>Close</Text>
      </TouchableOpacity>
    </View>
  )
}

const App = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const TabNav = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="CITIES" component={Home} initialParams={ { cities:[] }} />
        <Tab.Screen name="ADD CITY" component={newCity} initialParams={ { cities:[] }}/>
      {/*
        <Tab.Screen name="LOCATIONS" component={locations} />
        <Tab.Screen name="NEW LOCATION" component={newLocation} />
      */}
      </Tab.Navigator>
    )
  }

  const getHeaderTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'CITIES';
    console.log(routeName)
    switch (routeName) {
      case 'CITIES':
      case 'ADD CITY':
        return false;
      default:
        return true;
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator /*headerMode="none" */ screenOptions={({route}) => ({
        headerShown: getHeaderTitle(route),
        headerTitleAlign: "center",
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#ac00b6' },
      })} >
        <Stack.Screen name="TabNav" component={TabNav} />
        <Stack.Screen name="LOCATIONS" component={locations} />
        <Stack.Screen name="NEW LOCATION" component={newLocation} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
