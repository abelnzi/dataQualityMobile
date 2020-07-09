import React, { useState,useEffect } from 'react';
import Login from './Login'
import { Header } from 'react-native-elements';
import {StyleSheet, View,Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createTable,getLasttUser} from '../services/ServiceDB'
import { connect } from 'react-redux';
import {addUser} from '../store/actions'
import ChoiceParameters from './ChoiceParameters'
import GraphContent from './GraphContent'

const Stack = createStackNavigator();

const AppContainer = (props) => {
  const [urlLocal, setUrlLocal] = useState(null);

  useEffect(() => {
    async function load() {
      console.log('==========App render==========')
       await createTable()
       await getLasttUser()
        .then((results) => props.addUser(results))
        .catch(error => console.log(error)); 
    }   
    load()
  },[])

    return ( 
        <View style={styles.container}>
          <View>
            <Header
              leftComponent={<Image style={styles.image} source={require('../assets/logo.png')} />}
              centerComponent={{ text: 'Malaria Dashboard', style: { color: '#fff' } }}
              //rightComponent={{ icon: 'home', color: '#fff' }}
            />
          </View> 
            <View style={styles.container}>
              <NavigationContainer initialRouteName={Login}>
                  <Stack.Navigator>
                      <Stack.Screen name="Login" component={Login} initialParams={{ itemId: 42 }} />
                       <Stack.Screen name="Parameters" component={ChoiceParameters} />
                      <Stack.Screen name="Charts" component={GraphContent} />
                  </Stack.Navigator>
              </NavigationContainer>
            </View>
        </View>
     );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    image: {
      width: 50,
      height: 40,
    },
  });
  
 
  const mapDispatchToProps = (dispatch) => {
    return {
      addUser: (user) => {
        dispatch(addUser(user))
      }
    }
  }

export default connect(null, mapDispatchToProps)(AppContainer);