import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Importar environment

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = environment.weatherApiKey;  // Usar la API Key del environment

  constructor(private http: HttpClient) {}

/*   getWeather(city: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`
    );
  } */

    getWeather(city: string, unit: string = 'metric'): Observable<WeatherResponse> {
      return this.http.get<WeatherResponse>(
        `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=${unit}`
      );
    }

}