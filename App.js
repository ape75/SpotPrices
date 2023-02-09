import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TextInput, ScrollView, View, TouchableOpacity, ImageBackground, Image, Alert} from 'react-native';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {parseString} from 'react-native-xml2js';
import DatePicker from 'react-native-date-picker';
import { Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dropdown } from 'react-native-element-dropdown';
import CountryFlag from "react-native-country-flag";
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';


const App=()=> {

  const [date, setDate] = useState(new Date()); 
  const [priceList, setPriceList]=useState([]);
  const [priceData, setPriceData]=useState([]);
  const [avgPrice, setAvgPrice]=useState(0);
  const [selectedDate, setSelectedDate]=useState("");
  const [responseGot, setResponseGot]=useState(false);
  const myToken = "4269c7c9-83be-49df-a1f5-86d4ea56e512";
  const [countryCode, setCountryCode] = useState("10YFI-1--------U");
  const screenWidth = Dimensions.get("window").width-20; 
  const countryCodes =[{label:"Suomi", value:"10YFI-1--------U"},
                      {label:"Ruotsi", value:"10Y1001A1001A45N"},
                      {label:"Tanska", value:"10YDK-1--------W"},
                      {label:"Norja", value:"10YNO-1--------2"},
                      {label:"Viro", value:"10Y1001A1001A39I"},
                      {label:"Puola", value:"10YPL-AREA-----S"}];
  const [value, setValue] = useState(null);
  const [flagCode, setFlagCode]=useState("");
  const [maxPrice, setMaxPrice]=useState(0); 
  const [minPrice, setMinPrice]=useState(0);
  const [maxPriceRange, setMaxPriceRange]=useState("");  
  const [minPriceRange, setMinPriceRange]=useState(""); 

  useEffect(()=>{
    if(priceData.length>24){
      priceData.pop();
    };   
  }, [priceData])

  //a custom button component made by using a TouchableOpacity-component
  const AppButton = ({ onPress, title, backgroundColor, fontColor }) => (
    <TouchableOpacity 
      activeOpacity={0.6}
      onPress={onPress} 
      style={[
        styles.appButtonContainer,        
        backgroundColor && { backgroundColor }        
      ]}>
      <Text style={[styles.appButtonText, { color:fontColor }]}>
      {title}
      </Text>
    </TouchableOpacity>
  ) 

  /*  This function renders the barchart in to the screen if the pricedata has been fetched from the server.
      If the pricedata is empty, an empty view gets returned. */
  const RenderChart=()=>
  {      
      if(priceData.length==24){
        
        const chartConfig = {          
          backgroundGradientFrom: "#abbaab",
          backgroundGradientFromOpacity: 1,
          backgroundGradientTo: "#ffffff",
          backgroundGradientToOpacity: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          barPercentage: 0.2,
          barRadius: 2,
          useShadowColorFromDataset: false, // optional
          propsForLabels:{
            fontWeight: 'bold',
            },                        
        };
        /* Here the x-axis labels are defined */
        const data = {
          labels: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
                  "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
          datasets: [
            {
              data: priceData,             
             /*  add custom color/colors to barchart bars  */
              colors: [ (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5',
                        (opacity=1) => '#3563A5'    
                  ] 
            }
          ],          
        };        
        
        return(
            <View style={styles.chartView}>
              <BarChart      
                data={data}
                width={screenWidth}
                height={280}
                chartConfig={chartConfig}
                verticalLabelRotation={-70}
                showValuesOnTopOfBars={false}
                showBarTops={false}
                fromZero={true}
                yAxisSuffix="snt"
                withCustomBarColorFromData={true}
                flatColor={true}
                withInnerLines={true}
                style={{
                
                }}
              />
            </View>
          )
      }
      else {
        return(
        <View style={styles.chartView}></View>
        );      
    }    
}

  /* This function converts the selected date to a format that is compatible with the ENTSO-E REST API */
  const getTargetDate =()=>{
    setResponseGot(false);
    let day = date.getDate();
    let month = date.getMonth()+1;
    let month2 = date.getMonth()+1;
    let year= date.getFullYear();
    let year2= date.getFullYear();
    let day2 = day+1;
    
    if (day < 10) {
      day = '0' + day;
    } 
    if(day2 > 31){
      day2 = 1;
      month2=month+1;
    } 
    if((month==2 && day == 28) || (month==2 && day==29)){
      day2 = 1;
      month2 = month+1;
    }
    if(month==4 && day == 30 ){
      day2 = 1;
      month2 = month+1;
    }
    if(month==6 && day == 30 ){
      day2 = 1;
      month2 = month+1;
    }
    if(month==9 && day == 30 ){
      day2 = 1;
      month2 = month+1;
    }
    if(month==11 && day == 30 ){
      day2 = 1;
      month2 = month+1;
    }
    if(month==12 && day == 31 ){
      day2 = 1;
      month2 = 1;
      year2 = year + 1;
    }
    if (day2 < 10) {
      day2 = '0' + day2;
    }    
    if (month < 10) {
      month = `0${month}`;
    }  
    if (month2 < 10) {
      month2 = `0${month2}`;
    } 
    let targetDate = `${year}${month}${day}`;
    setSelectedDate(`${day}.${month}.${year}`);
    let targetDate2 = `${year2}${month2}${day2}`;
   /*  console.log("DATE1:" +targetDate);     
    console.log("DATE2:" +targetDate2);     */  
    fetchSpotPrices(targetDate, targetDate2);
  }
  
  /* This function fetches the prices from the ENTSO-E transparency platforms REST API 
    It also calculates the maximum and minimum prices and their time intervals on the given date*/
  const fetchSpotPrices=async(date1, date2)=>{
    clearPrices();    
    await fetch("https://web-api.tp.entsoe.eu/api?securityToken="+myToken+"&documentType=A44&in_Domain="+countryCode+"&out_Domain="+countryCode+"&periodStart="+date1+"0000&periodEnd="+date2+"0000")
    .then((response) => response.text())
    .then((responseText) => {
      parseString(responseText, function (err, result) {      
      let arr = result.Publication_MarketDocument.TimeSeries[0].Period[0].Point; 
      let sum = 0;
      let prices=[];
      let pricesPerHour=[];
      let maxPrice = 0;
      let minPrice = 0;
      let maxRange = "";
      let minRange = "";

      arr.forEach((element) => {
        let position = parseInt(element.position);
        let start;
        if(position < 10){
          position = `0${position}`;
          start = `0${position-1}`;
        }
        else if(position == 10){
          start = `0${position-1}`;
        }
        else{
          start = position-1;
        }
        let price = parseFloat(element["price.amount"]);
        prices.push(price/10);
        pricesPerHour.push({"hour":start, "end":position, "price":((price/10).toFixed(2))});
        sum=sum+price;       
        setPriceList(priceList=>[...priceList, {"hour":position,"start": start, "price":price}]);        
      });

      setPriceData(prices);
      maxPrice = (Math.max(...prices)).toFixed(2);
      minPrice  = (Math.min(...prices)).toFixed(2);
      setMaxPrice(Math.max(...prices));
      setMinPrice(Math.min(...prices));
      for( let i = 0; i < pricesPerHour.length; i++ ){
        if (pricesPerHour[i].price == maxPrice){
          maxRange = pricesPerHour[i].hour + "-" + pricesPerHour[i].end;
        }
        else if (pricesPerHour[i].price == minPrice){
          minRange = pricesPerHour[i].hour + "-" + pricesPerHour[i].end;
        }
      }
      setMinPriceRange(minRange);
      setMaxPriceRange(maxRange);
      /* console.log(pricesPerHour);
      console.log("Min : " +minPrice + " Max : " +maxPrice);
      console.log("Min price hour:" +minHour);
      console.log("Max price hour:" +maxHour);
      console.log("Max Range: " + maxRange);
      console.log("Min Range: " + minRange);
      console.log("sum = " +sum); */
      if(prices.length>24)
      {
        setAvgPrice((sum/25)/10);
      }
      else{
        setAvgPrice((sum/24)/10); 
      }
      setResponseGot(true);
    });  
   })
  .catch((error) => {
    console.log('Error fetching the feed: ', error);
  });
}

/* This function clears the price data */
const clearPrices=()=>{
  setPriceList([]);
  setPriceData([]);
}

/* This function sets the flagCode state-variable value. The value depends on the name -parameter*/
const setCountry=(name)=>{
  if(name=="Suomi"){
    setFlagCode("fi");
  }
  else if(name=="Ruotsi"){
    setFlagCode("se");
  }
  else if(name=="Tanska"){
    setFlagCode("dk");
  }
  else if(name=="Norja"){
    setFlagCode("no");
  }
  else if(name=="Viro"){
    setFlagCode("ee");
  }
  else if(name=="Puola"){
    setFlagCode("pl");
  }
}

const AvgPrice=()=>{
  if(responseGot){
    return(  
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#1D976C', 'steelblue', '#93F9B9']} style={styles.results}>
          <View style={{flex:1, flexDirection: 'row',}}>
          <View style={styles.resultLeftStyle}>
              <CountryFlag style={{borderRadius: 3,}}  isoCode={flagCode} size={38} />
            </View>
            <View style={styles.resultCenterStyle}>              
              <Text style={styles.resultTextDate}>{selectedDate}</Text>        
            </View>
            <View style={styles.resultRightStyle}>
              <Text style={styles.resultTextLabel}>halvin {"(klo "}{minPriceRange}{")"}</Text>
              <Text style={styles.resultTextMin}>{(minPrice).toFixed(2)} snt/kWh</Text>  
              <Text style={styles.resultTextLabel}>kallein {"(klo "}{maxPriceRange}{")"}</Text>
              <Text style={styles.resultTextMax}>{(maxPrice).toFixed(2)} snt/kWh</Text> 
              <Text style={styles.resultTextLabel}>vrk keskihinta:{" "}</Text>
              <Text style={styles.resultTextAvg}>{(avgPrice).toFixed(2)} snt/kWh</Text>                 
            </View>
          </View>
          <RenderChart/>
        </LinearGradient>
      
    )
  } 
}
/* this function returns the CountryFlag -component according to the flagCode variable */
const RenderFlag=()=>{
  if (!flagCode){
    return( 
      <Icon style={styles.icon} name="flag" size={24} color="ivory" />
    );
  }
  else{
    return(
      <CountryFlag  style={styles.icon} isoCode={flagCode} size={18} />
    );
  }
}

/* ***************************************************************
*************RETURN FUNCTION OF APP.JS START HERE!!!!!************ 
*******************************************************************/
  return(
    <View style={styles.container}>
      {/* using a ImageBackground -component to add a background image to the view */}
      <ImageBackground source={require('./assets/images/background.jpg')}
          style={styles.image} resizeMode='cover'>
        {/* <View style={styles.headingBackground}>
          <Text style={styles.headingStyle}>Sähkön päiväkohtaiset spot-hinnat</Text>
        </View>      */}  
        <View style={styles.datepicker}>
          <DatePicker 
            mode="date"
            androidMode='calendar'
            date={date} 
            onDateChange={setDate}
            textColor="ivory"
            locale='fi'
            androidVariant='iosClone'
            backgroundColor="steelblue"
           fadeToColor="#0F3E64"
            maximumDate= {new Date()}
            minimumDate={new Date(2014, 11, 16)}
          />
          </View>
        <View style={styles.formView}>
          <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemContainerStyle = {styles.itemContainerStyle}
              iconStyle={styles.iconStyle}
              itemTextStyle = {styles.itemTextStyle}
              activeColor = "#0F3E64"
              iconColor = "ivory"
              data={countryCodes}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Valitse maa"
              searchPlaceholder="Etsi..."
              value={value}
              onChange={item => {
                  setCountryCode(item.value);  
                  setValue(item.value);
                  setCountry(item.label);
                  setResponseGot(false);                
              }}
              renderLeftIcon={() => ( 
                  <RenderFlag/>            
              )}
            />
          <AppButton title="Hae hinta" onPress={()=>getTargetDate()} backgroundColor="maroon" fontColor="ivory"/>
        </View>
        <AvgPrice/>                    
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingBackground:{
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    borderColor: 'ivory',
    borderWidth: 2,
    backgroundColor: 'black',
    textAlignVertical: 'center',
  },
  headingStyle:{
    fontSize: 20,
    color: 'ivory',
    fontWeight: 'bold',  
    alignSelf: 'center',
  },
  datepicker:{ 
    marginTop: 10,   
    marginBottom: 5,
  },
  results:{
    flex: 1,
    alignItems: 'center',    
    borderWidth:2,
    borderColor: 'ivory',
    borderRadius: 10,
    width:'100%',
    paddingBottom: 5,
    marginBottom: 10,
  },
  resultLeftStyle:{
    flex:3, 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  resultCenterStyle:{
    flex:3, 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  resultRightStyle:{
    flex:3, 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',   
  },  
  resultTextLabel:{
    color: 'ivory',
    fontWeight:'bold',
    fontSize: 12,
    marginTop: 5,
  },
  resultTextDate:{
    color: 'ivory',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 5,
}, 
  resultTextAvg:{
      color: 'ivory',
      fontWeight: 'bold',
      fontSize: 12,
      backgroundColor: 'darkblue',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3 ,
  }, 
  resultTextMax:{
    color: 'ivory',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: 'darkred',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3 ,
}, 
  resultTextMin:{
    color: 'ivory',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: 'darkgreen',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3 ,
  }, 
  formView:{
    flexDirection: 'row',
    alignItems:"center",
  },  
  chartView:{
    alignItems: 'center',    
  },
  image:{
    flex:1,
    width:'100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
  },
  appButtonContainer: {
    elevation: 2,
    backgroundColor: "#009688",
    borderRadius: 8,
    borderColor: 'ivory',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  appButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  dropdown: {
    margin: 16,
    height: 45,
    width: 200,
    borderWidth: 2,
    borderColor: 'ivory',
    borderRadius: 5,
    backgroundColor: 'steelblue',
  },
  icon: {
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: 18,
    color: 'ivory',
    fontWeight: '500',
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#f6f6f6',
    color: 'black',
    marginVertical: 2,
    marginHorizontal: 2,
  },
  itemContainerStyle:{
    backgroundColor: 'steelblue',
    marginHorizontal: 2,
    marginVertical: 0,
  },
  itemTextStyle:{
    fontWeight: '400',
    color: 'ivory',
  },

});

export default App;