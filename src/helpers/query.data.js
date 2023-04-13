const {Cliente, Proveedor, Familia, Producto, Impuesto, Usuario} = require('../models');

const genClientData = async () =>{
    const countCliente = await Cliente.find();
    if (countCliente.length > 0) {
        return;
    }

    const CLIENT = [
        {dni:"99229901", nombre: 'Angeles', apaterno: 'PORTUGAL', amaterno:"ALTAMIRANO", telefono: '955102047', correo: 'Ang_POR_ALT@mail.com',},
        {dni:"99229902", nombre: 'Yamile', apaterno: 'VILELA', amaterno:"BECERRA", telefono: '955102047', correo: 'Yam_VIL_BEC@mail.com',},
        {dni:"99229903", nombre: 'Ronald', apaterno: 'CRISPIN', amaterno:"BENITO", telefono: '955102047', correo: 'Ron_CRI_BEN@mail.com',},
        {dni:"99229904", nombre: 'Fernando', apaterno: 'CAVERO', amaterno:"BERNAL", telefono: '955102047', correo: 'Fer_CAV_BER@mail.com',},
        {dni:"99229905", nombre: 'Andrea', apaterno: 'APOLAYA', amaterno:"BURGOS", telefono: '955102047', correo: 'And_APO_BUR@mail.com',},
        {dni:"99229906", nombre: 'Emilio', apaterno: 'HUISA', amaterno:"CARBONE", telefono: '955102047', correo: 'Emi_HUI_CAR@mail.com',},
        {dni:"99229907", nombre: 'Fabian', apaterno: 'HUISA', amaterno:"CARBONE", telefono: '955102047', correo: 'Fab_HUI_CAR@mail.com',},
        {dni:"99229908", nombre: 'Andrea', apaterno: 'FLORES', amaterno:"CARI", telefono: '955102047', correo: 'And_FLO_CAR@mail.com',},
        {dni:"99229909", nombre: 'Jafet', apaterno: 'VARGAS', amaterno:"CARNERO", telefono: '955102047', correo: 'Jaf_VAR_CAR@mail.com',},
        {dni:"99229910", nombre: 'Alexandra', apaterno: 'LEON', amaterno:"PALACIOS", telefono: '955102047', correo: 'Ale_LEO_PAL@mail.com',},
        {dni:"99229911", nombre: 'David', apaterno: 'GARCIA', amaterno:"CHACALIAZA", telefono: '955102047', correo: 'Dav_GAR_CHA@mail.com',},
        {dni:"99229912", nombre: 'Jeremias', apaterno: 'PALOMINO', amaterno:"CORDOVA", telefono: '955102047', correo: 'Jer_PAL_COR@mail.com',},
        {dni:"99229913", nombre: 'Pierre', apaterno: 'VASQUEZ', amaterno:"COX", telefono: '955102047', correo: 'Pie_VAS_COX@mail.com',},
        {dni:"99229914", nombre: 'Julissa', apaterno: 'APOLAYA', amaterno:"FERNANDEZ", telefono: '955102047', correo: 'Jul_APO_FER@mail.com',},
        {dni:"99229915", nombre: 'Eduardo', apaterno: 'CARBAJAL', amaterno:"FLORES", telefono: '955102047', correo: 'Edu_CAR_FLO@mail.com',},
        {dni:"99229916", nombre: 'Julio', apaterno: 'VALENCIA', amaterno:"GOMEZ", telefono: '955102047', correo: 'Jul_VAL_GOM@mail.com',},
        {dni:"99229917", nombre: 'Andrea', apaterno: 'CUBA', amaterno:"GRENTZ", telefono: '955102047', correo: 'And_CUB_GRE@mail.com',},
        {dni:"99229918", nombre: 'Jennifer', apaterno: 'RAMIREZ', amaterno:"JARAMILLO", telefono: '955102047', correo: 'Jen_RAM_JAR@mail.com',},
        {dni:"99229919", nombre: 'Andrea', apaterno: 'INDACOCHEA', amaterno:"LOPEZ", telefono: '955102047', correo: 'And_IND_LOP@mail.com',},
        {dni:"99229920", nombre: 'Giuseppe', apaterno: 'LOPEZ', amaterno:"LOPEZ", telefono: '955102047', correo: 'Giu_LOP_LOP@mail.com',},
        {dni:"99229921", nombre: 'Emerson', apaterno: 'LOPEZ', amaterno:"LUYO", telefono: '955102047', correo: 'Eme_LOP_LUY@mail.com',},
        {dni:"99229922", nombre: 'Eduardo', apaterno: 'RAMIREZ', amaterno:"MONDRAGON", telefono: '955102047', correo: 'Edu_RAM_MON@mail.com',},
        {dni:"99229923", nombre: 'Isabel', apaterno: 'MALDONADO', amaterno:"NAVARRO", telefono: '955102047', correo: 'Isa_MAL_NAV@mail.com',},
    ];

    const result = await Cliente.create(CLIENT);
    if (!result) {
        console.log('No se pudo registrar los Clientes');
    }
    // console.log("🚀 ~ file: query.data.js:36 ~ genClientData ~ result:", result)
}

