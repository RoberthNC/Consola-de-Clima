
import axios from "axios";
import fs from "fs";

import { MAPBOX_KEY, OPENWEATHER } from "../env/env.js";

class Busquedas{

    historial = [];
    dbPath = "./db/database.json";

    constructor(){
        //Leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( ciudad => {
            let palabras = ciudad.split(" ");
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(" ");
        } )
    }

    get paramsMapbox(){
        return {
            'access_token': MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async buscarCiudad( ciudad = "" ){
        try {
            //Petición HTTP
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ ciudad }.json`,
                params:this.paramsMapbox
            })

            const res = await instance.get();
            //Regresar los lugares que coincidan
            return res.data.features.map( ciudad => ({
                id:ciudad.id,
                nombre:ciudad.place_name,
                lng:ciudad.center[0],
                lat:ciudad.center[1]
            }) );
    
        } catch (error) {
            return [];
        }
    }

    async climaCiudad(lat,lon){
        try {
            //Crear instancia de axios
            const instancia = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'appid': OPENWEATHER,
                    'lat': lat,
                    'lon': lon,
                    'lang': 'es',
                    'units': 'metric'
                }
            })
            //Extraer la información que se encuentra en la data
            const res = await instancia.get();

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( ciudad = "" ){
        if( this.historial.includes( ciudad.toLowerCase() ) ){
            return;
        }
        this.historial = this.historial.splice(0,5);

        this.historial.unshift( ciudad .toLowerCase());
        //Grabar en DB
        this.guardarDB()
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath,JSON.stringify( payload ));
    }

    leerDB(){
        //Debe existir y si no existe no hace nada
        if( !fs.existsSync(this.dbPath) ){
            return;
        }

        const informacion = fs.readFileSync(this.dbPath,{ encoding:"utf-8" });
        const data = JSON.parse(informacion);

        this.historial = data.historial;

    }

}

export default Busquedas