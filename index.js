const { leerInput, inquireMenu, pausaEnter, listarLugares } = require("./helpers/inquirer")
const Busquedas = require("./models/busquedas")

require('dotenv').config()
require('colors')

// console.log(process.env.MAPBOX_KEY)

const main = async () => {
    const busquedas = new Busquedas()
    let opt 
    do {
        opt = await inquireMenu()
        switch( opt ) {
            case 1:
                //Mostrar Mensaje
                const termino = await leerInput('Ciudad: ')
                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino)
                //Seleccionar el lugar                
                const id = await listarLugares(lugares)
                if(id === 0) continue

                const lugarSel = lugares.find( l => l.id === id)
                
                //Guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre)

                //CLima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)
                //Mostrar REsultados
                console.clear()
                console.log('\nInformacion de la Ciudad\n'.green)
                console.log('Ciudad: '.cyan, lugarSel.nombre)
                console.log('Latitud: '.cyan, lugarSel.lat)
                console.log('Longitud: '.cyan, lugarSel.lng)
                console.log('Temperatura: '.cyan, clima.temp)
                console.log('Minima: '.cyan, clima.min)
                console.log('Maxima: '.cyan, clima.max)
                console.log('Descripcion: '.cyan, clima.desc)
            break;
            case 2:
                let i = 1
                // busquedas.historial.forEach( lugar => {
                //     console.log(`${i}.- ${lugar}`)
                //     i++
                // } )
                busquedas.historialUpperCase.forEach( lugar => {
                    console.log(`${i}.- ${lugar}`)
                    i++
                } )
            break;
        }

        if(opt !== 0) await pausaEnter()
    } while (opt !== 0)
}
main()