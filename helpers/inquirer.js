import inquirer from "inquirer";
import colors from "colors";

const preguntas = [
    {
        type:"list",
        name:"opcion",
        message:"¿Qué desea hacer?",
        choices: [
            {
                value:"1",
                name:`${"1.".green} Buscar ciudad`
            },
            {
                value:"2",
                name:`${"2.".green} Historial`
            },
            {
                value:"0",
                name:`${"0.".green} Salir`
            }
        ]
    }
]

const inquirerMenu = async() => {

    console.clear();
    console.log("==========================".green);
    console.log("  Seleccione una opción");
    console.log("==========================".green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;

}

const leerInput = async() => {

    const pregunta = [
        {
            type:"input",
            name:"ciudad",
            message:"Ciudad a buscar:"
        }
    ];

    const { ciudad } = await inquirer.prompt(pregunta);

    return ciudad;
}

const pausa = async() => {


    await inquirer.prompt(
        [
            {
                type:"input",
                name:"pausa",
                message:`Presione ${"ENTER".green} para continuar`
            }
        ]
    );

    return;

}

const listarCiudades = async(ciudades = []) => {

    const choices = ciudades.map( (ciudad,i) => {

        const idx = `${i + 1}.`.green;

        return {
            value:ciudad.id,
            name:`${idx} ${ciudad.nombre}`
        }

    } );

    choices.unshift({
        value:'0',
        name:'0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type:"list",
            name:"id",
            message:"Seleccione:",
            choices
        }
    ];

    const { id } = await inquirer.prompt(preguntas);

    return id;

}

export {
    inquirerMenu,
    leerInput,
    listarCiudades,
    pausa,
}

