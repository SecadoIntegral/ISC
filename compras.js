/******************************************************
        CUADERNO DE COMPRAS
        INDUSTRIAS SAN CARLOS
******************************************************/


/******************************************************
        CONFIGURACIÓN GOOGLE SHEETS
******************************************************/


const URL_COMPRAS = 
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7YBui32JBbGTNLfR4FIRHWvu9xP-GJFaEisdpvOvAxVJLv0AVw6-9pOMAb44UVA/pub?gid=606362613&single=true&output=csv";



/******************************************************
        VARIABLES
******************************************************/


let compras = [];

let prioridadActual = "Alta";



const lista = document.getElementById("lista");

const tabs = document.querySelectorAll(".tab");

const pageTitle = document.getElementById("pageTitle");


const countAlta = document.getElementById("countAlta");

const countMedia = document.getElementById("countMedia");

const countBaja = document.getElementById("countBaja");


const template = document.getElementById("itemTemplate");

const emptyTemplate = document.getElementById("emptyTemplate");



const loader = document.getElementById("loader");

const errorBox = document.getElementById("error");

const reloadBtn = document.getElementById("reload");



/******************************************************
        CARGAR DATOS
******************************************************/


async function cargarCompras(){


    try{


        mostrarLoader(true);


        const respuesta = await fetch(URL_COMPRAS);


        const texto = await respuesta.text();



        compras = convertirCSV(texto);



        actualizarContadores();



        mostrarLista();



        mostrarLoader(false);



    }

    catch(error){


        console.error(error);


        mostrarLoader(false);


        errorBox.classList.remove("hidden");


    }


}



/******************************************************
        CONVERTIR CSV
******************************************************/


function convertirCSV(csv){



    const filas = csv
    .trim()
    .split("\n");



    const encabezados = separarCSV(filas[0]);



    return filas
    .slice(1)
    .map(fila=>{


        const datos = separarCSV(fila);



        let objeto = {};



        encabezados.forEach((columna,index)=>{


            objeto[columna.trim()] = 
            datos[index]?.trim() || "";



        });



        return objeto;



    });



}



/******************************************************
        SEPARADOR CSV
******************************************************/


function separarCSV(linea){



    let resultado=[];

    let actual="";

    let comillas=false;



    for(let i=0;i<linea.length;i++){


        let letra=linea[i];



        if(letra === '"'){


            comillas=!comillas;


        }


        else if(letra === "," && !comillas){


            resultado.push(actual);

            actual="";


        }


        else{


            actual+=letra;


        }


    }



    resultado.push(actual);



    return resultado;


}





/******************************************************
        MOSTRAR LISTA
******************************************************/


function mostrarLista(){



    lista.innerHTML="";



    const filtrados = compras.filter(item=>{


        return normalizar(item.Prioridad)
        ===
        normalizar(prioridadActual);



    });



    if(filtrados.length===0){


        mostrarVacio();


        return;


    }





    filtrados.forEach((item,index)=>{


        crearArticulo(item,index+1);


    });



    pageTitle.textContent =
    "Prioridad " + prioridadActual;



}





/******************************************************
        CREAR ARTICULO
******************************************************/


function crearArticulo(item,numero){



    const copia = template.content.cloneNode(true);



    copia.querySelector(".line-number")
    .textContent = numero;



    copia.querySelector(".item-icon")
    .textContent =
    obtenerIcono(item.Articulo);



    copia.querySelector(".item-name")
    .textContent =
    item.Articulo;



    copia.querySelector(".cantidad")
    .textContent =
    item.Cantidad;



    copia.querySelector(".unidad")
    .textContent =
    item.Unidad;



    const estado =
    copia.querySelector(".estado");



    estado.textContent =
    item.Estado;



    estado.classList.add(
        claseEstado(item.Estado)
    );



    lista.appendChild(copia);



}





/******************************************************
        ICONOS AUTOMÁTICOS
******************************************************/


function obtenerIcono(nombre){


    nombre =
    nombre.toLowerCase();



    if(nombre.includes("tornillo") ||
       nombre.includes("tuerca") ||
       nombre.includes("perno")){


        return "🔩";


    }



    if(nombre.includes("rodamiento") ||
       nombre.includes("motor") ||
       nombre.includes("engranaje")){


        return "⚙️";


    }



    if(nombre.includes("pintura") ||
       nombre.includes("aceite") ||
       nombre.includes("grasa")){


        return "🛢️";


    }



    if(nombre.includes("cable") ||
       nombre.includes("eléctrico")){


        return "🔌";


    }



    if(nombre.includes("tubo") ||
       nombre.includes("perfil") ||
       nombre.includes("acero")){


        return "🏗️";


    }



    return "📦";


}





/******************************************************
        ESTADOS
******************************************************/


function claseEstado(estado){


    estado =
    normalizar(estado);



    if(estado.includes("pendiente")){

        return "pendiente";

    }


    if(estado.includes("proceso")){

        return "proceso";

    }


    if(estado.includes("recibido")){

        return "recibido";

    }


    if(estado.includes("cancelado")){

        return "cancelado";

    }


    return "";

}





/******************************************************
        CONTADORES
******************************************************/


function actualizarContadores(){



    countAlta.textContent =
    compras.filter(x=>
    normalizar(x.Prioridad)==="alta")
    .length;



    countMedia.textContent =
    compras.filter(x=>
    normalizar(x.Prioridad)==="media")
    .length;



    countBaja.textContent =
    compras.filter(x=>
    normalizar(x.Prioridad)==="baja")
    .length;


}





/******************************************************
        CAMBIO DE PESTAÑA
******************************************************/


tabs.forEach(tab=>{


    tab.addEventListener("click",()=>{


        prioridadActual =
        tab.dataset.priority;



        tabs.forEach(t=>
        t.classList.remove("active"));



        tab.classList.add("active");



        mostrarLista();



    });



});






/******************************************************
        PAGINA VACÍA
******************************************************/


function mostrarVacio(){


    const vacio =
    emptyTemplate.content.cloneNode(true);



    lista.appendChild(vacio);



}




/******************************************************
        UTILIDADES
******************************************************/


function normalizar(texto){


    return texto
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"");


}





/******************************************************
        LOADER
******************************************************/


function mostrarLoader(valor){


    if(valor){

        loader.style.display="flex";

    }

    else{

        loader.style.display="none";

    }


}



/******************************************************
        REINTENTAR
******************************************************/


reloadBtn.addEventListener("click",()=>{


    errorBox.classList.add("hidden");


    cargarCompras();


});





/******************************************************
        INICIO
******************************************************/


cargarCompras();