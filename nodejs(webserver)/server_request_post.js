function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}


var http = require('http');
var querystring = require('querystring');
/*var mysql = require('mysql');
var client = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      port: '3306',
      password: '정구1',
      database: 'mydb',
});

client.connect(function(err){
  if(err){
    console.error('error connecting'+err.stack);
    return;
  }
  connection.end();
})*/


var server = http.createServer(function(request,response){
  // 1. post로 전달된 데이터를 담을 변수를 선언
  var postdata = '';
  // 2. request객체에 on( ) 함수로 'data' 이벤트를 연결
  request.on('data', function (data) {
    // 3. data 이벤트가 발생할 때마다 callback을 통해 postdata 변수에 값을 저장
    postdata = postdata + data;
  });

  // 4. request객체에 on( ) 함수로 'end' 이벤트를 연결
  request.on('end', function () {
    // 5. end 이벤트가 발생하면(end는 한번만 발생한다) 3번에서 저장해둔 postdata 를 querystring 으로 객체화
    var parsedQuery = querystring.parse(postdata);
    // 6. 객체화된 데이터를 로그로 출력

    var json_data = JSON.stringify(parsedQuery);
    console.log(json_data);

    var time_data = json_data.substring(22,37);
    var wear_data = json_data.substring(59,64);
    var x_data = json_data.substring(82,88);
    var y_data = json_data.substring(107,113);
    var z_data = json_data.substring(132,138);

    console.log(time_data);
    console.log(wear_data);
    console.log(x_data);
    console.log(y_data);
    console.log(z_data);

    //7. 데이터베이스로 데이터 전송
    /*client.query(
        'INSERT INTO biobank_data (time, wear, X_axis, Y_axis, Z_axis) ' +
            'VALUES('+ time_data +', '+ wear_data +', '+ x_data +', '+ y_data +','+ z_data +')', function (err, rows, fields){
      console.log(err);}
      );*/

    // 8. 성공 HEADER 와 데이터를 담아서 클라이언트에 응답처리
    response.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
    response.end('data: '+ 'result');
  });

});

server.listen(8010, function(){
    console.log('Server is running...');
});