//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined');
if(typeof module == 'undefined'){          
  var module={};                           
} else {                                   
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function dataSource(src,funk){                        
  this.type="";
  this.qr=null;
  this.fname="";                                 
  this.file=null;                                
  this.parser=null;
  this.name=null;
  this.numrows=-1;
  this.numcols=-1;
  this.colnames=null;
  this.coltypes=null;
  this.colptrs=null;
//
  var handyColNames={};
  var handyColTypes={};

handyColNames["nation"]=[
"N_NATIONKEY",
"N_NAME",
"N_REGIONKEY",
"N_COMMENT"];
handyColTypes["nation"]=[
0,
2,
0,
2];
handyColNames["region"]=[
"R_REGIONKEY",
"R_NAME",
"R_COMMENT"];
handyColTypes["region"]=[
0,
2,
2];
handyColNames["part"]=[
"P_PARTKEY",
"P_NAME",
"P_MFGR",
"P_BRAND",
"P_TYPE",
"P_SIZE",
"P_CONTAINER",
"P_RETAILPRICE",
"P_COMMENT"];
handyColTypes["part"]=[
0,
2,
2,
2,
2,
0,
2,
1,
2];
handyColNames["supplier"]=[
"S_SUPPKEY",
"S_NAME",
"S_ADDRESS",
"S_NATIONKEY",
"S_PHONE",
"S_ACCTBAL",
"S_COMMENT"];
handyColTypes["supplier"]=[
0,
2,
2,
0,
2,
1,
2];

handyColNames["partsupp"]=[
"PS_PARTKEY",
"PS_SUPPKEY",
"PS_AVAILQTY",
"PS_SUPPLYCOST",
"PS_COMMENT"];
handyColTypes["partsupp"]=[
0,
0,
0,
1,
2];

handyColNames["customer"]=[
"C_CUSTKEY",
"C_NAME",
"C_ADDRESS",
"C_NATIONKEY",
"C_PHONE",
"C_ACCTBAL",
"C_MKTSEGMENT",
"C_COMMENT"];
handyColTypes["customer"]=[
0,
2,
2,
0,
2,
1,
2,
2];

handyColNames["orders"]=[
"o_orderkey",
"o_custkey",
"o_orderstatus",
"o_totalprice",
"o_orderdate",
"o_orderpriority",
"o_clerk",
"o_shippriority",
"o_comment"];
handyColTypes["orders"]=[
0,
0,
4,
1,
3,
2,
2,
0,
2];

handyColNames["lineitem"]=[
"l_orderkey",     //0
"l_partkey",      //0
"l_suppkey",      //0
"l_linenumber",   //0
"l_quantity",     //1
"l_extendedprice",//1
"l_discount",     //1
"l_tax",          //1
"l_returnflag",
"l_linestatus",
"l_shipdate",
"l_commitdate",
"l_receiptdate",
"l_shipinstruct",
"l_shipmode",
"l_comment"];
handyColTypes["lineitem"]=[
0,
0,
0,
0,
1,
1,
1,
1,
4,
4,
3,
3,
3,
2,
2,
2];



handyColNames["myview"]=[
"l_orderkey",
"revenue",
"o_orderdate",
"o_shippriority"];
handyColTypes["myview"]=[
0,
1,
3,
0];
  this.useFnameHints = function(fname){
    doti=fname.indexOf('.');
    tabname=fname.substring(0,doti);
    this.name=tabname;
    fname=fname.substring(doti+1,fname.length);
    this.numrows=parseInt(fname.substring(0,fname.indexOf('.')));
    this.colnames=handyColNames[tabname];
    this.coltypes=handyColTypes[tabname];

    if (this.name&&this.numrows&&this.colnames&&this.coltypes){
      this.numcols=this.colnames.length;
      DEBUG('found table in handy tables')
    }
    else{
      this.name='orders';
      this.numrows=1500000;
      this.colnames=handyColNames[tabname];
      this.coltypes=handyColTypes[tabname];
      this.numcols=this.colnames.length;
      //alert('un able to auto load table:'+ tabname);
    }
  }

  this.fromQuery = function(qr){
    this.type='query';
    this.qr=qr;
    var ptrcolptrs= malloc(qr.numcols<<2);
    for (var i=0;i<qr.numcols;i++){
      mem32[(ptrcolptrs+(i<<2))>>2]= src.cols[i];
    }
    this.name=qr.name;
    this.fname=null;
    this.numrows=qr.numrows;
    this.numcols=qr.numcols;
    this.colptrs=ptrcolptrs;
    this.colnames=qr.colnames;
    this.coltypes=qr.coltypes;
  }
  this.fromMonetJSON= function(src){
    var monetJSONParser= require('./monetJSONParser.js');
    this.type='monetjsn';
    this.fname=null;

    this.name='monetdb_qid'+src.queryid;
    this.fname=null;
    this.numrows=src.rows;
    this.numcols=src.cols;
    this.colptrs=null;
    this.colnames=Object.keys(src.col);
    this.coltypes=[];
    for (var i=0;i<src.structure.length;i++){
      console.log('i:'+i);
      if (src.structure[i].type== 'int')
        this.coltypes.push(0);
      else if (src.structure[i].type== 'decimal')
        this.coltypes.push(1);
      else if (src.structure[i].type== 'varchar')
        this.coltypes.push(2);
      else if (src.structure[i].type== 'date')
        this.coltypes.push(3);
      else if (src.structure[i].type== 'char')
        this.coltypes.push(4);
      else {
        consolue.log('unsupported data types from monetdb:i'+i);
        consolue.log('unsupported data types from monetdb:' + src.structure[i].type );
      }
    }
    this.parser=new monetJSONParser(src);
  }
  this.fromHTML5File= function(file,funk){//firefox browser file                  
      console.log('@fromHTML5File');
      this.type='html5';
      this.fname=file.name;                  
      this.file=file;                        
      this.useFnameHints(this.fname);
      this.parser=new html5FileParser(file,funk);
  }
  this.fromFile = function(fname){
      var nodeFileParser= require('./nodeFileParser.js');
      this.type='realpath';
      this.fname=fname;// filename   
      this.parser=new nodeFileParser(fname);
      lstslsh=fname.lastIndexOf('/') + 1;
      fname=fname.substring(lstslsh,fname.length);
      this.useFnameHints(fname);
  }
//constructor

  if (inNode){
    queryResult=require('./queryResult.js');
  }
  if (src instanceof queryResult){
    this.fromQuery(src);
  } else if ((typeof File !=='undefined')&&(src instanceof File)){
    this.fromHTML5File(src,funk);
  } else if (typeof src == 'string' && (inNode)){
    this.fromFile(src);
  } else if (typeof src.data !== 'undefined'){
    this.fromMonetJSON(src);
  } else {
    console.log('Unsupported DS type');
  };
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){                              
  console.log('exporting dataSource');       
  module.exports=dataSource;  
}else delete module;                     
//////////////////////////////////////////////////////////////////////////////
