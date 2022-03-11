function GetQueryString(name)  
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null) return unescape(r[2]);
	return null;
}

var bid = GetQueryString('bid');
var database = firebase.database();

function readJSON(Snapshot){
    var tJson = {};
    Snapshot.forEach(function(keyvalues) {
        var childKey = keyvalues.key;
        var childData = keyvalues.val();
        tJson[keyvalues.key] = childData;
    });
    return tJson;
}
function comp(x,y){
    if(x['meal']<y['meal']) return -1;
    else if(x['meal']>y['meal']) return 1;
    else{
        if(x['last_name']<y['last_name']) return -1;
        else if(x['last_name']>y['last_name']) return 1;
        else {
            if(x['first_name']<y['first_name']) return -1;
            else if(x['first_name']>y['first_name']) return 1;
            else return 0;
        }
    }
}
function GenerateSeatingPlan(){
    var vips = new Array(), sponsors = new Array(), guests = new Array();
    var vipsize = document.getElementById('seat-number-vip').value;
    var sponsorsize = document.getElementById('seat-number-sponsor').value;
    var guestsize = document.getElementById('seat-number-guest').value;
    var vipcount = 0, sponsorcount = 0, guestcount = 0;
    var userJSON, updates;
    database.ref("users").orderByChild('banquet').equalTo(bid).once("value",function(snapshot){
        updates={};
        snapshot.forEach(function(userSnapshot){
            userJSON = readJSON(userSnapshot);
            switch(userJSON['type']){
                case 'vip':
                    vips.push(userJSON);
                    vipcount += 1;
                    userJSON['seat'] = 'VIP-'+Math.ceil(vipcount/vipsize);
                    break;
                case 'sponsor':
                    sponsors.push(userJSON);
                    sponsorcount += 1;
                    userJSON['seat'] = 'S-'+Math.ceil(sponsorcount/sponsorsize);
                    break;
                case 'guest':
                    guests.push(userJSON);
                    guestcount += 1;
                    userJSON['seat'] = 'G-'+Math.ceil(guestcount/guestsize);
                    break;
            }
            updates['/users/' + userSnapshot.key] = userJSON;
        });
        firebase.database().ref().update(updates);
        vips.sort(comp);
        sponsors.sort(comp);
        guests.sort(comp);
        //var rs=new Array();
        //rs['vip']=vips;
        //rs['sponsor']=sponsors;
        //rs['guest']=guests;
        Draw(vips,sponsors,guests);
    });
}

function EvenCompEllipse(context, x, y, a, b, color)
{
   var ox = 0.5 * a,
       oy = 0.6 * b;
   context.save();
   context.translate(x, y);
   context.beginPath();
   //从椭圆纵轴下端开始逆时针方向绘制
   context.moveTo(0, b); 
   context.bezierCurveTo(ox, b, a, oy, a, 0);
   context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
   context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
   context.bezierCurveTo(-a, oy, -ox, b, 0, b);
   context.closePath();
   context.fillStyle = color;
   context.fill();
   //context.stroke();
   context.restore();
}
//1240×1754 150ppi
//-80-270-270-270-270-80-   1080
//-77-400-400-400-77-   1754

