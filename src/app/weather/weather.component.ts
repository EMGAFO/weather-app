import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  map,
  startWith,
  switchMap,
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
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
export class WeatherComponent implements OnInit {
  city1 = ''; // Ciudad seleccionada 1
  city2 = ''; // Ciudad seleccionada 2
  weatherData1: any = null; // Datos del clima para la ciudad 1
  weatherData2: any = null; // Datos del clima para la ciudad 2
  errorMessage1 = ''; // Mensaje de error para la ciudad 1
  errorMessage2 = ''; // Mensaje de error para la ciudad 2
  unit: string = 'metric'; // Unidad de medida ('metric' o 'imperial')
  selectedCity1: any;
  selectedCity2: any;

  // Controles para el autocompletado
  city1Control = new FormControl();
  city2Control = new FormControl();

  // Observables para filtrar ciudades
  filteredCities1: Observable<any[]> | null = null;
  filteredCities2: Observable<any[]> | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.filteredCities1 = this.city1Control.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        if (value && value.length > 2) {
          return this.filterCities(value);
        } else {
          return of([]);
        }
      })
    );

    this.filteredCities2 = this.city2Control.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        if (value && value.length > 2) {
          return this.filterCities(value);
        } else {
          return of([]);
        }
      })
    );
  }

  filterCities(value: string): Observable<any[]> {
    const filterValue = value.toLowerCase();

    return this.weatherService.getCities(filterValue);
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
        console.log(JSON.stringify(this.weatherData1));
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

  onCitySelected(
    event: MatAutocompleteSelectedEvent,
    cityType: 'city1' | 'city2'
  ) {
    const selectedCity = event.option.value;

    if (cityType === 'city1') {
      this.city1 = selectedCity.name;
      this.selectedCity1 = selectedCity;
      this.city1Control.setValue(selectedCity.name); // Establece el nombre en el input
      this.weatherData1 = null; // Resetea los datos climáticos
      this.errorMessage1 = ''; // Borra mensajes de error
      this.getWeather1(); // Obtener el clima al seleccionar la ciudad
    } else {
      this.city2 = selectedCity.name;
      this.selectedCity2 = selectedCity;
      this.city2Control.setValue(selectedCity.name);
      this.weatherData2 = null;
      this.errorMessage2 = '';
      this.getWeather2(); // Obtener el clima al seleccionar la ciudad
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

  updateWeatherUnits() {
    if (this.selectedCity1) {
      this.getWeather1();
    }
    if (this.selectedCity2) {
      this.getWeather2();
    }
  }
}