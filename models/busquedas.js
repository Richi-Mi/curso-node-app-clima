const fs = require('fs')
const axios = require('axios');

class Busquedas {
    constructor() {
        //TODO: Leer Db si existe
        this.historial = []
        this.dbPath = './db/database.json'
        this.leerDB()
    }
    get paramsMapBox() {
        return {
            
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
            
        }
    }
    get historialUpperCase () {
        const historyC = [] 
        this.historial.forEach( place => {
            historyC.unshift(place.toUpperCase())
        } ) 
        return historyC
    }
    async ciudad(lugar) {
        try {
            //Peticion HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })
            const response = await instance.get()
            // const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/bogota.json?access_token=pk.eyJ1IjoicmljaGktbWkiLCJhIjoiY2txc2liM2M2Mjc4MTJ1bW15dTRrbTlsZyJ9.32dS9OQaFqzO4k8xBDXcpw&limit=5&language=es')
            // console.log(response.data.features)
        
            return response.data.features.map( lugar => {
                return {
                    id: lugar.id,
                    nombre: lugar.place_name,
                    lng: lugar.center[0],
                    lat: lugar.center[1]
                }
            })
        } catch (error) {
            console.log(error)
            console.log('EEEEERRROOORR')
            return []
        } // Retornar los lugares 
    }

    async climaLugar(lat, lon) {
        try {
            //instancia de axios.create
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    'lat': lat,
                    'lon': lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    'lang': 'es',
                    'units': 'metric'
                }
            })
            const { data } = await instance.get()
            const { main, weather } = data
            //resp.data
            return {
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                desc: weather[0].description
            }
        } catch (error) {
            // console.log(error)
            console.log('UPS, hubo un error')
        }
    }
    agregarHistorial(lugar) {
        //TODO: prevenir duplicados
        if (this.historial.includes(lugar.toLowerCase())) {
            return 
        }
        this.historial = this.historial.splice(0, 5)

        this.historial.push(lugar)

        //Grabar en DB
        this.guardarDB()
    }
    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    leerDB() {
        //Debe de existir... 
        //Cargar info readFileSync { encoding: 'utf-8}
        if(!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, '')
        }

        const data = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const history = JSON.parse(data)
        this.historial =  history.historial
    }
}
module.exports = Busquedas