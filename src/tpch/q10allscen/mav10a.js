//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query10a_mav(){
  return select()
    .open("@l_returnflag")
    .from("@customer","@orders","@lineitem","@nation")
    .field("@c_custkey","@c_name",
      as(sum(mul("@l_extendedprice",sub(1,"@l_discount"))), "revenue"),
        "@c_acctbal","@n_name","@c_address","@c_phone","@c_comment")
    .where(eq("@c_custkey","@o_custkey"),
           eq("@l_orderkey","@o_orderkey"),
           gte("@o_orderdate",date('1993-10-01')),
           lt("@o_orderdate",date('1994-01-01')),
           eq("@c_nationkey","@n_nationkey"))
    .group("@c_custkey","@c_name","@c_acctbal","@c_phone","@n_name","@c_address","@c_comment")
    .order("-@revenue")
    .limit(20);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query10a_mav;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
