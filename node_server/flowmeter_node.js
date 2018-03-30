var express = require("express")
var bodyParser = require('body-parser')
var moment = require("moment")
const nodemailer = require('nodemailer');
var EventEmitter = require('events').EventEmitter;
// console.log("------------------",nodemailer)
var app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.listen(3000, () => {
    console.log("服务器在3000端口监听")
})
// 解决跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1') // if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    // else 
    next();
});
var mysql = require("mysql")

function creatConnection() {
    return mysql.createConnection({
        // host: "10.0.25.4",
        host: "rdspalmapprod.mysql.rds.aliyuncs.com",
        // user: "root",
        user: "flowmeter",
        password: "Palmap+2017",
        database: "flowmeter",
        port:"3306"
    })
}
// 创建状态记录表--------------------------------------------------
function creatState(connection) {
    var totalsql = `SELECT name FROM ProjectManagement `
    connection.query(totalsql, (err, rows) => {
        // console.log("6666666666", rows instanceof Array, rows)
        if (err) {
            console.log(err)
            return
        }
        var namelist = []
        if (rows.length != 0) {
            for (let i = 0; i < rows.length; i++) {
                namelist.push(rows[i].name)
                var listsql = `
        CREATE TABLE IF NOT EXISTS ${rows[i].name}(
        code TINYINT NOT NULL, 
        datetime DATETIME(6) NOT NULL)
        ENGINE=InnoDB DEFAULT CHARSET=utf8;
`
                // var listsql2 = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "pls_project"`
                // console.log(listsql2)
                connection.query(listsql, (err, table) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                })

            }
        } else {
            return
        }
    })
}
// 获取状态
function getCode(connection, cb) {
    const sql = `select * from ProjectManagement`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        const res = [];
        for (let i = 0; i < result.length; i++) {
            const {
                name,
                received_client_count,
                timestamp
            } = result[i];

            var code1, code2
            code1 = received_client_count != 0 ? 0 : 1
            code2 = new Date().getTime() - timestamp < 360000 ? code1 : 2
            res.push({
                name,
                code: code2
            });
        }
        cb(res);
    });
}
// 创建状态
function updateCode(connection) {

    getCode(connection, (result) => {
        for (let i = 0; i < result.length; i++) {
            const {
                name,
                code
            } = result[i];
            const time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
            const querySql = `select * from ${name}`;
            connection.query(querySql, (err, queryResult) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (queryResult.length === 0 || +queryResult[queryResult.length - 1].code !== +code) {
                    console.log("this time : ", time)
                    const insertSql = `insert into ${name} (code,datetime) values(${code}, '${time}')`;
                    connection.query(insertSql, (err, insertResult) => {
                        if (err) {
                            console.error("发生错误了", err);
                            return;
                        } else {
                            console.log("insertResult", insertResult)
                            return
                        }
                    })
                }
            });
        }
    });
}
// 查询记录
app.post("/:num/:current_page", function(req, res) {
    var connection = creatConnection()
    connection.connect()
    console.log("数据库打开")
    creatState(connection)
    updateCode(connection)
    var dataArray = []
    var linkStatus = req.body.linkStatus
    switch (linkStatus) {
        case "全部":
            dataArray.push("(received_client_count>=0 or received_client_count >=0)")
            break;
        case "异常":
            dataArray.push("(received_client_count=0 or send_client_count=0)")
            break;
        case "正常":
            dataArray.push("received_client_count>0 and send_client_count>0")
            break;
    }
    const keys = Object.keys(req.body.searchData)
    for (let i = 0; i < keys.length; i++) {
        dataArray.push(`${keys[i]} ='${req.body.searchData[keys[i]]}'`);
    }
    const { num, current_page } = req.params
    const sqlTotalNum = `select count(*) as num from ProjectManagement where ${dataArray.join(' and ')}`;
    const sql = `select * from ProjectManagement  where ${dataArray.join(' and ')} ORDER BY received_port ASC  limit  ${num}  offset  ${ num * (current_page - 1)} `;
    connection.query(sqlTotalNum, function(err, rows) {
        if (err) {
            console.log(err)
            connection.end();
            return
        }
        connection.query(sql, function(err, result) {
            // console.log("sql ",sql)
            // console.log("result",result)
            if (err) {
                console.log("error", err)
                connection.end();
                return
            }
            var data = {
                count: rows[0].num,
                data: result
            }
            res.send(data)
            connection.end();
            console.log("数据库已经关闭")
        })
    })
})

