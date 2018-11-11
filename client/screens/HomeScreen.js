import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  Keyboard
} from 'react-native';
import { WebBrowser } from 'expo';
import t from 'tcomb-form-native';
import MapView, { AnimatedRegion, Animated, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { getTransitBids } from '../services/transitService';

const Form = t.form.Form;

const TransitRequest = t.struct({
  from: t.String,
  to: t.String
});

const mapPathColors = [
  '#0F0D38',
  '#908BB2',
  '#C78283',
  '#0F0D38',
  '#908BB2',
  '#C78283',
  '#0F0D38',
  '#908BB2',
  '#C78283'
];

const initialRegion = {
  latitude: 37.74622194898244,
  longitude: -122.44229556256883,
  latitudeDelta: 0.14517848376367226,
  longitudeDelta: 0.20502065997064278
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      bids: [],
      selectedBid: null,
      formValue: null
    };
  }

  selectBid = (bidId) => {
    console.log('selectBid:', bidId);
    this.setState({selectedBid: bidId});
  }

  buyTicket = (bid) => {
    console.log('To buy:', bid);
  }

  getBids = async () => {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();    
    if (value) { // if validation fails, value will be null
      const { from, to } = value;
      const { bids } = await getTransitBids(from, to);
      this.setState({ bids, selectedBid: null, formValue: value });
      Keyboard.dismiss();
      // console.log(bids); // value here is an instance of Person
    }
  }

  onRegionChange = (region) => {
    console.log(region)
    // this.setState({ region });
  }

  renderBids = () => {
    const { bids, selectedBid } = this.state;
    const showRoute = bids && bids.length > 0 && selectedBid !== null;
    if (!bids || bids.length <= 0) return (<View></View>);

    return (
      <View style={styles.bids}>
        <Text>Transit options:</Text>
        {bids.map((bid, index) => (
          <TouchableHighlight style={ index === selectedBid ? styles.selectedBid : styles.bid} key={index} onPress={this.selectBid.bind(this, index)}>
            <Text>{index+1}. total fare: ${bid.fare / 100}, legs: {bid.legs.length}</Text>
          </TouchableHighlight>
        ))}
      </View>
    );
  }

  renderBuyTicket = () => {
    const { bids, selectedBid } = this.state;
    if (!bids || bids.length <= 0 || selectedBid === null) return (<View></View>);
    const bid = bids[selectedBid];

    return (
      <TouchableHighlight style={styles.button} onPress={this.buyTicket.bind(this, bid)} underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Buy Ticket</Text>
      </TouchableHighlight> 
    )
  }

  renderMap = () => {
    const { bids, selectedBid } = this.state;
    const showRoute = bids && bids.length > 0 && selectedBid !== null;

    return (
      <MapView
        initialRegion={initialRegion}
        style={styles.map}
      >
        {showRoute && bids[selectedBid].legs.map((leg, index) => (
          <MapViewDirections
            origin={{ latitude: leg.start_location.lat, longitude: leg.start_location.lng }}
            destination={{ latitude: leg.end_location.lat, longitude: leg.end_location.lng }}
            apikey={'AIzaSyCv-i_aypZfAOkXMeqU_8_gz1mdidniDCQ'}
            strokeColor={mapPathColors[index]}
            strokeWidth={3}
            key={index}
          />
        ))}
        {showRoute && bids[selectedBid].legs.map((leg, index) => (
          <Marker
            coordinate={{ latitude: leg.end_location.lat, longitude: leg.end_location.lng }}
            title={leg.end_address}
            key={index}
          />
        ))}
      </MapView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Form type={TransitRequest} ref="form" value={this.state.formValue} />
          <TouchableHighlight style={styles.button} onPress={this.getBids} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Request</Text>
          </TouchableHighlight>
          {this.renderBids()}
          {this.renderBuyTicket()}
          {this.renderMap()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  map: {
    alignSelf: 'stretch',
    height: 300
  },
  bids: {
    marginTop: 10,
    marginBottom: 10,
  },
  selectedBid: {
    height: 36,
    backgroundColor: '#FAFAFF',
    borderColor: '#30343F',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  bid: {
    height: 36,
    backgroundColor: '#FAFAFF',
    borderColor: '#FAFAFF',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
