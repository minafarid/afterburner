//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query16(noasm){
  bad_sup=ABi.select()
  .from("supplier")
  .field("s_suppkey")
  .where(_like("s_comment",'%Customer%Complaints%'))
  .toArray(noasm)  

  ps_par=ABi.select()
  .from("partsupp").join("part").on("ps_partkey","p_partkey")
  .field("p_brand","p_type","p_size","ps_suppkey",_count("*"))
  .where(_neq("p_brand",'Brand#21'),
         _not(_like("p_type",'PROMO PLATED%')),
         _isin("p_size",[23, 3, 33, 29, 40, 27, 22, 4]),
		 _not(_isin("ps_suppkey",bad_sup))
		)
  .group("p_brand","p_type","p_size","ps_suppkey")
  .materialize(noasm);

  return ABi.select()
    .from(ps_par)
    .field("p_brand","p_type","p_size",_as(_count("ps_suppkey"),"supplier_cnt"))
    .group("p_brand","p_type","p_size")
    .order("-supplier_cnt","p_brand","p_type","p_size")
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query16;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
