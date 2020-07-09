import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    ActivityIndicator
  } from 'react-native';
  import NetInfo from "@react-native-community/netinfo";
  import OrgUnitTree from '../components/OrgUnitTree'
  import { connect } from 'react-redux'
  import RadioForm from 'react-native-simple-radio-button';
  import {addOnline,addChartsData} from '../store/actions'
  import {saveGraphData,getGraphData} from '../services/ServiceDB'
  import  {getIndicatorsID,getGraphDataG1,transformDataG1,getGraphDataG2,transformDataG2,getGraphDataG3} from '../services/ServiceDataGraph'
  

  const group_radio = [
    {label: 'Malaria prevention', value: "G1" },
    {label: 'Malaria testing', value: "G2" },
    {label: 'Malaria cases', value: "G3" },
    {label: 'Malaria treatment', value: "G4" },
    {label: 'Malaria commodity availability', value: "G5" },
    {label: 'Malaria mortality', value: "G6" }
  ];
  const period_radio = [
    {label: 'Last 12 months', value: "LAST_12_MONTHS" },
    {label: 'Last 6 months', value: "LAST_6_MONTHS" },
    {label: 'Last 3 months', value: "LAST_3_MONTHS" },
    {label: 'Last months', value: "LAST_MONTHS" },
    
  ];
  
  class ChoiceParameters extends Component {
    constructor(props) {
      super(props);
      this.group="G1"
      this.period="LAST_12_MONTHS"
      this.ou=""
      
      this.state = { 
        ouName:"",
        message:"",
        isLoading: false
       }
    }

    setPeriod=(value)=>{
      //console.log("========Period======"+value)
      this.period=value
    }

    setGroup=(value)=>{
      //console.log("========Group======"+value)
      this.group=value
    }

    setOrgUnit=(orgunit)=>{
      //console.log("========orgunit======"+orgunit)
      orgunit=orgunit.split("-")
      let uid=orgunit[0]
      let lev=parseFloat(orgunit[1])
      let nameOu=orgunit[2]+" is selected"
      let ou=uid+"-"+lev
      //console.log("ou", ou);  
      this.ou=ou
      this.setState({ouName:nameOu})
      //setOuName(nameOu)
    }

    groupeIndicator= async () => {
      let listElements=await this.props.dataStore
      //await console.log("===========listElements==========",listElements)
      console.log("========orgunit submit======"+this.ou)
      console.log("========period submit======"+this.period)
      console.log("========group submit======"+this.group)

      let ou=this.ou
      let period=this.period
      let group=this.group

      let user=this.props.user
      //console.log("===========user==========",user)

      let listUIDG1=getIndicatorsID(listElements,group)
      
      if(listUIDG1!=""){
        let dataChart=new Object()
          dataChart.url=user?.url
          dataChart.uidOu=ou
          dataChart.period=period
          dataChart.group_ind=group
          let valueData=new Object()
          let name=this.manageName(group)
          valueData.name=name

          await getGraphDataG1(listUIDG1,ou,period,user?.login,user?.pwd,user?.url)
                          .then(async (results) => {
                            //console.log("===========results==========",JSON.stringify(results.data))
                            valueData.graph1=await transformDataG1(results.data)
                            valueData.graph1.name=name
                          })
                          .catch(error => {
                            console.log(error)
                          });
          //await console.log("===========valueData.graph1==========",valueData.graph1==undefined)
          
          await getGraphDataG2(listUIDG1,ou,period,user?.login,user?.pwd,user?.url)
                    .then(async (results) => {
                      //console.log("===========results==========",JSON.stringify(results.data))
                      valueData.graph2=await transformDataG2(results.data)
                      valueData.graph2.name=name
                    })
                    .catch(error => {
                      console.log(error)
                    });

          await getGraphDataG3(listUIDG1,ou,period,user?.login,user?.pwd,user?.url)
                    .then(async (results) => {
                      //console.log("===========results==========",JSON.stringify(results.data))
                      valueData.graph3=await transformDataG1(results.data)
                      valueData.graph3.name=name
                    })
                    .catch(error => {
                      console.log(error)
                    });
          
          dataChart.value=valueData
          
          //await console.log("========dataChart a voir===========",(dataChart.value.graph3==undefined))
          if(dataChart.value.graph1!=undefined && dataChart.value.graph2!=undefined && 
            dataChart.value.graph3!=undefined){
              await saveGraphData(dataChart)
              await this.props.addChartsData(dataChart.value)
            }
          
          this.setState({isLoading: false})
          this.props.navigation.navigate('Charts')
      } 
      
    }

    makeData = async () => {
      this.props.addChartsData([])
   
      await NetInfo.fetch().then( async (state) => {
        //console.log("Connection type", state.type);
        console.log("Is connected? parameters", state.isConnected);
        this.props.addOnline(state.isConnected)  

        if(state.isConnected){
          await this.groupeIndicator()
        }else{
          let user=this.props.user
          let dataChart=new Object()
          dataChart.url=user?.url
          dataChart.uidOu=this.ou
          dataChart.period=this.period
          dataChart.group_ind=this.group

          await getGraphData(dataChart)
                .then((results) => {
                  //console.log("========results getGraphData a voir==========",results)
                  this.props.addChartsData(results)
                })
                .catch(error => console.log(error)); 
          
          this.setState({isLoading: false})
          this.props.navigation.navigate('Charts')
        }

      })
      
    }

    manageName=(group)=>{
      switch(group) {
          case "G1":
            return "Malaria Drugs/products distributed"
          case "G2":
            return "Malaria testing"
          case "G3":
            return "Malaria cases"
          case "G4":
            return "Malaria treatment"
          case "G5":
            return "Malaria commodity availability"
          case "G6":
            return "Malaria mortality"
          default:
            // code block
        }
      }

    onSubmit=async()=>{
      this.setState({isLoading: true})
      if(this.ou!=""){
        this.setState({message:""})
        await this.makeData()
      }else{
        this.setState({message:"Select Organisation unit"})
      }

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
          {/* {console.log("========props orgunits==========="+JSON.stringify(props.orgunits))} */}
            <ScrollView>
            <View style={styles.posit}>
                <View style={styles.posit2}>
                  <Text style={styles.titleText}>Select relative period </Text>
                      <RadioForm
                      radio_props={period_radio}
                      formHorizontal={false}
                      labelHorizontal={true}
                      buttonColor={'#2196f3'}
                      animation={true}
                      onPress={(value) => {this.setPeriod(value);}}
                      />
                </View>
                <View style={styles.posit2}>
                <Text style={styles.titleText}>Select indicator group</Text>
                    <RadioForm
                    radio_props={group_radio}
                    formHorizontal={false}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    animation={true}
                    onPress={(value) => {this.setGroup(value);}}
                    />
                
                </View>
            </View>

            <View style={styles.posit1}>
                <Text style={styles.titleText}>Select Organisation unit</Text>
                <Text style={styles.titleText2}>{this.state.ouName}</Text>
                <OrgUnitTree setOrgUnit={this.setOrgUnit}  />
            </View>
            <View style={styles.posit1}>
                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onSubmit()}>
                  <Text style={styles.loginText}>Submit</Text>
                </TouchableHighlight>
            </View>
            <View style={styles.posit1}>
              <Text style={styles.messagetext}>
                {this.state.message}
              </Text>
            </View>

            {this.displayLoading()}

            </ScrollView>
          </View>
       );
    }
  }
  

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor: '#DCDCDC',
      marginTop:10
    },
    posit:{
        flexDirection:"row",
        justifyContent:"space-around",
    },
    posit1:{
      marginTop:10,
      marginLeft:5,
      alignItems: 'center',
      
    },
    posit2:{
        //marginLeft:10,
        backgroundColor: '#E0F2F7',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
    titleText: {
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: '#0174DF',
        textAlign:"center",
        color: '#EFFBFB',
      },
    titleText2: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1890F5",
        backgroundColor: "#FCD420",
        marginTop:5,
      },
      title: {
        textAlign: 'center',
        marginVertical: 8,
      },
      messagetext:{
        fontSize: 20,
        fontWeight: "bold",
        color:"red"
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
      online: state.online,
      dataStore : state.dataStore,
      user: state.user,
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      addChartsData: (chartsData) => {
        dispatch(addChartsData(chartsData))
      },
      addOnline: (online) => {
          dispatch(addOnline(online))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(ChoiceParameters);