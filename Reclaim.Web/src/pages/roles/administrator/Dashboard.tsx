import { useEffect, useMemo, useState } from 'react'
import * as Model from 'api/model'
import AggregateBox from 'components/AggregateBox'
import Map from 'components/Map'
import News from 'components/News'
import StackedBarChart from 'components/StackedBarChart'
import { Log } from 'helpers/log'

const AdministratorDashboard = () => {
  const dashboardApi = useMemo(
    () => new Model.DashboardClient(process.env.REACT_APP_API_URL),
    []
  )

  const [dashboard, setDashboard] = useState<Model.AdministratorDashboard>()
  useEffect(() => {
    ;(async () => {
      try {
        const result = await dashboardApi.getAdministrator()
        setDashboard(result)
      } catch (error) {
        Log.add(JSON.stringify(error))
      }
    })()
  }, [dashboardApi])

  return (
    <div className="dashboard">
      <div className="header">Dashboard</div>
      <div className={dashboard === undefined ? 'element-loading' : 'element-loaded'}>
        <div className="row no-gutter aggregates">
          <AggregateBox
            title={'Claims under investigation'}
            data={dashboard?.claimsValueUnderInvestigation}
          />
          <AggregateBox title={'Monthly revenue'} data={dashboard?.monthlyRevenue} />
          <AggregateBox title={'New orders'} data={dashboard?.newOrders} />
          <AggregateBox title={'Unique signins'} data={dashboard?.uniqueSignins} />
        </div>
        <div className="dashboard-chart">
          <span className="header">Monthly Investigations</span>
          <StackedBarChart data={dashboard?.claimsByMonth} />
        </div>
        <div className="row no-gutter">
          <div className="col-lg-6">
            <div className="dashboard-news">
              <span className="header">News</span>
              <News />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="dashboard-map">
              <span className="header">Investigations by state</span>
              <Map data={dashboard?.claimsByState} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdministratorDashboard
