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

//Criar estudante
app.post("/student", async (req: Request, res: Response) => {
   try {

      const { name, email, birth_date, class_id } = req.body

      if (!name || !email || !birth_date || !class_id) {
         throw new Error("Missing information, you have to insert: name, email, birth_date and class_id")
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

//Criar Professor
app.post("/teacher", async (req: Request, res: Response) => {
   try {

      const { name, email, birth_date, class_id } = req.body

      if (!name || !email || !birth_date || !class_id) {
         throw new Error("Missing information, you have to insert: name, email, birth_date and class_id")
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

//Criar turma
app.post("/class", async (req: Request, res: Response) => {
   try {
      const { name, initial_date, finish_date, module } = req.body

      if (!name || !initial_date || !finish_date) {
         throw new Error("Missing information, you have to insert: name, initial_date and finish_date")
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

//Buscar idade de estudante pelo ID
app.get("/age", async (req: Request, res: Response) => {
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
      const currentYear: number = d.getFullYear()
      const currentMonth: number = d.getMonth() + 1
      const currentDay: number = d.getDate()

      let age: number = currentYear - yearBirth

      if (currentMonth < monthBirth || currentMonth === monthBirth && currentDay < dayBirth) {
         age--
      }
      res.send({ age })
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Criar Hobbie
app.post("/hobbie", async (req: Request, res: Response) => {
   try {
      const name = req.body.name
      const result = await connection.raw(`
      INSERT INTO Hobbies (name)
      VALUES ("${name}");
      `)
      res.send("Hobbie created!")
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Adicionar hobbia a um estudante
app.put("/addHobbiesToStudent", async (req: Request, res: Response) => {
   try {
      const studentId = req.body.student_id
      const hobbieId = req.body.hobbie_id
      const result = await connection.raw(`
      INSERT INTO Student_Hobbies (student_id, hobbie_id)
      VALUES (${studentId}, ${hobbieId})
      `)
      res.send("Hobbie was connected to this student")
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Criar especialidade
app.post("/specialty", async (req: Request, res: Response) => {
   try {
      const name = req.body.name

      if (name !== "React" && name !== "Redux" && name !== "CSS" && name !== "Typescript" && name !== "Testes" && name !== "Programação Orientada a Objetos" && name !== "Backend") {
         throw new Error("You must specify a valid specialty ( React, Redux, CSS, Testes, Typescript, Programação Orientada a Objetos or Backend)")
      }

      const result = await connection.raw(`
      INSERT INTO Specialty (name)
      VALUES ("${name}");
      `)
      res.send("Specialty created!")
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Adicionar especialidade a um professor
app.put("/addSpecialtyToTeacher", async (req: Request, res: Response) => {
   try {
      const specialtyId = req.body.specialty_id
      const teacherId = req.body.teacher_id
      const result = await connection.raw(`
         INSERT INTO Teacher_Specialties (teacher_id, specialty_id)
         VALUES (${teacherId}, ${specialtyId})
      `)
      res.send("Specialty was connected to this teacher")
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Buscar estudantes de uma turma
app.get("/studentByClass", async (req: Request, res: Response) => {
   try {
      const className = req.query.name

      if (!className) {
         throw new Error("You must specify a class")
      }

      const result = await connection.raw(`
      SELECT Student.name AS "Student", Class.name AS "Class" FROM Student 
      JOIN Class ON Student.class_id = Class.id
      WHERE Class.name = "${className}"
   `)

   const student = result[0]
   
   if(!student.length){
      throw new Error("No students found")
   }

      res.status(200).send(student)
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Buscar professores por turma
app.get("/teacherByClass", async (req: Request, res: Response) => {
   try {
      const className = req.query.name

      if (!className) {
         throw new Error("You must specify a class")
      }

      const result = await connection.raw(`
      SELECT Teacher.name AS "Teacher", Class.name AS "Class" FROM Teacher 
      JOIN Class ON Teacher.class_id = Class.id
      WHERE Class.name = "${className}"
   `)

   const teacher = result[0]

   if(!teacher.length){
      throw new Error("No teachers found")
   }
   res.status(200).send(teacher)
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Estudantes com mesmo hobbie
app.get("/studentByHobbie", async (req: Request, res: Response) => {
   try {
      const hobbie = req.query.name

      if (!hobbie) {
         throw new Error("You must specify a hobbie")
      }

      const result = await connection.raw(`
      SELECT Student.name AS Student, Hobbies.name AS Hobbie FROM Student_Hobbies
      JOIN Student ON Student.id = student_id
      JOIN Hobbies ON Hobbies.id = hobbie_id
      WHERE Hobbies.name = "${hobbie}";
   `)

   const students = result[0]

   if(!students.length){
      throw new Error("No students found")
   }
   res.status(200).send(students)
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})


// Remover estudante de turma
app.put("/removeStudentFromClass", async(req: Request, res: Response) => {
   try {
      const name = req.body.name
      const result = await connection.raw(`
      UPDATE Student SET class_id = null WHERE name = "${name}"
      `)
      res.send("Student removed from this class")
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Remover Estudante
app.put("/removeStudent", async(req: Request, res: Response) => {
   try {
      const id = req.body.id

      const result = await connection.raw(`
      DELETE FROM Student_Hobbies WHERE student_id = ${id};
      `)

      const secondResult = await connection.raw(`
      DELETE FROM Student WHERE id = ${id};
      `)

      res.send("Student removed")
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})


// Remover Professor de turma
app.put("/removeTeacherFromClass", async(req: Request, res: Response) => {
   try {
      const name = req.body.name
      const result = await connection.raw(`
      UPDATE Teacher SET class_id = null WHERE name = "${name}"
      `)
      res.send("Teacher removed from this class")
   } catch (error) {
      res.status(400).send({
         message: error.message
      })
   }
})

//Mudar turma de módulo
app.put("/changeModule", async(req: Request, res: Response) => {
   try {
      const id = req.query.id
      const newModule = req.body.newModule
      if(newModule !== "0" && newModule !== "1" && newModule !== "2" && newModule !== "3" && newModule !== "4" && newModule !== "5" && newModule !== "6" && newModule !== "7"){
         throw new Error("You must specify a valid value of module (1,2,3,4,5,6 or 7)")
      }
      const result = await connection.raw(`
      UPDATE Class SET module = "${newModule}" WHERE id = ${id}
      `)
      res.send("Module changed")
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