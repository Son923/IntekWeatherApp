import * as React from 'react';
import { Text, View, StyleSheet, Image, TextInput, Picker } from 'react-native';

const data = require('../data.json');
const app_id = '4c850412081c129fab0ff438bf8948dc';

export default class CityList extends React.Component {
  state = {
    city_id: '',
    city_name: '',
    weather: '',
    temperature: '',
    humidity: '',
    pressure: '',
  };

  checkInput = text => {
    { 
      data.map(item => {
        if (item.name.toLowerCase().includes(text.toLowerCase())) {
          {
            this.setSelected(item.id);
          }
          return;
        }
      });
    }
  };

  setSelected = async value => {
    await this.setState({ city_id: value });
    try {
      let response = await fetch(
        'http://api.openweathermap.org/data/2.5/weather?id=' +
          this.state.city_id +
          '&APPID=' +
          app_id +
          '&units=metric',
        {
          method: 'GET',
        }
      );
      console.log(response)
      let { main, weather, name } = await response.json();
      await this.setState({
        city_name: name,
        weather: weather[0].main,
        temperature: main.temp,
        humidity: main.humidity,
        pressure: main.pressure,
        icon: weather[0].icon
      });
    } catch (error) {
      console.log(error);
    }
  };

  loadresult = () => {
    if (this.state.city_id) {
      return (
        <View >
          <Text style={styles.weatherText}>City: {this.state.city_name} </Text>
          <Text style={styles.weatherText}>
            Temperature: {this.state.temperature} C
          </Text>
          <Text style={styles.weatherText}>
            Pressure: {this.state.pressure} P
          </Text>
          <Text style={styles.weatherText}>
            Humidity: {this.state.humidity} %
          </Text>
          <Image
            style={{width: 100, height: 100}}
            source={{uri: 'http://openweathermap.org/img/w/' + this.state.icon + '.png'}}
          />
        </View>
      );
    } else {
      return <View style={styles.weatherContainer} />;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          textAlign={'center'}
          onChangeText={text => this.checkInput(text)}
        />
        <Picker
          style={styles.picker}
          itemStyle={styles.picker}
          selectedValue={this.state.city_id}
          onValueChange={value => this.setSelected(value)}>
          <Picker.Item label="Select a city..." value="" />
          {data.map(item => (
            <Picker.Item label={item.name} value={item.id} />
          ))}
        </Picker>
        {this.loadresult()}        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
   picker: {
    width: 300,
    height: 100,
    marginBottom: 5,
  },
  input: {
    width: 300,
    height: 50,
    borderColor: '#50c9f6',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  weatherText: {
    fontSize: 18,
    height: 40,
  },
});
