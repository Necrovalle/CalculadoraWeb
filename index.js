//uso de express
//ejecutar npm init y seguir instrucciones
//ejecutar nmp i express y esperar a descarga

//******************************************* MODULOS IMPORTADOS
let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let mysql = require('mysql');

//*******************************************  ALTA DEL SERVER
app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/index.html');
});

app.use('/src', express.static('./src/'));

http.listen(3000, ()=>{
	console.log('Servidor Calculadora: Activo en el puerto 3000');
});

//******************************************* MYSQL
let dataBase = mysql.createConnection({
	host: 'localhost',
	user: 'admin',
	password: '1234'
});

//******************************************* SOCKET.IO
io.on('connection', (socket)=>{
	socket.on('info', (data1)=>{
		dataBase.query("USE calculadora",function(err, result, field){
			if (err) throw err;
		});
		dataBase.query("SELECT * FROM contador WHERE id=1;", function(err, result, field){
			if (err) throw err;
			let N = result[0].C;
			let Msg = 'Primera Web APP del curso, ejecutado: ' + N;
			io.to(socket.id).emit('info', Msg);
		});
	});
	
	socket.on('incrementar', function(data2){
		dataBase.query("USE calculadora",function(err, result, field){
			if (err) throw err;
		});
		dataBase.query("SELECT * FROM contador WHERE id=1;", function(err, result, field){
			let N = result[0].C;
			N++;
			dataBase.query("UPDATE contador SET C=" + N + " WHERE id=1;", function(err, result, field){
				if (err) throw err;
			});
		});
	});
	
});

//conteo de peticiones de info en DB