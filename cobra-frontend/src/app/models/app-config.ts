import { EMedioDePago } from "./payment";
export interface AppConfig {
    mediosDePago: EMedioDePago[];
    buAceptadosCVU: string[];
    anuncios: any[];
    banners: any[];
    preguntasFrecuentes: {pregunta: string, respuesta: string}[];
    cartelCotizacion: {mostrar: boolean, texto: string};
    clientAlert: {message: string, enabled: boolean}
}