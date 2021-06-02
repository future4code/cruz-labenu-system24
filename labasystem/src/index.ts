import express, { Express, Request, Response } from "express"
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

app.post("/student", async (req: Request, res: Response) => {
   try {

      const { name, email, birth_date, class_id } = req.body

      if(!name || !email || !birth_date || !class_id) {
         throw new Error ("Missing information, you have to insert: name, email, birth_date and class_id")
      }

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

app.post("/teacher", async (req: Request, res: Response) => {
   try {

      const { name, email, birth_date, class_id } = req.body

      if(!name || !email || !birth_date || !class_id) {
         throw new Error ("Missing information, you have to insert: name, email, birth_date and class_id")
      }

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

app.post("/class", async (req: Request, res: Response) => {
   try {
      const { name, initial_date, finish_date, module } = req.body

      if(!name || !initial_date || !finish_date) {
         throw new Error ("Missing information, you have to insert: name, initial_date and finish_date")
      }

      const initialDateArray = initial_date.split("/")
      const correctedinitialDate = `${initialDateArray[2]}/${initialDateArray[1]}/${initialDateArray[0]}`



      const finishDateArray = finish_date.split("/")
      const correctedFinishDate = `${finishDateArray[2]}/${finishDateArray[1]}/${finishDateArray[0]}`

      if (!module) {
         const result = await connection.raw(`
         INSERT INTO Class (name, initial_date, finish_date)
         VALUES(
         "${name}",
         "${correctedinitialDate}",
         "${correctedFinishDate}"
         );
         `) 
         res.send("Class created!")
      } 
      else {

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
      }
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