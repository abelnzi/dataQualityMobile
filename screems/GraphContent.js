import React, {Component} from 'react';
import Graph1 from '../components/Graph1'
import Graph2 from '../components/Graph2'
import Graph3 from '../components/Graph3'

import {
    StyleSheet,
    View,
    ScrollView,Text
  } from 'react-native';

import { connect } from 'react-redux';

class GraphContent extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 

    if( this.props.chartsData.length<=0){
      return ( 
          <View style={styles.view}>
              <Text style={styles.messagetext}>
                  No data found
              </Text>
          </View>
      )
    } 

    return ( 
        <View style={styles.container}>
            
              <View  style={styles.view}> 
                <ScrollView style={styles.scrollView}>
              
                    <Graph1 />
                    
                    <Graph2 />
                
                    <Graph3 />
              
                </ScrollView>
              </View> 
        </View>
     );
  }
}
 
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    scrollView: {
        backgroundColor: '#fff',
        //marginHorizontal: 20,
        flex: 1
      },
      view: {
        //backgroundColor: '#fff',
        //marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      messagetext:{
        fontSize: 20,
        fontWeight: "bold",
        color:"red",
        alignContent:"center"
      }
    });

    const mapStateToProps = (state) => {
      return {
        chartsData : state.chartsData,
      }
    }
  
  
  export default connect(mapStateToProps)(GraphContent);  