genProveedorData = async () =>{
    const countProveedor = await Proveedor.find();
    if (countProveedor.length > 0) {
        return;
    }
    const PROVEEDOR = [
        {ruc:'20992299019', nombre: 'Fatima', rubro: 'Fatima S.A.C', telefono: '955102047', correo: 'Fat_TAN_RIV@mail.com',},
        {ruc:'20992299029', nombre: 'Marian', rubro: 'Marian S.A.C', telefono: '955102047', correo: 'Mar_CAS_ROD@mail.com',},
        {ruc:'20992299039', nombre: 'Michelle', rubro: 'Michelle S.A.C', telefono: '955102047', correo: 'Mic_COR_SAL@mail.com',},
        {ruc:'20992299049', nombre: 'Enrique', rubro: 'Enrique S.A.C', telefono: '955102047', correo: 'Enr_MAR_SAN@mail.com',},
        {ruc:'20992299059', nombre: 'Benjamin', rubro: 'Benjamin S.A.C', telefono: '955102047', correo: 'Ben_MAR_SAN@mail.com',},
        {ruc:'20992299069', nombre: 'Mercedes', rubro: 'Mercedes S.A.C', telefono: '955102047', correo: 'Mer_GAR_ZEV@mail.com',},
        {ruc:'20992299079', nombre: 'Celinda', rubro: 'Celinda S.A.C', telefono: '955102047', correo: 'Cel_GAR_ARR@mail.com',},
        {ruc:'20992299089', nombre: 'David', rubro: 'David S.A.C', telefono: '955102047', correo: 'Dav_ORT_CAL@mail.com',},
        {ruc:'20992299099', nombre: 'Carolina', rubro: 'Carolina S.A.C', telefono: '955102047', correo: 'Car_ARA_ESP@mail.com',},
        {ruc:'20992299109', nombre: 'Nahuel', rubro: 'Nahuel S.A.C', telefono: '955102047', correo: 'Nah_RIV_GIR@mail.com',},
        {ruc:'20992299119', nombre: 'Santiago', rubro: 'Santiago S.A.C', telefono: '955102047', correo: 'San_BUS_HER@mail.com',},
        {ruc:'20992299129', nombre: 'Andres', rubro: 'Andres S.A.C', telefono: '955102047', correo: 'And_ENR_JUA@mail.com',},
        {ruc:'20992299139', nombre: 'Pierre', rubro: 'Pierre S.A.C', telefono: '955102047', correo: 'Pie_ZAM_MAR@mail.com',},
        {ruc:'20992299149', nombre: 'Victoria', rubro: 'Victoria S.A.C', telefono: '955102047', correo: 'Vic_OJE_OVA@mail.com',},
        {ruc:'20992299159', nombre: 'Daniel', rubro: 'Daniel S.A.C', telefono: '955102047', correo: 'Dan_MEN_PRI@mail.com',},
        {ruc:'20992299169', nombre: 'Jimmy', rubro: 'Jimmy S.A.C', telefono: '955102047', correo: 'Jim_ATU_ROM@mail.com',},
        {ruc:'20992299179', nombre: 'David', rubro: 'David S.A', telefono: '955102047', correo: 'Dav_LEO_RUI@mail.com',},
        {ruc:'20992299189', nombre: 'Catherine', rubro: 'Catherine S.A.C', telefono: '955102047', correo: 'Cat_CAS_SAL@mail.com',},
        {ruc:'20992299199', nombre: 'Franc', rubro: 'Franc S.A.C', telefono: '955102047', correo: 'Fra_REN_SAN@mail.com',},
        {ruc:'20992299209', nombre: 'Milagros', rubro: 'Milagros S.A.C', telefono: '955102047', correo: 'Mil_BUS_SAY@mail.com',},
        {ruc:'20992299219', nombre: 'Elian', rubro: 'Elian S.A.C', telefono: '955102047', correo: 'Eli_ROB_SIL@mail.com',},
        {ruc:'20992299229', nombre: 'Margory', rubro: 'Margory S.A.C', telefono: '955102047', correo: 'Mar_YNC_SOL@mail.com',},
    ];

    const result = await Proveedor.create(PROVEEDOR);
    if (!result) {
        console.log('No se pudo registrar los Proveedores');
    }
    // console.log("🚀 ~ file: query.data.js:73 ~ genProveedorData= ~ result:", result)
}

