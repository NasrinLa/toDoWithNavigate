import React, {Component} from 'react';
import {Text, StyleSheet, Image, TouchableOpacity , Alert , View , FlatList  , Animated}  from 'react-native';
import{connect} from 'react-redux';
import{ setSearchItem , setType , setRemoveItem , setItem , setStep} from '../service/FetchService/action';
import {ThemeContext} from '../components/ThemeContext'
import Icon from 'react-native-vector-icons/FontAwesome';
class MainClose extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      spinValue : new Animated.Value(0),
      text : '',
      color : '#303451',
      name : '',
    }
  }
  
  chooseColor(type) {
    switch (type) {
      case "Work":
        return "#877C92";

      case 'Family':
        return "#B75D69";

      case 'Study':
        return "#9C7C8B";

      case 'Wish':
        return "#DAB1BD";
      
      default:
        return '#AFADB2';

    }
  }

  componentDidMount (){
    this.props.setStep('Close')
    this.spin()
  }

  showFullText (item){
    Alert.alert( "created at :" + item.date.toString(), item.text );
  }

  spin () {
    this.state.spinValue.setValue(0)
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start(() => this.spin())

  }


  componentWillMount(){
    this.props.setType(this.props.type)
    const name = this.props.type;
    const step = this.props.step;
    const prps = this.props;
    const stt = this.state;
    this.props.navigation.setParams({name , step ,prps , stt});
  }
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    
    return{
      title :  'Forgotten Tasks' ,
        
        
        headerStyle: {
          backgroundColor: '#424770',
        },

        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: '500',
          fontFamily: 'sans-serif-medium',
          fontSize : 25
        },

        headerRight: (
          <View style = {[styles.headerStyle , {justifyContent : 'flex-end'}]}>
            <TouchableOpacity 
             onPress = {() => {navigation.navigate('Search')}}
            style = {styles.drawerBottonRight}>
              <Image 
                style = {styles.searchStyle}
                source = {require('../assests/search.png')}/>
            </TouchableOpacity>

            <TouchableOpacity 
            style = {styles.drawerBottonRight}>
                <Image 
                style = {styles.threeStyle}
                source = {require('../assests/3.png')}/>
            </TouchableOpacity>
         </View>
         
        ),
        headerLeft :(
          <TouchableOpacity
          style = {styles.backButton}
          onPress = {() => {
            navigation.goBack(),
            params.prps.setType (params.name),
            params.prps.setStep (params.step)
            }}>
            <Image 
            style = {styles.backImage}
            source = {require('../assests/back.png')}/>
          </TouchableOpacity>

        ),

    }; 
}
    render(){
        let theme = this.context
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return(
            <View style = {[styles.container , {backgroundColor: theme.backgroundColor}]}>
             
                {
                  this.props.loading && 
                    <View style = {styles.animatedStyle}>
                        <Animated.Image 
                        style = {[styles.loadingImage , {  transform: [{rotate: spin }]}]}
                        source = {require ('../assests/loading1.png')} />

                    </View>
                }
                {
                  !this.props.loading &&  
                  <View style = {styles.bodyStyle}>
                    <FlatList
                      style = {styles.flatStyle}
                      data = {this.props.stepList}
                      extraData={theme}
                      keyExtractor = {item => item.id.toString()}
                      renderItem ={ ({item , index})  => 
                        <View style = {[styles.itemContainer , { backgroundColor : theme.itemColor, borderLeftColor : this.chooseColor(item.type)}]}>

                         <View style = {[styles.bottomContainer , styles.justPadding]}>
                            <TouchableOpacity style = {styles.textBodyContainer}
                            onPress = {() => this.showFullText(item)}>

                              <View style = {[styles.roundStyle , {borderColor : theme.backgroundColor , backgroundColor : this.chooseColor(item.type)}]} />
                              <Text style = {[styles.textBody , {color : theme.fontColor}]} ellipsizeMode='middle' numberOfLines={1} >{item.text}</Text>
                            </TouchableOpacity>  
                          </View>

                          <View style = {styles.bottomContainer}>

                                 <TouchableOpacity 
                                  style = {[styles.buttonTempStyle , { backgroundColor : theme.redButton ,borderColor :theme.fontColor}]}
                                  onPress ={() => this.props.setRemoveItem(item.id)}>
                                  <Icon name="trash" class="fas fa-coffee fa-sm" size={23} color={theme.iconColor} />
                                  
                                </TouchableOpacity>
                                <TouchableOpacity style = {[styles.buttonTempStyle , { backgroundColor : theme.blueButton ,borderColor :theme.fontColor}]}
                                 onPress ={() => this.props.navigation.navigate("Edit" ,{"item" : item})}
                                 >
                                  <Icon name="edit" class="fas fa-coffee fa-sm" size={23} color={theme.iconColor} />
                                </TouchableOpacity>
                          
                          </View>

                        </View>
                      }  
                    />
                  </View>
                }
            </View>
        )
    }
}

