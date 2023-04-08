const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid')

const app = express()

app.use(bodyParser.json())

let students = [
    {
        id: 1,
        name: 'Jessica Drake',
        classes: {
          biology: 95,
          algebra: 92
        }
      },
      {
        id: 2,
        name: 'Ben Cohen',
        classes: {
          biology: 95,
          algebra: 92
        }
      },
      {
        id: 3,
        name: 'Lisa Downing',
        classes: {
          biology: 95,
          algebra: 92
        }
      }
]

// Get list of all students
app.get('/students', (res, req) => {
    res.json(students)
})

//Get the data about a single student, by name
app.get('/students/:name', (res,req) => {
    res.json(students.find((student) => {
        return student.name === req.params.name
    }))
})

//Adds data for a new student to the list of students
app.post('/students', (res,req) => {
    let newStudent = req.body

    if(!newStudent.name) {
        const message = 'Missing name in request body'
        res.status(400).send(message)
    } else {
        newStudent.id = uuid.v4()
        students.push(newStudent)
        res.status(201).send(newStudent)
    }
})

//Deletes a student from the list by ID
app.delete('/students/:id', (res,req) => {
    let student = students.find((student) => {
        return student.id === req.params.id
    })
    if (student) {
        students = students.filter((obj) => {return obj.id !== req.params.id})
        res.status(201).send('Student' + req.params.id + 'was deleted.')
    }
})

//Update the grade of a student by name / class name
app.put('/students/:name/:class/:grade', (res,req) => {
    let student = student.find((student) => {
        return student.name === req.params.name
    })

    if(student) {
        student.class[req.params.class] = parseInt(req.params.grade)
        res.status(201).send('Student' + req.params.name + 'was assigned a grade of ' + req.params.grade + 'in ' + req.param.class)
    } else {
        res.status(404).send('Student with the name ' + req.params.name + 'was not found')
    }
})

//Get the Gpa of a student

app.get('/students/:name/gpa', (res,req) => {
    let student = students.find((student) => {
        return student.name === req.params.name
    })

    if (student) {
        let classesGrades = Object.values(student.classes)
        //object.values() filters out obj's keys and keep the values that are returned as a new array
        let sumsOfGrades = 0
        classesGrades.forEach(grade => {
            sumsOfGrades = sumsOfGrades + grade
        })

        let gpa = sumsOfGrades / classesGrades.length
        console.log(sumsOfGrades)
        console.log(sumsOfGrades)
        console.log(gpa)
        res.status(201).send('' + gpa)
    } else {
        res.status(404).send('Student with the name ' + req.prams.name + 'was not found.')
    }
})

app.listed(8090, () => {
    console.log('app is running on port 8090')
})