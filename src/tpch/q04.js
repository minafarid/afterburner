//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query4(noasm){
  distinct_orders=abdb.select()
    .from("lineitem")
    .field("l_orderkey")
    .where(_lt("l_commitdate","l_receiptdate"))
    .group("l_orderkey")
    .materialize(noasm);
  
  return abdb.select()
    .from("orders").join(distinct_orders).on("o_orderkey","l_orderkey")
    .field("o_orderpriority", _as(_count("o_orderpriority"),'order_count'))
    .where(
      _gte("o_orderdate", _date("1993-07-01")),
      _lt("o_orderdate", _date( "1993-10-01")))
    .group("o_orderpriority")
    .order("o_orderpriority");

}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query4;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
