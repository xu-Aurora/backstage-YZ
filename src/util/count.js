//加法  解决小数加丢失精度问题
export function accAdd(arg1,arg2){  
	var r1,r2,m;  
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
  m=Math.pow(10,Math.max(r1,r2))
	return numDiv((mul(arg1,m)+mul(arg2,m)),m) 
}
//减法  解决小数加丢失精度问题
export function accSub(arg1,arg2){   
  var r1,r2,m,n;	
  try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}	
  try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}	
  m=Math.pow(10,Math.max(r1,r2));
  //动态控制精度长度	
  n=(r1>=r2)?r1:r2;	
  return (numDiv((mul(arg1,m)-mul(arg2,m)),m)).toFixed(n)  
}
//乘法  解决小数加丢失精度问题    
export function mul(a, b) {
  var c = 0,
      d = a.toString(),
      e = b.toString();
  try {
      c += d.split(".")[1].length;
  } catch (f) {}
  try {
      c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
//除法  解决小数加丢失精度问题    

export function numDiv(a, b) {
  var c, d, e = 0,
  f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}