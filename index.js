const express = require("express")
const app = express();
const aws = require("aws-sdk")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json({extended:false}));
app.set("view engine","ejs")
app.set("views","./views")
//config
const region = "ap-southeast-1";
const accessKeyId = "";
const secretAccessKey = "";
app.listen(5000,(err)=>{
    if(err)
        console.log("Loi: ",err);
    else
        console.log("server runing port 5000");
});

const dynamoDB = new aws.DynamoDB.DocumentClient({
    region: region,
    accessKeyId : accessKeyId,
    secretAccessKey : secretAccessKey
})
//get danh sach san pham
app.get("/",(req,res)=>{
    const paramsDanhSachSanPham = {
        TableName : "TuiSach",
    };
    dynamoDB.scan(paramsDanhSachSanPham,(error,data)=>{
        if(error)
            console.log(JSON.stringify(error,null,2));
        else 
            res.render("index",{
                tuiSach : data.Items
            });
    });
});


// delete San pham
app.post("deleteSanPham",(req,res)=>{
    const maSanPham = req.body.maSanPham;
    const paramsDeleteSanPham= {
        TableName : "TuiSach",
        Key : {
            "maSanPham" : maSanPham,
        },
    };
    dynamoDB.delete(paramsDeleteSanPham,(error,data)=>{
        if(error)
            console.log(error)
        else  
            res.redirect("/");
    });
});

// render form update sau khi xoa
app.post("/updateForm",(req,res)=>{
    const {maSanPham,tenSanPham,soLuong} = req.body;
    console.log(maSanPham)
    const tuiSach = {
        maSanPham : maSanPham,
        tenSanPham : tenSanPham,
        soLuong : soLuong,   
    };
    res.render("formUpdate",{
        tuiSach : tuiSach
    });
});
