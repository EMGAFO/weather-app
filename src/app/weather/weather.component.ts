import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent {
  city1 = ''; // Ciudad seleccionada 1
  city2 = ''; // Ciudad seleccionada 2
  weatherData1: any = null; // Datos del clima para la ciudad 1
  weatherData2: any = null; // Datos del clima para la ciudad 2
  errorMessage1 = ''; // Mensaje de error para la ciudad 1
  errorMessage2 = ''; // Mensaje de error para la ciudad 2
  unit: string = 'metric'; // Unidad de medida ('metric' o 'imperial')

  // Controles para el autocompletado
  city1Control = new FormControl();
  city2Control = new FormControl();

  // Observables para filtrar ciudades
  filteredCities1: Observable<any[]>;
  filteredCities2: Observable<any[]>;

  constructor(private weatherService: WeatherService) {
    // Filtrar ciudades según lo que el usuario escribe
    this.filteredCities1 = this.city1Control.valueChanges.pipe(
      startWith(''),
      filter((value) => value && value.trim().length > 0), // Ignorar valores vacíos
      switchMap((value) => this.weatherService.getCities(value || ''))
    );

    this.filteredCities2 = this.city2Control.valueChanges.pipe(
      startWith(''),
      filter((value) => value && value.trim().length > 0), // Ignorar valores vacíos
      switchMap((value) => this.weatherService.getCities(value || ''))
    );
  }

  // Método para obtener el clima de la ciudad 1
  getWeather1() {
    if (!this.city1 || this.city1.trim() === '') {
      this.errorMessage1 = 'Por favor, ingresa una ciudad válida.';
      return;
    }

    this.weatherService.getWeather(this.city1, this.unit).subscribe({
      next: (data) => {
        this.weatherData1 = data;
        this.errorMessage1 = '';
      },
      error: (err) => {
        this.errorMessage1 = 'Ciudad 1 no encontrada. Intenta de nuevo.';
        this.weatherData1 = null;
      },
    });
  }

  // Método para obtener el clima de la ciudad 2
  getWeather2() {
    if (!this.city2 || this.city2.trim() === '') {
      this.errorMessage2 = 'Por favor, ingresa una ciudad válida.';
      return;
    }

    this.weatherService.getWeather(this.city2, this.unit).subscribe({
      next: (data) => {
        this.weatherData2 = data;
        this.errorMessage2 = '';
      },
      error: (err) => {
        this.errorMessage2 = 'Ciudad 2 no encontrada. Intenta de nuevo.';
        this.weatherData2 = null;
      },
    });
  }

  // Método para manejar la selección de una ciudad
  onCitySelected(event: any, field: string): void {
    const selectedCity = event.option.value;

    if (field === 'city1') {
      this.city1 = selectedCity.name; // Asigna solo el nombre de la ciudad
      this.city1Control.setValue(this.city1); // Actualiza el valor del FormControl
    } else if (field === 'city2') {
      this.city2 = selectedCity.name; // Asigna solo el nombre de la ciudad
      this.city2Control.setValue(this.city2); // Actualiza el valor del FormControl
    }
  }

  // Método para obtener el fondo según la condición climática
  getBackground(weatherCondition: string): string {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
      case 'clear sky':
        return "url('assets/backgrounds/sunny.jpg')";
      case 'clouds':
      case 'scattered clouds':
      case 'few clouds':
        return "url('assets/backgrounds/cloudy.jpg')";
      case 'rain':
      case 'shower rain':
      case 'light rain':
        return "url('assets/backgrounds/rainy.jpg')";
      case 'thunderstorm':
        return "url('assets/backgrounds/storm.jpg')";
      case 'snow':
        return "url('assets/backgrounds/snowy.jpg')";
      case 'mist':
      case 'fog':
        return "url('assets/backgrounds/foggy.jpg')";
      default:
        return "url('assets/backgrounds/default.jpg')";
    }
  }
}