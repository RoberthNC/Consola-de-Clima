import { inquirerMenu, leerInput, listarCiudades, pausa } from "./helpers/inquirer.js";
import Busquedas from "./models/Busquedas.js";

const main = async() => {

    const busquedas = new Busquedas();
    let opt = "";

    do{

        opt = await inquirerMenu();

        
        switch (opt) {
            case "1":
                //Mostrar mensaje
                const ciudad = await leerInput();
                
                //Buscar los lugares
                const ciudades = await busquedas.buscarCiudad( ciudad );
                
                //Seleccionar el lugar
                const idSeleccionado = await listarCiudades(ciudades);
                if( idSeleccionado === "0" ) continue;

                const ciudadSeleccionada = ciudades.find( c => c.id === idSeleccionado );
                //Guardar en DB
                busquedas.agregarHistorial(ciudadSeleccionada.nombre);

                //Datos del clima
                const clima = await busquedas.climaCiudad(ciudadSeleccionada.lat,ciudadSeleccionada.lng);
                const climaDataTemp = clima.data.main;
                const climaDesc = clima.data.weather[0].description;
                console.log(climaDesc);

                //Mostrar resultados
                console.clear();
                console.log("\nInformación de la ciudad\n".green);
                console.log("Ciudad: ",ciudadSeleccionada.nombre.yellow);
                console.log("Lat: ",ciudadSeleccionada.lat);
                console.log("Lng: ",ciudadSeleccionada.lng);
                console.log("Temperatura: ",climaDataTemp.temp);
                console.log("Mínima: ",climaDataTemp.temp_min);
                console.log("Máxima: ",climaDataTemp.temp_max);
                console.log("El clima se ve: ",climaDesc.toUpperCase().yellow);
                break;
        
            case "2":
                busquedas.historialCapitalizado.forEach( (busqueda,i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${busqueda}`);
                } );
                break;

            default:
                break;
        }


        console.log();
        if(opt !== "0") await pausa();

    }while( opt !== "0" );

}

main()
