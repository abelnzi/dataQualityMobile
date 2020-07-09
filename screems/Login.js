import React, { Component,useState,useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    Alert,
    Share,ToastAndroid,ActivityIndicator
  } from 'react-native';

import {getMetadata,getOrgunitList } from '../services/ServiceDataGraph'
import {saveDataStore,saveOrgunit,saveUser,getUser,getOrgunit,getDataStore} from '../services/ServiceDB'
import { connect } from 'react-redux';
import {addOnline,addOrguit,addDataStore,addUser,addAllUser} from '../store/actions'
import NetInfo from "@react-native-community/netinfo";

  class Login extends Component {
    constructor(props) {
      super(props);
      this.login="admin"
      this.pwd="district"
      this.url="https://dhis2.jsi.com/dhis"
      this.message=""
      this.state = {
        lastUrl: this.props.user?.url,
        isLoading: false,
        message:""
       }
    }

    onChangeLogin({login}){
      
      this.login=login
      //console.log('==========login==========',this.login)
    }
    onChangePwd({password}){
      this.pwd=password
      //console.log('==========password==========',this.pwd)
    }

    onChangeUrl({url}){
      this.url=url
      this.setState({lastUrl: url})
      console.log('==========url==========',this.url)
    }

    fetchingData=async ()=>{
      console.log('==========login==========',this.login)
      console.log('==========password==========',this.pwd)
      console.log('==========url==========',this.url)

      await getMetadata(this.login,this.pwd,this.url)
            .then(async res => {
                let data = res.data;
                //console.log('==========datastore==========',data)
                await saveDataStore(this.url,data)
                this.props.addDataStore(data)

                await getOrgunitList(this.login,this.pwd,this.url)
                .then(async elt => {
                  let data = elt.data;
                  //console.log('==========data orgunits==========',data)
                  await saveOrgunit(this.url,data.organisationUnits)
                  this.props.addOrguit(data.organisationUnits)
                })
                .catch(function (error) {
                  console.log(error)  
                })

                let userTemp=new Object()
                userTemp.login=this.login
                userTemp.pwd=this.pwd
                userTemp.url=this.url
                await saveUser(userTemp)
                this.props.addUser(userTemp)
                this.setState({message: ""})
                this.setState({isLoading: false})
                this.props.navigation.navigate('Parameters')
                
            })
            .catch(async function (error) {
                await console.log(error);
                this.setState({isLoading: false})
                this.setState({message: "invalid authentification parameters"})
              }.bind(this));


   }

   onClickListener=async ()=>{
    this.setState({isLoading: true})
    await NetInfo.fetch().then( async (state) => {
      //console.log("Connection type", state.type);
      await console.log("Is connected? login", state.isConnected);  
      await this.props.addOnline(state.isConnected)

      if(state.isConnected){
        await this.fetchingData()
      } else {

        let userTemp=new Object()
        userTemp.login=this.login
        userTemp.pwd=this.pwd
        userTemp.url=this.url

        await getUser(userTemp)
          .then(async (results) => {
            //console.log("========results user a voir==========",results[0])
            if(results.length>0){
              let user=results[0]
              this.props.addUser(user)
              
              //get orgunit
              await getOrgunit(this.url)
                    .then((results) => {
                      //console.log("========results getOrgunit a voir==========",JSON.stringify(results))
                      this.props.addOrguit(results)
                    })
                    .catch(error => console.log(error)); 
            //get Datastore data
              await getDataStore(this.url)
                      .then((results) => {
                        //console.log("========results getDataStore a voir==========",JSON.stringify(results))
                        this.props.addDataStore(results)
                      })
                      .catch(error => console.log(error)); 

              this.setState({isLoading: false})
              this.props.navigation.navigate('Parameters')
              
            }else{
              this.setState({message: "User don't exist in the local database"})
              this.setState({isLoading: false})
            }
            
          })
          .catch(error => console.log(error)); 
      }
      
      
      
    });
   }
   

   displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }


  render() { 
      return ( 
        <View style={styles.container}>
           {/* {console.log('==========this.props.user==========',this.props.user)} */}
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} />
          <TextInput style={styles.inputs}
              placeholder="Login"
              //value="admin"
              //keyboardType="default"
              underlineColorAndroid='transparent'
              onChangeText={(login) => this.onChangeLogin({login})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} />
          <TextInput style={styles.inputs}
              placeholder="Password"
              //value="district"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.onChangePwd({password})}/>
        </View>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} />
          <TextInput style={styles.inputs}
              placeholder="Url"
              value={this.state.lastUrl}
              //keyboardType="url"
              underlineColorAndroid='transparent'
              onChangeText={(url) => this.onChangeUrl({url})}/>
        </View>
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <Text style={styles.messagetext}>
            {this.state.message}
        </Text>

        {this.displayLoading()}

      </View> 
       );
    }
  }
   
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
      width:30,
      height:30,
      marginLeft:15,
      justifyContent: 'center'
    },
    buttonContainer: {
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:250,
      borderRadius:30,
    },
    loginButton: {
      backgroundColor: "#00b5ec",
    },
    loginText: {
      color: 'white',
    },
    messagetext:{
      fontSize: 20,
      fontWeight: "bold",
      color:"red"
    },
    loading_container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 100,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  const mapStateToProps = (state) => {
    return {
      user: state.user,
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      addOrguit: (orgunits) => {
            dispatch(addOrguit(orgunits))
        },
      addOnline: (online) => {
          dispatch(addOnline(online))
      },
      addDataStore: (dataStore) => {
        dispatch(addDataStore(dataStore))
      },
      addUser: (user) => {
        dispatch(addUser(user))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Login);