function DrawTable(ctx,type,x,y,color){
    if(type=='circle'){
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x,y,65,0,2*Math.PI);//ball size;
        ctx.fill();
    }
    if(type=='oral'){
        EvenCompEllipse(ctx, x, y, 75, 55, color);
    }
    if(type=='rectangle'){
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x-70, y-50, 140, 100);
        ctx.fill();
    }
}
function Draw(vips,sponsors,guests){
    console.log(vips);
    console.log(sponsors);
    console.log(guests);
    
    var cvs = document.getElementById("seating-plan-img");
    cvs.style.display='block';
    var ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle="#000";
    ctx.textAlign='center';
    ctx.font = "30px Arial Bold";
    ctx.fillText("Seating Plan for Banquet #"+bid,630,60);
    
    var i, j, k, l, cx=80+135, cy=127+10, x, y;
    var table = new Array(), color = new Array(), namecolor = new Array();
    table['vip'] = document.getElementById('table-type-vip').value;
    table['sponsor'] = document.getElementById('table-type-sponsor').value;
    table['guest'] = document.getElementById('table-type-guest').value;
    var vipsize = document.getElementById('seat-number-vip').value;
    var sponsorsize = document.getElementById('seat-number-sponsor').value;
    var guestsize = document.getElementById('seat-number-guest').value;
    color['vip'] = "#FCB";
    color['sponsor'] = "#FF6";
    color['guest'] = "#CF9";
    namecolor['meal1'] = 'blue';
    namecolor['meal2'] = 'green';
    namecolor['meal3'] = 'red';
    namecolor['meal4'] = 'yellow';
    for(i=0,j=0,l=0;i<Math.ceil(vips.length/vipsize);i++){
        x=cx; y=cy+70;
        DrawTable(ctx,table['vip'],x,y,color['vip']);
        ctx.fillStyle="#000";
        ctx.textAlign='center';
        ctx.font = "20px Arial Bold";
        ctx.fillText("VIP Table", x, y);
        ctx.fillText("#"+(i+1), x, y+22);
        ctx.textAlign='left';
        ctx.font = "20px Arial";
        y+=70;
        x-=50;
        for(k=0;k<vipsize;k++,j++){
            if(j>=vips.length)break;
            y+=20;
            if(j!=0 && vips[j]['meal'] != vips[j-1]['meal']) {l++;l%=4;}
            ctx.fillStyle=namecolor[vips[j]['meal']];
            var tt='N/A';
            switch(vips[j]['drink']){
                case 'tea':tt='T';break;
                case 'juice':tt='OJ';break;
                case 'coke':tt='C';break;
                case '7up':tt='U';break;
            }
            ctx.fillText(vips[j]['last_name']+' '+vips[j]['first_name']+' ('+tt+')', x, y);
        }
        cx+=270;
        if(cx>1080){
            cy += 400;
            cx = 80+135;
        }
    }
    //=============   sponsor   =================
    for(i=0,j=0,l=0;i<Math.ceil(sponsors.length/sponsorsize);i++){
        x=cx; y=cy+70;
        DrawTable(ctx,table['sponsor'],x,y,color['sponsor']);
        ctx.fillStyle="#000";
        ctx.textAlign='center';
        ctx.font = "20px Arial Bold";
        ctx.fillText("Sponsor Table", x, y);
        ctx.fillText("#"+(i+1), x, y+22);
        ctx.textAlign='left';
        ctx.font = "20px Arial";
        y+=70;
        x-=50;
        for(k=0;k<sponsorsize;k++,j++){
            if(j>=sponsors.length)break;
            y+=20;
            if(j!=0 && sponsors[j]['meal'] != sponsors[j-1]['meal']) {l++;l%=4;}
            ctx.fillStyle=namecolor[sponsors[j]['meal']];
            var tt='N/A';
            switch(sponsors[j]['drink']){
                case 'tea':tt='T';break;
                case 'juice':tt='OJ';break;
                case 'coke':tt='C';break;
                case '7up':tt='U';break;
            }
            ctx.fillText(sponsors[j]['last_name']+' '+sponsors[j]['first_name']+' ('+tt+')', x, y);
        }
        cx+=270;
        if(cx>1080){
            cy += 400;
            cx = 80+135;
        }
    }
    //=============   guest   =================
    for(i=0,j=0,l=0;i<Math.ceil(guests.length/guestsize);i++){
        x=cx; y=cy+70;
        DrawTable(ctx,table['guest'],x,y,color['guest']);
        ctx.fillStyle="#000";
        ctx.textAlign='center';
        ctx.font = "20px Arial Bold";
        ctx.fillText("Guest Table", x, y);
        ctx.fillText("#"+(i+1), x, y+22);
        ctx.textAlign='left';
        ctx.font = "20px Arial";
        y+=70;
        x-=50;
        for(k=0;k<guestsize;k++,j++){
            if(j>=guests.length)break;
            y+=20;
            if(j!=0 && guests[j]['meal'] != guests[j-1]['meal']) {l++;l%=4;}
            ctx.fillStyle=namecolor[guests[j]['meal']];
            var tt='N/A';
            switch(guests[j]['drink']){
                case 'tea':tt='T';break;
                case 'juice':tt='OJ';break;
                case 'coke':tt='C';break;
                case '7up':tt='U';break;
            }
            ctx.fillText(guests[j]['last_name']+' '+guests[j]['first_name']+' ('+tt+')', x, y);
        }
        cx+=270;
        if(cx>1080){
            cy += 400;
            cx = 80+135;
        }
    }
}