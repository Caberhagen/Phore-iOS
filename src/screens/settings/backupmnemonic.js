import React, { Component } from "react";
import { View, AppRegistry, ListView, StatusBar } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
  List,
  ListItem,
  Badge
} from "native-base";
import styles from "./styles1";
import * as bip39 from '../../components/bip39';
import * as phore from '../../wallet';
import * as RealmDB from '../../realm/RealmSchemas';




class BackupMnemonic extends Component {
  state = { words: '',
            wordss: [],
            password: 'phrTemp',
            seed: '',
            hdmaster: '',
            keypair: '',
            WIF: '',
            pubkey: '',
            address: '' };
  
  componentWillMount() {
    bip39.generateMnemonic().then(response => {
      this.setState({ words: response, wordss: response.trim().split(" ") })
      var seed = bip39.generateSeed(response, this.state.password);
      var id = 0;
      this.setState({ seed: seed })
      var hdmaster = phore.generateHDMaster(seed);
      this.setState({ hdmaster: hdmaster})
      var keypair = phore.generateKeyPairFromMaster(hdmaster, 1);
      this.setState({ keypair: keypair})
      var WIF = phore.getWIFfromKeyPair(keypair);
      this.setState({ WIF: WIF})
      var pubkey = phore.getPubKeyFromKeyPair(keypair);
      this.setState({ pubkey: pubkey })
      var address = phore.getAddressFromKeyPair(keypair);
      this.setState({ address: address })
      
      RealmDB.createReceivingAddress(address)
      
    } )};

    componentDidMount() {

      var WIF = this.state.WIF

      RealmDB.createWIF(WIF)
      
    };

    
    

   

   


  


  render() {
    
    const id = '2';
    const recaddress = this.state.address;
    const seed = this.state.seed;
    const hdmaster = this.state.hdmaster;
    const keypair = this.state.keypair;
    const wif = this.state.WIF;
    const pubkey = this.state.pubkey;
    const datas = this.state.wordss;
   
     return (
      <Container style={styles.container}>
        <Header iosBarStyle="light-content">
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{ color: 'white'}}/>
            </Button>
          </Left>
          <Body>
            <Title style={{ color: 'white'}}>Mnemonic Code</Title>
          </Body>
          <Right>
            
          </Right>
        </Header>

        <Content>
          
            <Text style={{alignSelf: 'center', marginLeft: 12, marginRight: 12, marginTop: 20}}>Please write this in a safe place and in horizontal order. You will need them to restore your wallet.</Text>
           
            <Text style={{alignSelf: 'center', marginLeft: 12, marginRight: 12, marginTop: 20}}>Do not share these words with anyone. Be careful, whoever has these words is the owner of the coins!</Text>

            <Text style={{alignSelf: 'center', marginLeft: 12, marginRight: 12, marginTop: 20}}>When you are done writing down the words, hit 'Confirm'.</Text>
           
            <View
            style={{ flexDirection: "row" }}
          >
          <List
            dataArray={datas}
            horizontal={true}
            renderRow={data =>
              <ListItem>
          <Badge info style={styles.mb15}>
            <Text>{data}</Text>
          </Badge>
            </ListItem>}
         />

          </View>
          

          <Button bordered dark block style={{ margin: 15, marginTop: 20 }}
          onPress={() => {
            
           
           
            
            
           console.log(seed)
            RealmDB.createWalletItemShortened('1', seed)
            this.props.navigation.navigate("MyWallet")

          }

          }>
            <Text>Confirm</Text>
          </Button>
            
         

          
        </Content>
      </Container>
    );
  }
}

export default BackupMnemonic;
