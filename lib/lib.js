export const CreateSeal = (id, company, name) => {
    var canvas = document.getElementById(id);
    var context = canvas.getContext('2d');

    // 绘制印章边框
    var width = canvas.width / 2;
    var height = canvas.height / 2;
    context.lineWidth = 3;
    context.strokeStyle = "#f00";
    context.beginPath();
    context.arc(width, height, 60, 0, Math.PI * 2);
    context.stroke();

    //画五角星
    create5star(context, width, height, 20, "#f00", 0);

    // 绘制印章名称
    context.font = '12px Helvetica';
    context.textBaseline = 'middle';//设置文本的垂直对齐方式
    context.textAlign = 'center'; //设置文本的水平对对齐方式
    context.lineWidth = 1;
    context.fillStyle = '#f00';
    context.fillText(name, width, height + 65);

    // 绘制印章单位
    context.translate(width, height);// 平移到此位置,
    context.font = '100 17px Helvetica'
    var count = company.length;// 字数
    var angle = 4 * Math.PI / (3 * (count - 1));// 字间角度
    var chars = company.split("");
    var c;
    for (var i = 0; i < count; i++) {
        c = chars[i];// 需要绘制的字符
        if (i == 0)
            context.rotate(5 * Math.PI / 6);
        else
            context.rotate(angle);
        context.save();
        context.translate(50, 0);// 平移到此位置,此时字和x轴垂直
        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴
        context.fillText(c, 0, 5);// 此点为字的中心点
        context.restore();
    }

    //绘制五角星
    /**
     * 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为radius,rotate=0时一个顶点在对称轴上
     * rotate:绕对称轴旋转rotate弧度
     */
    function create5star(context, sx, sy, radius, color, rotato) {
        context.save();
        context.fillStyle = color;
        context.translate(sx, sy);//移动坐标原点
        context.rotate(Math.PI + rotato);//旋转
        context.beginPath();//创建路径
        var x = Math.sin(0);
        var y = Math.cos(0);
        var dig = Math.PI / 5 * 4;
        for (var i = 0; i < 5; i++) {//画五角星的五条边
            var x = Math.sin(i * dig);
            var y = Math.cos(i * dig);
            context.lineTo(x * radius, y * radius);
        }
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
    }
}

export const GetQueryString = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}


export const BankcardLuhmCheck = (bankno) => {
    //银行卡号Luhm校验
    //Luhm校验规则：16位银行卡号（19位通用）:
    // 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
    // 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
    // 3.将加法和加上校验位能被 10 整除。
    if (bankno.length < 16 || bankno.length > 19) {
        return false;
    }
    var num = /^\d*$/;  //全数字
    if (!num.exec(bankno)) {
        return false;
    }
    //开头6位
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
        return false;
    }
    var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhm进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array();  //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9

    var arrOuShu = new Array();  //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) {//奇数位
            if (parseInt(newArr[j]) * 2 < 9)
                arrJiShu.push(parseInt(newArr[j]) * 2);
            else
                arrJiShu2.push(parseInt(newArr[j]) * 2);
        }
        else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
    //计算Luhm值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhm = 10 - k;
    if (lastNum == luhm) {
        return true;
    } else {
        return false;
    }
}

export const TransformTime = (timestamp,options={year:false,month:false,date:false}) => {
    var date = new Date(timestamp);
    let Y = date.getFullYear() ;
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = date.getDate();
    if(options.year){
        return Y;
    }else if(options.month){
        return M;
    }else if(options.date){
        return D;
    }else{
        return Y+'-'+M+'-'+D+' ';
    }
}
