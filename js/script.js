class User {
  constructor(id, email, first_name, last_name, avatar, id_color) {
    this.id = id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar = avatar;
    this.id_color = id_color;
  }

  set set_id_color(val) {
    this.id_color = val;
  }
}

class Color {
  constructor(id, name, year, color, pantone_value) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.color = color;
    this.pantone_value = pantone_value;
  }
}

const app = new Vue({
    el: "#app",
    data: {
      active_user_id: "",
      active_user_email: "",
      active_user_name: "",
      active_user_first_name: "",
      active_user_last_name: "",

      color_favorito: "background-color:#41B883;",
      ruta_avatar: "https://vuejs.org//images/logo.png",

      active_col_id: "",
      active_col_name: "",
      active_col_year: "",
      active_col_color: "",
      active_col_pantone_value: "",

      userList: [],
      colorList: [],
      indice:0,
    },

    //methods
    mounted: function () {
      this.activando_rest_request_usuarios(); //inicio comsumo de api user
      this.activando_rest_request_colores(); //inicio comsumo de api color
    },

    computed: {
      computed_asignar_avatar() {
        return this.ruta_avatar;
      },
      computed_color_favorito() {
        return this.color_favorito;
      }
    },

    methods: {
      primero: function(){
        this.indice=0;
        var primer_color = this.colorList[this.indice].color;
        this.color_favorito='background-color: '+primer_color+';';
        this.change_nuevo_color_favorito(this.colorList[this.indice].id);
      },
      anterior: function(){
          this.indice=this.active_col_id-1;
          this.indice=this.indice-1;
          if (this.indice >= 0) {
              var ant_color = this.colorList[this.indice].color;
              this.color_favorito='background-color: '+ant_color+';';
              this.change_nuevo_color_favorito(this.colorList[this.indice].id);
            }
      },
      siguiente: function(){
        this.indice=this.active_col_id-1;
        this.indice=this.indice+1;
        if (this.indice <= this.colorList.length-1) {
            var ant_color = this.colorList[this.indice].color;
            this.color_favorito='background-color: '+ant_color+';';
            this.change_nuevo_color_favorito(this.colorList[this.indice].id);
          }
      },
      ultimo: function(){
        this.indice=this.colorList.length-1;
        var ultimo_color = this.colorList[this.indice].color;
        this.color_favorito='background-color: '+ultimo_color+';';
        this.change_nuevo_color_favorito(this.colorList[this.indice].id);
      },

      change_ruta_avatar: function (id_usuario) {
        //buscando el usuario en el vector de colores
        usuario_buscado = this.userList.find(
          (x) => x.id === parseInt(id_usuario)
        );
        this.ruta_avatar = usuario_buscado.avatar;
        this.active_user_id = usuario_buscado.id;
        this.active_user_email = usuario_buscado.email;
        this.active_user_last_name = usuario_buscado.last_name;

        //buscando el color en el vector de colores
        color_buscado = this.colorList.find(
          (x) => x.id === parseInt(usuario_buscado.id_color)
        );
        this.color_favorito = "background-color:" + color_buscado.color + ";";

        this.active_col_id = color_buscado.id;
        this.active_col_name = color_buscado.name;
        this.active_col_year = color_buscado.year;
        this.active_col_color = color_buscado.color;
        this.active_col_pantone_value = color_buscado.pantone_value;

      },

      change_nuevo_color_favorito: function (id_col) {
        color_nuevo = this.colorList.find((x) => x.id === parseInt(id_col));

        this.active_col_id = color_nuevo.id;
        this.active_col_name = color_nuevo.name;
        this.active_col_year = color_nuevo.year;
        this.active_col_color = color_nuevo.color;
        this.active_col_pantone_value = color_nuevo.pantone_value;

        if (this.active_user_id) {
          var user_cambiado = this.userList.find(
            (x) => x.id === parseInt(this.active_user_id)
          );
          user_cambiado.set_id_color = id_col;
          this.color_favorito = "background-color:" + color_nuevo.color + ";";
        }
      },

      //INCIO DEL CONSUMO API REST
      rest_request_usuarios: async function () {
        var usuarios1 = [];
        var usuarios2 = [];
        await axios
          .get("https://reqres.in/api/users?page=1")
          .then((response) => {
            usuarios1 = response.data.data;
          })
          .catch(function (error) {
            alert(error);
          });

        await axios
          .get("https://reqres.in/api/users?page=2")
          .then((response) => {
            usuarios2 = response.data.data;
          })
          .catch(function (error) {
            alert(error);
          });

        usuarios1 = usuarios1.concat(usuarios2);

        this.userList = [];
        for (let i = 0; i < usuarios1.length; i++) {
          this.userList.push(
            new User(
              usuarios1[i].id,
              usuarios1[i].email,
              usuarios1[i].first_name,
              usuarios1[i].last_name,
              usuarios1[i].avatar,
              usuarios1[i].id
            )
          );
        }
      },
      activando_rest_request_usuarios: function () {
        (async () => {
          await this.rest_request_usuarios();
        })();
      },
      //FIN DEL CONSUMO API REST --> USUARIOS

      //INCIO DEL CONSUMO API REST --> COLORES
      rest_request_colores: async function () {
        var colores1 = [];
        var colores2 = [];
        await axios
          .get("https://reqres.in/api/unknow?page=1")
          .then((response) => {
            colores1 = response.data.data;
          })
          .catch(function (error) {
            alert(error);
          });

        await axios
          .get("https://reqres.in/api/unknow?page=2")
          .then((response) => {
            colores2 = response.data.data;
          })
          .catch(function (error) {
            alert(error);
          });

        colores1 = colores1.concat(colores2);

        this.colorList = [];
        for (let i = 0; i < colores1.length; i++) {
          this.colorList.push(
            new Color(
              colores1[i].id,
              colores1[i].name,
              colores1[i].year,
              colores1[i].color,
              colores1[i].pantone_value
            )
          );
        }
      },
      activando_rest_request_colores: function () {
        (async () => {
          await this.rest_request_colores();
        })();
      },
      //FIN CONSUMO REST COLORES
      
    },
});