genFamiliaProductoData = async () =>{
    const countFamilia = await Familia.find();
    if (countFamilia.length > 0) {
        await Familia.deleteMany();
    }

    const FAMILIA =[
        {codigo: "001", categoria: "Tecnología", descripcion:"Agrupa todos los aparatos tecnologicos",},
        {codigo: "001001", categoria: "Televisor", descripcion:"Agrupa los televisores",},
        {codigo: "001001001", categoria: "Televisor LED", descripcion:"",},
        {codigo: "001001002", categoria: "Televisor Plasma", descripcion:"",},
        {codigo: "001001003", categoria: "Televisor LCD", descripcion:"",},
        {codigo: "001001004", categoria: "Televisor OLED", descripcion:"",},
        {codigo: "001001005", categoria: "Televisor CRT", descripcion:"",},
        {codigo: "001002", categoria: "Teléfono movil", descripcion:"Agrupa los teléfonos moviles",},
        {codigo: "001002001", categoria: "Teléfono movil inteligente", descripcion:"",},
        {codigo: "001002002", categoria: "Teléfono movil Desechables", descripcion:"",},
        {codigo: "001003", categoria: "Accesorios de teléfono movil", descripcion:"",},
        {codigo: "001003001", categoria: "Protector de pantalla", descripcion:"",},
        {codigo: "001003002", categoria: "Fundas de Celulares", descripcion:"",},
        {codigo: "002", categoria: "Electrodomesticos", descripcion:"Agrupa aparatos electronicos que ayudan en las tareas domesticas",},
        {codigo: "002001", categoria: "Estufas", descripcion:"Agrupa los tipos de cocinas",},
        {codigo: "002001001", categoria: "Estufas de gas", descripcion:"",},
        {codigo: "002001002", categoria: "Estufas eléctrica", descripcion:"",},
        {codigo: "002001003", categoria: "Estufas de vitrocerámica", descripcion:"",},
        {codigo: "002001004", categoria: "Estufas de inducción", descripcion:"",},
        {codigo: "002002", categoria: "Refrigeradoras", descripcion:"Agrupa los tipos de refrigerantes",},
        {codigo: "002002001", categoria: "Refrigeradora top", descripcion:"",},
        {codigo: "002002002", categoria: "Refrigeradora side", descripcion:"",},
        {codigo: "002002003", categoria: "congeladora", descripcion:"",},
    ]

    const result = await Familia.create(FAMILIA);
    if (!result) {
        console.log('No se pudo registrar las familia.');
        return;
    }

    const impuestoId = await genImpuesto();
    if (!impuestoId) {
        console.log('No se pudo registrar el impuesto.');
        return;
    }

    const familiaArr = result.filter((f) => {
        if (f.codigo.length === 9) {
            return f;
        }
    });

    const producto =genProducto(familiaArr, impuestoId);
    if (!producto) {
        console.log('No se pudo registrar los productos.');
        return;
    }
}

const genImpuesto = async()=>{
    const countImpuesto = await Impuesto.find();
    if (countImpuesto.length > 0) {
        await Impuesto.deleteMany();
    }

    const IMPUESTO = [{
        categoria: "IGV",
        porcentaje: "18",
        multiplicador: 0.18,
        descripcion: "Estandar",
    }];
    const impuesto = await Impuesto.create(IMPUESTO);
    if (!impuesto) {
        console.log('No se pudo registrar el impuesto');
        return false;
    }

    return impuesto[0]._id;
}

