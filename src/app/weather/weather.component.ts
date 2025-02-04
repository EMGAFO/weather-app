import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../weather.service'; // Importa el servicio

@Component({
  selector: 'app-weather', // Selector del componente
  standalone: true, // Indica que es un componente standalone
  imports: [CommonModule, FormsModule], // Importa módulos necesarios
  templateUrl: './weather.component.html', // Template del componente
  styleUrls: ['./weather.component.css'] // Estilos del componente
})
export class WeatherComponent {
  city1 = ''; // Variable para almacenar la primera ciudad ingresada por el usuario
  city2 = ''; // Variable para almacenar la segunda ciudad ingresada por el usuario
  weatherData1: any = null; // Variable para almacenar los datos del clima 1
  weatherData2: any = null; // Variable para almacenar los datos del clima 2
  errorMessage1 = ''; // Variable para almacenar mensajes de error 1
  errorMessage2 = ''; // Variable para almacenar mensajes de error 2
  unit: string = 'metric'; // Inicializa con 'metric' o 'imperial'

  // Inyecta el servicio WeatherService en el constructor
  constructor(private weatherService: WeatherService) {}

  // Método para obtener el clima de la ciudad ingresada
  getWeather1() {
    this.weatherService.getWeather(this.city1).subscribe({
      next: (data) => {
        this.weatherData1 = data; // Almacena los datos del clima
        this.errorMessage1 = ''; // Limpia el mensaje de error
      },
      error: (err) => {
        this.errorMessage1 = 'Ciudad 1 no encontrada. Intenta de nuevo.'; // Muestra un mensaje de error
        this.weatherData1 = null; // Limpia los datos del clima
      }
    });
  }

  getWeather2(){
    this.weatherService.getWeather(this.city2).subscribe({
      next: (data) => {
        this.weatherData2 = data // ALmacena los datos del clima
        this.errorMessage2 = ''; // Limpia el mensaje de error 2
      },
      error : (err) => {
        this.errorMessage2 = 'Ciudad 2 no encontrada. Intenta de nuevo'
        this.weatherData2 = null; //Limpiar los datos del clima
      }
    })
  }

  getBackground(weatherCondition: string): string {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
      case 'clear sky':
        return "url('assets/backgrounds/sunny.jpg')"; // ☀️ Soleado
      case 'clouds':
      case 'scattered clouds':
      case 'few clouds':
        return "url('assets/backgrounds/cloudy.jpg')"; // ☁️ Nublado
      case 'rain':
      case 'shower rain':
      case 'light rain':
        return "url('assets/backgrounds/rainy.jpg')"; // 🌧 Lluvia
      case 'thunderstorm':
        return "url('assets/backgrounds/storm.jpg')"; // ⛈ Tormenta
      case 'snow':
        return "url('assets/backgrounds/snowy.jpg')"; // ❄️ Nieve
      case 'mist':
      case 'fog':
        return "url('assets/backgrounds/foggy.jpg')"; // 🌫 Niebla
      default:
        return "url('assets/backgrounds/default.jpg')"; // 🌍 Fondo por defecto
    }
  }
}