app.get("/linkstatus", (req, res) => {
    var connection = creatConnection()
    connection.connect()
    console.log("数据库打开")
    var dbName = req.query.name;
    var mysqlStatus = `select * from ${dbName}  `
    connection.query(mysqlStatus, function(err, result) {
        if (err) {
            console.log("errorLinksStatus", err)
            connection.end();
            console.log("linkstatus,数据库关闭")
            return
        } else {
            var result1 = result.reverse()
            var result = result1.slice(0, 16);
            console.log("pppp", result)
            for (var i = 0; i < result.length; i++) {
                result[i].datetime = moment(result[i].datetime).format('YYYY-MM-DD hh:mm:ss');
            }
            res.send(result);
        }


    })
})
// 按天查询
app.get("/daylog/:id", (req, res) => {
    var connection = creatConnection()
    connection.connect()
    console.log("数据库打开")
    const time = moment(req.query.date).format('YYYY-MM-DD');
    const logSql = `select * from ${req.params.id}_ClientsCountPerHour where date_format(date,'%Y-%m-%d')='${time}' order by date`;
    connection.query(logSql, (err, result) => {
        if (err) {
            console.log(err)
            connection.end()
            console.log("数据库关闭")
            return
        }
        res.send(result)
        connection.end()
        console.log("数据库关闭")
    })
})
// 按月查询
app.get("/monthlog/:id", (req, res) => {
    var connection = creatConnection()
    connection.connect()
    console.log("数据库打开")
    const time = moment(req.query.date).format('YYYY-MM');
    const logSql = `select * from ${req.params.id}_ClientsCountPerDay where date_format(date,'%Y-%m')='${time}' order by date`;
    connection.query(logSql, (err, result) => {
        if (err) {
            console.log(err)
            connection.end()
            console.log("数据库关闭")
            return
        }
        res.send(result)
        connection.end()
        console.log("数据库关闭")
    })
})
// 错误次数查询
app.get("/errorlog/:id", (req, res) => {
    var event = new EventEmitter();
    var connection = creatConnection()
    connection.connect()
    console.log("数据库打开")
    const time = moment(req.query.date).format('YYYY-MM')
    var year = new Date(req.query.date).getFullYear()
    var month = new Date(req.query.date).getMonth() + 1
    var dateNum = new Date(year, month, 0).getDate()
    console.log("dateNum", dateNum)
    var dbName = req.params.id;
    var errorArray = new Array(); //先声明一维 
    for (var a = 0; a < dateNum; a++) { //一维长度为2
        errorArray[a] = new Array(); //再声明二维 
        for (var b = 0; b < 2; b++) { //二维长度为3
            errorArray[a][0] = 0; // 赋值，每个数组元素的值为i+j
            errorArray[a][1] = 0; // 赋值，每个数组元素的值为i+j
        }
    }
    console.log("数组长度", errorArray.length)
    var logSql = `select code, date(datetime) as date, count(1) as count from ${dbName}
                    where date_format(datetime,'%Y-%m')='${time}' and code > 0
                    GROUP BY code, date 
                    ORDER BY date, code`
    connection.query(logSql, (err, result) => {
        if (err) {
            console.log(err)
            res.send("请求错误")
            connection.end()
            console.log("数据库关闭")
            return
        }
        if (result.length != 0) {
            for (let i = 0; i < result.length; i++) {
                var j = new Date(result[i].date).getDate()
                if (result[i].code == 1) {
                    errorArray[j - 1][0] = result[i].count
                }
                if (result[i].code == 2) {
                    errorArray[j - 1][1] = result[i].count
                }
                if (i == result.length - 1) {
                    res.send(errorArray)
                    connection.end()
                    console.log("数据库关闭")
                }
            }
        } else {
            res.send(errorArray)
            connection.end()
            console.log("数据库关闭")
        }

    })

})
// 发送邮件功能--------------------------------------------------------
function setSendemail() {
    var connection = creatConnection()
    connection.connect()
    console.log("数据库打开")
    var totalsql = `SELECT name FROM ProjectManagement `
    connection.query(totalsql, (err, result) => {
        if (err) {
            console.log(err)
            connection.end()
            console.log("数据库关闭")
            return;
        }
        for (let i = 0; i < result.length; i++) {
            // console.log(result[i])
            var searchStatus = `SELECT * FROM ${result[i].name}`
            // console.log("searchStatus", searchStatus)
            connection.query(searchStatus, (err, rows) => {
                if (err) {
                    console.log(err)
                    connection.end()
                    console.log("数据库关闭")
                    return;
                }else{
                // if (rows[rows.length - 1].code == 1) {
                //     var message = result[i].name + "项目定位系统" + "数据发生异常" + rows[rows.length - 1].datetime
                //     senEmail(message)
                // }
                if (rows[rows.length - 1].code == 2) {
                    var message = result[i].name + "项目定位系统" + "程序发生异常" + rows[rows.length - 1].datetime
                    senEmail(message)
                    connection.end()
                    console.log("数据库关闭")
                }
                }         
            })
        }
    })
}

function senEmail(message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mxhichina.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'zhixiao.li@palmaplus.com',
            pass: '29xiaoTuju@('
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"iPalmap" <zhixiao.li@palmaplus.com>', // sender address
        to: `zhixiao.li@palmaplus.com,yunyang.zhao@palmaplus.com,hongping.chen@palmaplus.com`, // list of receivers
        subject: '定位数据异常', // Subject line
        text: message // plain text body
        // html: '<h1>定位发生异常</h1>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("---------", error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response,new Date());
    });
}

setInterval(setSendemail,1000*60*6)