const mapStateToProps=(state)=>{
  return{
    stepList : state.fetchReducer.stepList,
    loading : state.fetchReducer.loading,
    type : state.fetchReducer.type,
    step : state.fetchReducer.step,
  }
}

export default connect(mapStateToProps ,{setSearchItem , setType , setRemoveItem , setItem , setStep})(MainClose)

MainClose.contextType = ThemeContext;

const styles = StyleSheet.create({
    backButton :{
      marginLeft : 12,
      height : 20,
      width: 20,
    },
    backImage : {
      width : 20,
      height : 20,
    },
    container: {
      flex: 1,
      backgroundColor : '#E8EAED',  
    },
 
    flatStyle : {
      alignContent  : 'center',
      marginTop : 10,
      zIndex:-1
    },
    searchStyle : {
      width : 38,
      height : 38
    },
    threeStyle : {
      width : 20,
      height : 20
    },
    headerStyle :{
        flexDirection: 'row', 
        alignItems: 'center',
    },
    bodyStyle : {
        flex : 9,
        marginTop : 2
    },
    headerText : {
      marginLeft : 20,
      fontWeight: 'bold',
      color : 'white',
      fontSize : 25,
    },
    drawerBotton : {
      marginLeft : 15
    },
    imageStyle: {
      width : 27,
      height : 27,
    },
    textInputStyle : {
      backgroundColor : 'white',
      marginRight : 15,
      width : 300,
      height : 40,
      borderRadius : 20,
    },
    drawerBottonRight :{
      marginRight : 15,
    },
    animatedStyle : {
      flex : 9,
      alignItems : 'center',
      justifyContent : 'center',
    },
    loadingImage :{
      height : 100,
      width : 100,
    },
    justPadding :{
      paddingRight : 20
    },
    itemContainer :{
      borderRadius : 10 ,
      flex :1 ,
      paddingHorizontal : 20,
      justifyContent : 'space-between',
      backgroundColor : '#F9F9F8',
      marginTop : 10,
      marginBottom : 10,
      marginLeft : 25,
      marginRight : 25,
      borderLeftWidth : 10 ,
      elevation :3,
    },
    bottomContainer :{
      flexDirection: 'row', 
        flex : 1,
        paddingVertical : 5,
        alignItems : 'center',
        justifyContent : 'center',
    },
    textBodyContainer : {
      flexDirection: 'row', 
      flex :3,
      paddingTop : 10,
      marginBottom : 15,
      alignItems : 'center',
      
    },
    roundStyle :{
      width :13,
      height :13,
      marginRight : 5,
      borderRadius : 50, 
      borderWidth : 2 ,
    },
    textBody : {
      fontSize : 23,
      fontWeight : '300',
      color : '#707070',
      //fontFamily: "vincHand",
      fontFamily : 'sans-serif-medium',
    },
    buttonTempStyle :{
      borderColor : '#707070',
      width : 55,
      height : 40,
      alignItems : 'center',
      justifyContent : 'center',
      borderWidth : 1 , 
      borderRadius : 10,
      marginRight : 10,
      marginLeft : 10,
      marginBottom : 10,
      flexDirection : 'row',
      
      // backgroundColor : '#E8EAED',
    }
})
