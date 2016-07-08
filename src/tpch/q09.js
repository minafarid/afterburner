
function query9(){
  sup_nat=ABi.select()
	.from("supplier").join("nation").on("s_nationkey","n_nationkey")
	.field("s_suppkey",as("n_name","nation"))
	.materialize();

  par_line=ABi.select()
	.from("lineitem").join("part").on("l_partkey","p_partkey")
	.field("l_suppkey","l_orderkey","l_extendedprice","l_discount","l_quantity","l_partkey")
	.where(like("p_name", '%green%'))
	.materialize();

  par_line_sup=ABi.select()
    .from(par_line).join(sup_nat).on("l_suppkey","s_suppkey")
	.field("nation","l_orderkey","l_extendedprice","l_discount","l_quantity","l_suppkey","l_partkey")
	.materialize();

  par_line_sup_ps=ABi.select()
    .from("partsupp").join(par_line_sup).on("ps_partkey","l_partkey")
	.field("nation","l_orderkey","l_extendedprice","l_discount","l_quantity","ps_supplycost")
	.where(eq("ps_suppkey","l_suppkey"))
	.materialize();

  profit=ABi.select()
  .from("orders").join(par_line_sup_ps).on("o_orderkey","l_orderkey")
  .field("nation",as(toYear("o_orderdate"),"o_year"),
     as(sub(mul("l_extendedprice", sub(1 , "l_discount")),mul("ps_supplycost","l_quantity")),"amount"))
  .materialize();
  
  return ABi.select()
  .from(profit)
  .field("nation","o_year",sum("amount"))
  .group("nation","o_year")
  .order([0,-1])
  .limit(200);
}