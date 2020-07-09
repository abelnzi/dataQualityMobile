import React,{ Component } from 'react';
import { Text, View ,StyleSheet} from 'react-native'
import TreeView from 'react-native-final-tree-view'
import {Alert } from 'react-native';
import { connect } from 'react-redux'
import {addOnline,getOnline,addOrguit,addDataStore,addUser,getUser} from '../store/actions'

class OrgUnitTree extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      data:this.props.orgunits 
    }
  }
  getIndicator(isExpanded, hasChildrenNodes) {
    if (!hasChildrenNodes) {
      return '-'
    } else if (isExpanded) {
      return '*'
    } else {
      return '>'
    }
  }

 

  render() { 
    return ( 
      <View style={styles.container}>
      {/* {console.log("======props tree======"+props.listOu)} */}
      <TreeView
        data={this.state.data} // defined above
        renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
          return (
            <View>
              <Text
                style={{
                  marginLeft: 25 * level,
                }}
              >
                {this.getIndicator(isExpanded, hasChildrenNodes)} {node.displayName}
              </Text>
            </View>
          )
        }}
        onNodePress={(node, level)=>this.props.setOrgUnit(node.node.id+"-"+node.node.level+"-"+node.node.displayName)}
      />
      </View>
     );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#E0F2F7',
  }
});

const mapStateToProps = (state) => {
  return {
    orgunits: state.orgunits
  }
}


export default connect(mapStateToProps)(OrgUnitTree);

