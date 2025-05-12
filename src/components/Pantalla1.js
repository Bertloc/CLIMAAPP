import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

export default class Pantalla1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ciudad: '',
      climaActual: null,
      pronostico: [],
      sugerencias: [],
      error: '',
    };
  }

  buscarSugerencias = (texto) => {
    const API_KEY = '8481e0168607403685a201326251205';
    this.setState({ ciudad: texto });

    if (texto.length < 3) {
      this.setState({ sugerencias: [] });
      return;
    }

    fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${texto}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          this.setState({ sugerencias: data });
        } else {
          this.setState({ sugerencias: [] });
        }
      })
      .catch(() => {
        this.setState({ sugerencias: [] });
      });
  };

  buscarClima = () => {
    const API_KEY = '8481e0168607403685a201326251205';
    const { ciudad } = this.state;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${ciudad}&days=5&aqi=no&alerts=no`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          climaActual: data.current,
          pronostico: data.forecast.forecastday,
          sugerencias: [],
          error: '',
        });
      })
      .catch(() => {
        this.setState({
          error: 'No se pudo obtener el clima',
          climaActual: null,
          pronostico: [],
        });
      });
  };

  renderSugerencia = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.setState({ ciudad: item.name }, () => this.buscarClima());
      }}
      style={styles.sugerencia}
    >
      <Text>{item.name}, {item.country}</Text>
    </TouchableOpacity>
  );

  renderPronostico = ({ item }) => (
    <View style={styles.cardDia}>
      <Text style={styles.fecha}>{item.date}</Text>
      <Image source={{ uri: 'https:' + item.day.condition.icon }} style={styles.icono} />
      <Text>{item.day.condition.text}</Text>
      <Text>🌡️ Max: {item.day.maxtemp_c}°C / Min: {item.day.mintemp_c}°C</Text>
      <Text>💧 Lluvia: {item.day.totalprecip_mm} mm</Text>
    </View>
  );

  render() {
    const { ciudad, climaActual, pronostico, sugerencias, error } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>🌤️ Consulta el Clima</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribe una ciudad"
          placeholderTextColor="#888"
          value={ciudad}
          onChangeText={this.buscarSugerencias}
        />

        {sugerencias.length > 0 && (
          <FlatList
            data={sugerencias}
            renderItem={this.renderSugerencia}
            keyExtractor={(item, index) => index.toString()}
            style={styles.lista}
          />
        )}

        <TouchableOpacity style={styles.boton} onPress={this.buscarClima}>
          <Text style={styles.botonTexto}>Buscar</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {climaActual && (
          <View style={styles.resultado}>
            <Text style={styles.temp}>{climaActual.temp_c}°C</Text>
            <Image source={{ uri: 'https:' + climaActual.condition.icon }} style={styles.icono} />
            <Text>{climaActual.condition.text}</Text>
            <Text>💨 Viento: {climaActual.wind_kph} km/h</Text>
            <Text>💧 Lluvia: {climaActual.precip_mm} mm</Text>
          </View>
        )}

        {pronostico.length > 0 && (
          <View style={styles.pronostico}>
            <Text style={styles.subtitulo}>📅 Próximos 5 días</Text>
            <FlatList
              data={pronostico}
              renderItem={this.renderPronostico}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 5,
  },
  lista: {
    maxHeight: 120,
    width: '100%',
    marginBottom: 10,
  },
  sugerencia: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  boton: {
    backgroundColor: '#0077ff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
  },
  resultado: {
    marginTop: 30,
    alignItems: 'center',
  },
  temp: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  icono: {
    width: 64,
    height: 64,
    marginVertical: 8,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  pronostico: {
    marginTop: 30,
    width: '100%',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDia: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    elevation: 2,
    width: 150,
  },
  fecha: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});