<template>
  <div class="container mt-4 main" id="app">
  <div :class="dataarray.PageTemplate">

  <button class="btn btn-success btn-set  offset-1 " @click="loadingdata">Обработать данные</button>

  <title>{{dataarray.PageTitle}}</title>
    <h1>{{dataarray.H1Content}}</h1>
    <h2>{{dataarray.TableName}}</h2>

    <table class="table table-bordered mt-4">
      <thead class="thead-light">
        <tr>
          <th scope="row" v-for="item of this.titlearray" :key="item" >{{item}}</th>
          <th v-if="isVisible" width="150">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataarray.Data" :key="index" >
          <td v-for="(data, indexx) in item" :key="indexx" >
            <span v-if="editIndex !== index">{{ data }}</span>
            <span v-if="editIndex === index">
              <input class="form-control form-control-sm" :type="dataarray.ColsTypes[indexx]" v-model="dataarray.Data[index][indexx]">
            </span>
          </td>
          <td>  
            <span v-if="editIndex !== index">
              <button @click="edit(item, index)" class="btn btn-sm btn-outline-secondary mr-2 btn-act">Edit</button>
              <button @click="remove(item, index)" class="btn btn-sm btn-outline-secondary mr-2 btn-act">Remove</button>
            </span>
            <span v-else>
              <button class="btn btn-sm btn-outline-secondary mr-2 btn-act" @click="cancel(item)">Cancel</button>
              <button class="btn btn-sm btn-outline-secondary mr-2 btn-act" @click="save()">Save</button>
            </span>
          </td>
          </tr>
      </tbody>
    </table>

    <div class="col-3 offset-5 text-right my-3">
      <button v-if="isVisible" v-show="!editIndex" @click="add" class="btn btn-sm btn-secondary btn-set">добавить запись</button>
    </div>

     <div class="col-3 offset-5 text-right my-3">
      <button v-if="isVisiblePost" @click="savedata"   class="btn btn-sm btn-primary btn-set">Применить изменения</button>
    </div>

  </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      editIndex: null,
      originalData: null,
      isVisible: false,
      isVisiblePost: false,
      isShow: false,
      dataarray: [],
      titlearray: [],
      showarray:[],
      orderarray: [],
      arraysort: [],
      bufferrow:[],
    }
  },
  methods: {
    loadingdata: async function () {
        this.isVisible = true,
        await this.$http.get('http://localhost:3000/Data')
          .then(response => {
            return response.json()
          })
          .then(dataarray =>{

            // Записываем данные в массив
            this.dataarray = dataarray
            this.titlearray = []
            this.orderarray =  this.dataarray.ColsOrder
            this.showarray = this.dataarray.ColsShow
           

            //Перебераем объекты по ключам если Show == 0 то удаляем его из объекта
            for (let key in this.showarray) {
              let value = this.showarray[key]
              if(value == 0){
                delete this.dataarray.ColsTitles[key]
                for (let i = 0; i < this.dataarray.Data.length; i++) { 
                delete this.dataarray.Data[i][key]
                this.isShow= false
                }
              }
            }
            
            //Сортируем мвссив по индексу из ColsOrder
               let newarray = []
               let sortedarray = []
             for (let key in this.orderarray) {
               let value = this.orderarray[key]
               newarray[value] = key
             }

            //Сортировка titleArray
            for (let key in dataarray.ColsTitles){
                 let value = dataarray.ColsTitles[key]
              for(let i = 0;i < newarray.length;i++){

                  if(newarray[i] == key && value != null){
                    sortedarray[i] = (value)
                  }
              }   
             }
        

              for (let key in sortedarray){
                let value = sortedarray[key]
                this.titlearray.push(value)
              }
            
            let newdataarray = []

            //Сортировка Data
          let arrayBig = []
          let bigBig = []
           var object_length = Object.keys(dataarray.Data).length;
            for (let key in newarray){
            for(let i = 0;i < dataarray.Data.length;i++){
              for(let keys in dataarray.Data[i]){
              let value = newarray[key]
                 let item = dataarray.Data[i][keys]
                 if(value == keys ){
                   
                  arrayBig.push(item)
                 }
                  if(arrayBig.length == object_length ){
                bigBig.push(arrayBig)
                arrayBig = []
                }
                 
              }
               }
            }
             let allarraydata = []
            for(let i = 0; i<object_length;i++){
              allarraydata.push([])
            }

            for(let i = 0; i < bigBig.length;i++){
              for (let y = 0;y <bigBig[i].length;y++){
                allarraydata[y][i] = bigBig[i][y]
              }
            }
          
           
            let obj = new Object()
             for(let i = 0; i < allarraydata.length;i++){
              for(let y=0;y< newarray.length;y++){
                if(newarray[y] == undefined && y !=12){
                  y = y + 1
                obj[newarray[y]] = allarraydata[i][y - 1]
                }
                if(newarray[y] != undefined && y !=12){
                   obj[newarray[y]] = allarraydata[i][y-1]
             
                }
              if( y == 12){
                newdataarray.push(obj)
                obj = {}
                  }
               
                }

              }

             this.dataarray.Data = newdataarray

             for (let key in this.showarray) {
              let value = this.showarray[key]
              if(value == 0){
                let keywords  = key
                for(let i=0;i<newarray.length;i++){
                  if(newarray[i] == keywords){
                    newarray.splice(i, 1)
                  }
                }
              }
            }
            this.arraysort = newarray
           


          })
    },
    savedata(){
      const data = this.dataarray
      this.$http.post('http://localhost:3000/Data',data)
      // .then(response =>{
      //   console.log(response)
      // })
    },
    add() {
      this.originalData = null
      let obj = new Object()
      for(let i=0; i<this.arraysort.length; i++){
        if(i != 0){
        obj[this.arraysort[i]] = ''
        }
      }
      this.dataarray.Data.push(obj)
      this.editIndex = this.dataarray.Data.length - 1
    },
    edit(item, index) {
      this.originalData = Object.assign({}, item)
      this.editIndex = index
    },
    cancel(item) {
      this.editIndex = null
      if (!this.originalData) {
        this.dataarray.Data.splice(this.dataarray.Data.indexOf(item), 1)
        return
      }
      Object.assign(item, this.originalData)
      this.originalData = null
    },
    remove(item, index) {
      this.dataarray.Data.splice(index, 1)
      this.isVisiblePost = true
    },
    
    save() {
      this.originalData = null
      this.editIndex = null
      this.isVisiblePost = true
    },
  }
}
</script>

<style>
  input {
    text-align: center;
  }
  title{
  display:block;
  font-size: 40px;
  font-weight: 900;
}
.btn-set{
  width: 150px;
  height: 70px;
}
.btn-act{
  width: 70px;
  height: 30px;
  margin-top: 10px;
}
.main{
  text-align: center;
}
</style>