const genProducto = async(familiaArr, impuestoId)=>{
    const countProducto = await Producto.find();
    if (countProducto.length > 0) {
        await Producto.deleteMany();
    }

    const PRODUCTO = [
        {fam_id:familiaArr.filter(c=> c.codigo == '001001001'?? c._id)[0]._id, marca:"Samsung", color:"negro", unidad:"pulgadas", valor:"21", modelo:"SNMLD21", precio:"220", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001001'?? c._id)[0]._id, marca:"Samsung", color:"negro", unidad:"pulgadas", valor:"32", modelo:"SNMLD32", precio:"360", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001002'?? c._id)[0]._id, marca:"Samsung", color:"negro", unidad:"pulgadas", valor:"32", modelo:"SNMPLS32", precio:"310", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001002'?? c._id)[0]._id, marca:"LG", color:"negro", unidad:"pulgadas", valor:"32", modelo:"LGPLS32", precio:"330", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001003'?? c._id)[0]._id, marca:"AOC", color:"negro", unidad:"pulgadas", valor:"32", modelo:"AOC32", precio:"330", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001004'?? c._id)[0]._id, marca:"LG", color:"negro", unidad:"pulgadas", valor:"49", modelo:"LGOLP49", precio:"1600", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001004'?? c._id)[0]._id, marca:"LG", color:"negro", unidad:"pulgadas", valor:"55", modelo:"LGOLP55", precio:"2500", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001004'?? c._id)[0]._id, marca:"LG", color:"negro", unidad:"pulgadas", valor:"65", modelo:"LGOLP65", precio:"3500", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001004'?? c._id)[0]._id, marca:"Samsung", color:"negro", unidad:"pulgadas", valor:"65", modelo:"SMNOLP65", precio:"3400", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001001004'?? c._id)[0]._id, marca:"Samsung", color:"negro", unidad:"pulgadas", valor:"55", modelo:"SMNOLP55", precio:"2100", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001002001'?? c._id)[0]._id, marca:"Samsung", color:"azul", unidad:"año", valor:"2020", modelo:"Samsung j7", precio:"600", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001002001'?? c._id)[0]._id, marca:"Samsung", color:"blanco", unidad:"año", valor:"2022", modelo:"Samsung galaxi S22", precio:"2800", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001002002'?? c._id)[0]._id, marca:"ZTE", color:"blanco", unidad:"año", valor:"2021", modelo:"ZTE", precio:"70", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '001002002'?? c._id)[0]._id, marca:"ZTE", color:"blanco", unidad:"año", valor:"2022", modelo:"ZTE", precio:"90", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '002001003'?? c._id)[0]._id, marca:"BOSCH", color:"negro", unidad:"hornillas", valor:"4", modelo:"PKF675FP1E", precio:"1400", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '002001004'?? c._id)[0]._id, marca:"Nationalizer", color:"negro", unidad:"hornillas", valor:"1", modelo:"2167", precio:"199", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '002002001'?? c._id)[0]._id, marca:"LG", color:"blanco", unidad:"litros", valor:"374", modelo:"GT39SGP", precio:"2699", imp_id: impuestoId, stock: 10 },
        {fam_id:familiaArr.filter(c=> c.codigo == '002002001'?? c._id)[0]._id, marca:"Mabe", color:"negro", unidad:"litros", valor:"300", modelo:"RMA310FZPC", precio:"1899", imp_id: impuestoId, stock: 10 },
    ]
    const producto = await Producto.create(PRODUCTO);
    if (!producto) {
        console.log('No se pudo registrar los productos');
        return false;
    }

    return true;
}

const genUsuario = async () => {
    const countUsuario = await Usuario.find();
    if (countUsuario.length > 0) {
        return;
    }
    const USUARIO = {
        username: "manager",
        password:
            "$2a$10$bWiqdw6DM48iZAG9s2ciquystGzkBukeUAEqJb5jsHbau7uH0MQT2",
        email: "email@smalltemp.ok",
        name: "nombre user",
        role: "ADMIN_ROLE",
    };

    const result = await Usuario.create(USUARIO);
    if (!result) {
        console.log("No se pudo registrar los Proveedores");
    }
};

module.exports = {genClientData, genProveedorData, genFamiliaProductoData, genUsuario}