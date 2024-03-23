import React, { useMemo } from "react";

interface OrderStats {
  revenue: number;
  nbNewOrders: number;
  pendingOrders: Order[];
}

interface State {
  nbNewOrders?: number;
  pendingOrders?: Order[];
  recentOrders?: Order[];
  revenue?: number;
}

const Dashboard = () => {
  const aMonthAgo = useMemo(() => subDays(startOfDay(new Date()), 30), []);

  // const { data: orders } = useGetList<Order>('commands', {
  //     filter: { date_gte: aMonthAgo.toISOString() },
  //     sort: { field: 'date', order: 'DESC' },
  //     pagination: { page: 1, perPage: 50 },
  // });

  // const aggregation = useMemo<State>(() => {
  //     if (!orders) return {};
  //     const aggregations = orders
  //         .filter(order => order.status !== 'cancelled')
  //         .reduce(
  //             (stats: OrderStats, order) => {
  //                 if (order.status !== 'cancelled') {
  //                     stats.revenue += order.total;
  //                     stats.nbNewOrders++;
  //                 }
  //                 if (order.status === 'ordered') {
  //                     stats.pendingOrders.push(order);
  //                 }
  //                 return stats;
  //             },
  //             {
  //                 revenue: 0,
  //                 nbNewOrders: 0,
  //                 pendingOrders: [],
  //             }
  //         );
  //     return {
  //         recentOrders: orders,
  //         revenue: aggregations.revenue,
  //         nbNewOrders: aggregations.nbNewOrders,
  //         pendingOrders: aggregations.pendingOrders,
  //     };
  // }, [orders]);
  //
  // const { nbNewOrders, pendingOrders, revenue, recentOrders } = aggregation;
  return (
    <>
      DASHBOARD
      <Grid container spacing={1}>
        {/*<Grid item xs={12}>*/}
        {/*    <MonthlyRevenue value={revenue} />*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12}>*/}
        {/*    <NbNewOrders value={nbNewOrders} />*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12}>*/}
        {/*    <PendingOrders orders={pendingOrders} />*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12}>*/}
        {/*    <PendingReviews />*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12}>*/}
        {/*    <NewCustomers />*/}
        {/*</Grid>*/}
      </Grid>
    </>
  );
};

export default Dashboard;
