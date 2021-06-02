import express, {Express, Request, Response} from "express"
import knex from "knex";
import dotenv from "dotenv";
import cors from "cors"
import { AddressInfo } from "net"

dotenv.config()

const connection = knex({
    client: "mysql",
    connection: {
       host: process.env.DB_HOST,
       port: 3306,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME
    }
 })

 const app: Express = express()
 app.use(express.json())
 app.use(cors())

 app.post("/student", async(req: Request, res: Response) => {
   try {
     const {name, email, birth_date, class_id} = req.body
     const birthDateArray = birth_date.split("/")
     const correctedBirthDate = `${birthDateArray[2]}/${birthDateArray[1]}/${birthDateArray[0]}`

     const result = await connection.raw(`
      INSERT INTO Student (name, email, birth_date, class_id)
      VALUES (
         "${name}",
         "${email}",
         "${correctedBirthDate}",
         "${class_id}"
      );
   `)
         res.send("Student created!")
   } catch (error) {
      res.status(400).send({
         message: error.message
 })
   }
 })

 app.post("/teacher", async(req: Request, res: Response) => {
   try {
     const {name, email, birth_date, class_id} = req.body
     const birthDateArray = birth_date.split("/")
     const correctedBirthDate = `${birthDateArray[2]}/${birthDateArray[1]}/${birthDateArray[0]}`

     const result = await connection.raw(`
      INSERT INTO Teacher (name, email, birth_date, class_id)
      VALUES (
         "${name}",
         "${email}",
         "${correctedBirthDate}",
         "${class_id}"
      );
   `)
         res.send("Teacher created!")
   } catch (error) {   
      res.status(400).send({
         message: error.message
 })
   }
 })

 app.post("/class", async(req: Request, res:Response) => {
      try {
      const {name, initial_date, finish_date, module} = req.body

     const initialDateArray = initial_date.split("/")
     const correctedinitialDate = `${initialDateArray[2]}/${initialDateArray[1]}/${initialDateArray[0]}`

     const finishDateArray = finish_date.split("/")
     const correctedFinishDate = `${finishDateArray[2]}/${finishDateArray[1]}/${finishDateArray[0]}`

      const result = await connection.raw(`
      INSERT INTO Class (name, initial_date, finish_date, module)
      VALUES(
      "${name}",
      "${correctedinitialDate}",
      "${correctedFinishDate}",
      "${module}"
      );
      `)
      res.send("Class created!")
    } catch (error) {
      res.status(400).send({
         message: error.message
 })
    }
 })

 app.get("/age", async(req:Request, res: Response) => {
    try {       
       const id = req.query.id
      const result = await connection.raw(`
      SELECT birth_date FROM Student WHERE id = "${id}"
      `)

      const date = new Date(result[0][0].birth_date).toISOString()
      const onlyDateArray = date.split("T")
      const splittedDate = onlyDateArray[0].split("-")
      
      const yearBirth = Number(splittedDate[0])
      const monthBirth = Number(splittedDate[1])
      const dayBirth = Number(splittedDate[2])

      const d = new Date
      const currentYear:number = d.getFullYear() 
      const currentMonth:number = d.getMonth() + 1  
      const currentDay:number = d.getDate() 
      let age:number = currentYear - yearBirth
      if (currentMonth < monthBirth || currentMonth === monthBirth && currentDay < dayBirth){
         age --
      }

      res.send({age})
    } catch (error) {
         res.status(400).send({
         message: error.message
 })
    }
 })

const server = app.listen(process.env.PORT || 3003, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server is running in http://localhost:${address.port}`);
   } else {
      console.error(`Failure upon starting server.`);
   }
})