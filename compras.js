const SUPABASE_URL = "https://fbdletfjoeaoepsbeobc.supabase.co";

const SUPABASE_KEY = "sb_publishable_3zWVTfsCkOGdHdSoRgobCg_HDHhmaWk";


const clienteSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// ======================================
// CONTROL DE ACCESO
// ======================================


const PASSWORD_ADMIN = "1234";


let modoAdmin = false;



function entrarInvitado(){

    modoAdmin = false;


    document
    .getElementById("loginBox")
    .style.display = "none";


    document
    .getElementById("btnAgregar")
    .style.display = "none";

    document
.getElementById("nuevaTarea")
.style.display = "none";

    cargarTareas();

}




function entrarAdmin(){


    const password =
    document.getElementById("passwordInput").value;



    if(password === PASSWORD_ADMIN){


        modoAdmin = true;


        document
        .getElementById("loginBox")
        .style.display = "none";


        cargarTareas();



    }else{


        document
        .getElementById("loginError")
        .textContent = "Contraseña incorrecta";


    }


}



document
.getElementById("btnAdmin")
.addEventListener(
    "click",
    entrarAdmin
);



document
.getElementById("btnInvitado")
.addEventListener(
    "click",
    entrarInvitado
);





// ======================================
// CARGAR TAREAS DESDE SUPABASE
// ======================================


async function cargarTareas(){


    const { data, error } = await clienteSupabase
        .from("tareas")
        .select("*");



    if(error){

        console.log(error);
        return;

    }



    const lista = document.getElementById("listaTareas");


    lista.innerHTML = "";



    data.forEach(tarea => {



        const elemento = document.createElement("li");



        // CHECKBOX

        const checkbox = document.createElement("input");


        checkbox.type = "checkbox";


        checkbox.checked = tarea.completada;



        checkbox.addEventListener(
            "change",
            () => cambiarEstado(tarea)
        );




        // BOTON EDITAR

        const botonEditar = document.createElement("button");


        botonEditar.textContent = "Editar";



        botonEditar.addEventListener(
            "click",
            () => editarTarea(tarea)
        );




        // BOTON ELIMINAR

        const botonEliminar = document.createElement("button");


        botonEliminar.textContent = "Eliminar";



        botonEliminar.addEventListener(
            "click",
            () => eliminarTarea(tarea)
        );





        // AGREGAR ELEMENTOS


        elemento.appendChild(checkbox);



        elemento.appendChild(
            document.createTextNode(
                tarea.tarea
            )
        );




        // SOLO ADMIN VE ESTOS BOTONES

        if(modoAdmin){


            elemento.appendChild(botonEditar);


            elemento.appendChild(botonEliminar);


        }



        lista.appendChild(elemento);



    });



}





// ======================================
// AGREGAR NUEVA TAREA
// ======================================


async function agregarTarea(){


    const input =
    document.getElementById("nuevaTarea");


    const texto = input.value;



    if(texto.trim() === ""){

        return;

    }



    const { error } = await clienteSupabase
        .from("tareas")
        .insert([
            {
                tarea:texto,
                completada:false
            }
        ]);



    if(error){

        console.log(error);
        return;

    }



    input.value = "";


    cargarTareas();


}



document
.getElementById("btnAgregar")
.addEventListener(
    "click",
    agregarTarea
);





// ======================================
// EDITAR TAREA
// ======================================


async function editarTarea(tarea){



    const nuevoTexto = prompt(
        "Editar tarea:",
        tarea.tarea
    );



    if(nuevoTexto === null){

        return;

    }



    const { error } = await clienteSupabase
        .from("tareas")
        .update({

            tarea:nuevoTexto

        })
        .eq(
            "id",
            tarea.id
        );



    if(error){

        console.log(error);
        return;

    }



    cargarTareas();



}





// ======================================
// CAMBIAR ESTADO
// ======================================


async function cambiarEstado(tarea){



    const { error } = await clienteSupabase
        .from("tareas")
        .update({

            completada: !tarea.completada

        })
        .eq(
            "id",
            tarea.id
        );



    if(error){

        console.log(error);
        return;

    }



    cargarTareas();



}





// ======================================
// ELIMINAR TAREA
// ======================================


async function eliminarTarea(tarea){



    const confirmar = confirm(
        "¿Deseas eliminar esta tarea?"
    );



    if(!confirmar){

        return;

    }



    const { error } = await clienteSupabase
        .from("tareas")
        .delete()
        .eq(
            "id",
            tarea.id
        );



    if(error){

        console.log(error);
        return;

    }



    cargarTareas();



}