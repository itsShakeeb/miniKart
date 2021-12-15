const express = require('express')
const connectDB = require('./config/db')

const app = express()
connectDB();

//Middleware 
app.use(express.json({ extended: true }))
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Server running' })
})
app.use('/v1/api/', require('./routes/api/AdminUser'))
app.use('/v1/api/', require('./routes/api/AdminLogin'))



//listening database

const PORT = 5001;
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
