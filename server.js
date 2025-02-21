import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config';
 
const host = process.env.HOST
const password =  process.env.PASSWORD
const port = process.env.PORT
const database = process.env.DATABASE
 
const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
 
app.use(cors({ origin: 'http://localhost:5173' }));
 
const db = mysql.createConnection({
    host: host,
    user: "kharris",
    port: 3306,
    password:  "test",
    database: "kharris_tasks",
});
 
db.connect((err) => {
    if (err) {
        console.log("Error connecting DB", err);
    }else {
       console.log("Connected to DB")
    }
 
})
 
 
app.get('/tasks', (req, res) => {
    const query = "SELECT * FROM tasks;";
 
    db.query(query, (err, results) => {
        if(err){
            console.log(err);
            res.status(500).json({error: 'Error getting tasks'})
        }else {
            res.json(results);
        }
    })
});
 
app.post('/addTask', (req, res) => {
    console.log("Received request body:", req.body); // Debugging
 
  const { title } = req.body;
 
    const params = [req.body['title'], req.body['description'], req.body['is_completed']];
    console.log(req.body);
   
 
    const query = "INSERT INTO tasks (title, description, is_completed) VALUES(?, ?, ?)";
 
    db.query(query, params, (err, results) => {
        if (err) {
            console.log("adkhfaka",err);
            res.status(500).json({error: 'Error adding to DB'})
        } else {
            res.status(200).json(results)
        }
    })
})
 
app.put('/updateTask/:id', (req, res) => {
    const taskId = req.params.id;
 
    const { title, description, is_completed } = req.body;
 
    let query = "UPDATE tasks SET ";
 
    let values = [];
 
    if (title) {
        query += "title = ?, ";
        values.push(title);
    }
 
    if (description) {
        query += "description = ?, ";
        values.push(description);
      }
 
      if (is_completed !== undefined) {
        query += "is_completed = ?, ";
        values.push(is_completed);
      }
 
      query = query.slice(0, -2); // Remove last comma
  query += " WHERE id = ?";
  values.push(taskId);
 
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
 
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
 
    res.json({ message: "Task updated successfully" });
})
})
 
app.delete('/deleteTask/:id', (req, res) => {
    const taskId = req.params.id;
    console.log(taskId);
   
 
    const query = "DELETE FROM tasks WHERE id=?";
 
    db.query(query, [taskId], (err, result) => {
        if (err) {
            console.log("DB error", err);
            return res.status(500).json({ error: "Database error" });
        }
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
          }
 
          res.json({message: "Deleted Successfully"})
    })
})
 
 
app.listen(process.env.PORT, () => {
    console.log("server on 3000");
   
})