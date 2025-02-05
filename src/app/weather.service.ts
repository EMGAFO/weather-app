import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Endpoint para buscar ciudades por nombre
  private geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';
  // Endpoint para obtener datos del clima
  private weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  // Clave de API desde el archivo environment
  private apiKey = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  /**
   * Método para obtener una lista de ciudades basadas en la entrada del usuario.
   * @param query - El texto ingresado por el usuario (nombre de la ciudad).
   * @returns Un observable con la lista de ciudades sugeridas.
   */
  getCities(query: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.geoApiUrl}?q=${query}&limit=5&appid=${this.apiKey}`
    );
  }

  /**
   * Método para obtener los datos del clima de una ciudad específica.
   * @param city - El nombre de la ciudad.
   * @param unit - La unidad de medida ('metric' o 'imperial').
   * @returns Un observable con los datos del clima.
   */
  getWeather(city: string, unit: string = 'metric'): Observable<any> {
    return this.http.get(
      `${this.weatherApiUrl}?q=${city}&appid=${this.apiKey}&units=${unit}`
    );
  }
}