import React, { createRef,Component} from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import { WebView } from 'react-native-webview'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Sharing from 'expo-sharing';
import ViewShot from "react-native-view-shot";
import { connect } from 'react-redux';


class Graph2 extends Component {
  constructor(props) {
    super(props);
    this.viewShot=createRef()
    this.state = { 
      options: {
          chart: {
            type: 'column'
          },
          title: {
              text: this.props.graph.name
          },
          subtitle: {
              text: ''
          },
          xAxis: {
              categories: this.props.graph.headers,
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Value'
              }
          },
          exporting: { enabled: true },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: this.props.graph.series
        }
     }
  }

    onShare = async () => {
      await this.viewShot.current.capture().then(uri => {
      console.log("do something with ", uri);
      //setLien(uri)
      Sharing.shareAsync(uri);
        //onShare(uri)
    })  

    /* const snapshot = await captureRef(viewShot.current, {
        result: 'data-uri',
      });
      //Sharing.shareAsync(snapshot);
    */
  };

  render() { 
    return ( 
        <>
          <View style={styles.posit}>
            <Button
              icon={
                <Icon
                  name="share-alt-square"
                  size={20}
                  color="white"
                />
              }
              title="Share"
              onPress={this.onShare}
            />
          </View> 
          <ViewShot ref={this.viewShot}>
            <View style={styles.view_container}>
                    <HighchartsReactNative
                    styles={styles.container}
                        options={this.state.options}
                        useCDN={true}
                        useSSL={true}
                        loader={true}
                    />
            </View>
          </ViewShot>
        </>
     );
  }
}
 
const styles = StyleSheet.create({
    container: {
        height: 500,
        display:'flex',
        //width: 400,
        backgroundColor: '#fff',
        justifyContent: 'center',
        //marginTop: 10,
    },
    view_container: {
        backgroundColor: '#fff',
        flex: 1,
        //marginTop:-50
        //justifyContent:"space-around",
        //alignItems: 'center',
    },
    posit:{
      alignItems: 'center',
      
    },
});

const mapStateToProps = (state) => {
  return {
    graph : state.chartsData.graph2,
  }
}


export default connect(mapStateToProps)(Graph2);