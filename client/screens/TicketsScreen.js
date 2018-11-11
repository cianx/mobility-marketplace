import React from 'react';
import { TouchableHighlight, Modal, StyleSheet, Image, Text, View, ScrollView, AsyncStorage } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import QRCode from 'react-native-qrcode';

export default class TicketsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      currentTicket: null,
    };
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      async payload => {
        await this.loadTickets();
      }
    );

  }

  setCurrentTicket = (ticket) => {
    this.setState({ currentTicket: ticket });
  }

  fulfillTicket = async (ticket) => {
    var { tickets } = this.state;

    tickets = tickets.filter(t => {
      return t.ticketId !== ticket.ticketId;
    });
    await AsyncStorage.setItem('tickets', JSON.stringify(tickets));
    this.setState({
      tickets,
      currentTicket: null
    });    
  }

  loadTickets = async () => {
    try {
      var tickets = await AsyncStorage.getItem('tickets');
      tickets = tickets ? JSON.parse(tickets) : [];
      this.setState({ tickets });
    } catch (e) {
      console.log('err', e);
    }
  }

  async componentDidMount() {
    await this.loadTickets();
  }

  render() {
    const { tickets, currentTicket } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={!!currentTicket}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modal}>
            <View>
              <View style={styles.ticketTitle}>
                <Text style={styles.ticketTitleText}>{currentTicket && currentTicket.start_address} - {currentTicket && currentTicket.end_address}</Text>
              </View>  
              <View style={styles.ticketProvider}>
                <Text style={styles.ticketProviderText}>Provider: {currentTicket && currentTicket.provider}</Text>
              </View>                          
              <View style={styles.qrCode}>
                <QRCode
                  value={currentTicket && currentTicket.ticketId}
                  size={320}
                  bgColor='purple'
                  fgColor='white'                                   
                />
              </View>
              <TouchableHighlight
                style={styles.fulfillButton}
                onPress={() => {
                  this.fulfillTicket(currentTicket);
                }}>
                <Text style={styles.fulfillButtonText}>Fulfill</Text>
              </TouchableHighlight>              
              <TouchableHighlight
                style={styles.closeButton}
                onPress={() => {
                  this.setCurrentTicket(null);
                }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View>
            <Text style={styles.optionsTitleText}>Tickets</Text>
            {tickets.sort((a, b) => {return a.index - b.index}).map((ticket, index) => (
              <Touchable
                style={styles.option}
                background={Touchable.Ripple('#ccc', false)}
                key={index}
                onPress={this.setCurrentTicket.bind(this, ticket)}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionText}>
                      {ticket.start_address} - {ticket.end_address}
                    </Text>
                  </View>
                </View>
              </Touchable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  _handlePressSlack = () => {

  };

  _handlePressDocs = () => {

  };

  _handlePressForums = () => {

  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  modal: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
  },
  optionIconContainer: {
    marginRight: 9,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
  },
  optionText: {
    fontSize: 15,
    marginTop: 1,
  },
  fulfillButton: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  fulfillButtonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },  
  closeButton: {
    height: 36,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },  
  closeButtonText: {
    fontSize: 18,    
    alignSelf: 'center'
  },
  qrCode: {
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  ticketTitle: {
    marginBottom: 30,        
  },
  ticketTitleText: {
    fontSize: 30,
  },
  ticketProvider: {
    marginBottom: 30,        
  },
  ticketProviderText: {
    fontSize: 20,
  }  
});
