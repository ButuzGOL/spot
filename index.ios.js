import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  AppStateIOS
} from 'react-native';

var { DeviceEventEmitter } = React;

import Parse from 'parse/react-native';

var { RNLocation: Location } = require('NativeModules');

Parse.initialize("TYkg9kbczuIuPZt7AvIxCtFBido4wEcBYB5ckSvA", "t0XSjbX0s0FrmGrSMTFu1cPByWtSx1LeCHcbcTxF");

var COUNT = 0;
Location.requestAlwaysAuthorization();
Location.startUpdatingLocation();
Location.setDistanceFilter(2.0);

var subscription = DeviceEventEmitter.addListener(
    'locationUpdated',
    (location) => {
      COUNT++;
      console.log('updated');
      var TestObject = Parse.Object.extend("TestObject");
      var testObject = new TestObject();
      testObject.save({bar: JSON.stringify(location.coords)}).then(function(object) {
        console.log('saved');
        alert("yay! it worked");
      }, () => {
        console.log('not saved');
        alert("yay! it not worked");
      });
    }
);

class spot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: '',
      lastPosition: ''
    };
  }
  componentDidMount() {
  }

  watchPos() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });

      var TestObject = Parse.Object.extend("TestObject");
      var testObject = new TestObject();
      testObject.save({bar: lastPosition}).then(function(object) {
        alert("yay! it worked");
      });
    });
  }

  getPos() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position);
        this.setState({ initialPosition });

        var TestObject = Parse.Object.extend("TestObject");
        var testObject = new TestObject();
        testObject.save({foo: initialPosition}).then(function(object) {
          alert("yay! it worked");
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  render() {
    return (
      <View>
        <Text>
          <Text style={styles.title}>Initial position: </Text>
          {this.state.initialPosition}
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {this.state.lastPosition}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

AppRegistry.registerComponent('spot', () => spot);
