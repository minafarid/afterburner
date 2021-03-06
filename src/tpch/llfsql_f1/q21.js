//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query21(noasm){
  sup_nat=abdb.select()
    .from("nation").join("supplier").on("n_nationkey","s_nationkey")
    .field("s_name","s_suppkey")
    .where(_eq("n_name",'MOROCCO'))
    .materialize(noasm);
  
  lin_ord=abdb.select()
    .from("lineitem").join("orders").on("l_orderkey","o_orderkey")
    .field(_as("l_suppkey","l1l_suppkey"),_as("l_orderkey","l1l_orderkey"))
    .where(_eq("o_orderstatus",'F'),
      _gt("l_receiptdate","l_commitdate"))
    .materialize(noasm);
  
  lin_sup=abdb.select()
    .from(lin_ord).join(sup_nat).on("l1l_suppkey","s_suppkey")
    .field("s_name","l1l_suppkey","l1l_orderkey")
    .materialize(noasm);
  
  lin2_ord=abdb.select()
    .from(lin_sup).infrom("lineitem").isin("l1l_orderkey","l_orderkey")
    .where(_neq("l1l_suppkey","l_suppkey"))
    .field("s_name","l1l_suppkey","l1l_orderkey")
    .materialize(noasm);
  
  return abdb.select()
    .from(lin2_ord).infrom("lineitem").isnotin("l1l_orderkey","l_orderkey")
    .where(_neq("l1l_suppkey","l_suppkey"),
      _gt("l_receiptdate","l_commitdate"))
    .field("s_name",_as(_count("*"),"numwait"))
    .group("s_name")
    .order("-numwait","s_name")
    .limit(100);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query21;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
