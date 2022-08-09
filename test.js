const AWS = require("aws-sdk");
const fs = require("fs");
const csv = require("csvtojson");
const parser = require("csv-parse");
const { isAsyncFunction } = require("util/types");
const { json } = require("express");

// AWS.config.region = "us-east-1";
// let csv_path = "./staff_api.csv";
// let apig = new AWS.APIGateway();
// let base_resource_id = "in5w82n4dj"
// let base_url="http://18.207.163.64:3000/api/courses"


// const apiConfigure = async (csv_path, base_resource_id) =>{
//    let json_arr = await csv().fromFile(csv_path)
//    let merged_arr = []
//    let lastMethod = ""
//    let lastPath = ""
//    let curObj = {}

//   json_arr.forEach( jsonObj =>{
//     var fields = jsonObj.path.split('/')
//     //console.log(fields)
//     const results = fields.filter(i =>{
//         return i !== ''
//     })
//     console.log(results)
//     console.log(results.length)

     
//   })
  
// //   console.log(json_arr)
// //   console.log(json_arr[0].path)
// }

// apiConfigure(csv_path, base_resource_id)
// const fruitBasket = {
//     apple:27,
//     grape:0,
//     pear:14
// }
// const fruitsToGet = ['apple','grape','pear']
// const getNumFruit=fruit =>{
//     return fruitBasket[fruit]
// }

// const forLoop = async _ =>{
//     console.log('Start')
//     for(let i =0;i<fruitsToGet.length;i++){
//         //Get num of each fruut
//         const fruit = fruitsToGet[i]
//         const numFruit = await getNumFruit(fruit)
//         console.log(i)
//         console.log(numFruit)
//     }
//     console.log('End')
// }

// forLoop()
// const getNumFruit = fruit => {
//     return fruitBasket[fruit]
//   }
  
//   const fruitBasket = {
//     apple: 27,
//     grape: 0,
//     pear: 14
//   }

// const fruitsToGet = ['apple', 'grape', 'pear']

// const forLoop = async _ => {
//   console.log('Start')

//   for (let index = 0; index < fruitsToGet.length; index++) {
//     const fruit = fruitsToGet[index]
//     const numFruit = await getNumFruit(fruit)
//     console.log(numFruit)
//   }

//   console.log('End')
// }

// forLoop()

async function getNewId(x,i){
    let idData = await promiseFn(x,i)
    x=idData
    i++
    console.log(numOfpath)
    console.log(i,'first')
     console.log('after x:',x)
    if(i<numOfpath){
        console.log(i,'second')
         getNewId(x,i)
        
    }	
}



 function promiseFn(x,i,time=2000){
    return new Promise((resolve)=>{
        setTimeout(() =>  {
            apig.createResource({
                    restApiId:'h0dx704i28',
                    parentId:x,
                    pathPart:nameOfPath[i]
                },function (err,data){
                    if(err){console.log(err),"this is error"}
                    else{
                        console.log(data)
                        //console.log(data.id)
                        
                        resolve(x=data.id)
                        
                    }
                
                })
        }, time);
    })}
    
     getNewId(x,i)



     // this line above is original didnt change anything