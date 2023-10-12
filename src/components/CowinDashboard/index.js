// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusOptions = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusOptions.initial,
    vaccination7days: [],
    byAGe: [],
    byGender: [],
  }

  componentDidMount() {
    this.getVaccinationDetails()
  }

  getVaccinationDetails = async () => {
    this.setState({apiStatus: apiStatusOptions.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const fetched7daysVaccinationInfo = data.last_7_days_vaccination
      const fetchedVaccinationByAge = data.vaccination_by_age
      const fetchedVaccinationByGender = data.vaccination_by_gender

      this.setState({
        apiStatus: apiStatusOptions.success,
        vaccination7days: fetched7daysVaccinationInfo,
        byAGe: fetchedVaccinationByAge,
        byGender: fetchedVaccinationByGender,
      })
    } else {
      this.setState({apiStatus: apiStatusOptions.failure})
    }
  }

  renderToCharts = () => {
    const {vaccination7days, byAGe, byGender} = this.state

    return (
      <>
        <VaccinationCoverage vaccination7daysDetails={vaccination7days} />
        <VaccinationByGender vaccinationByGenderDetails={byGender} />
        <VaccinationByAge vaccinationByAgeDetails={byAGe} />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-text">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderOutput = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusOptions.success:
        return this.renderToCharts()
      case apiStatusOptions.failure:
        return this.renderFailureView()
      case apiStatusOptions.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-head">Co-WIN</h1>
        </div>
        <h1 className="main-head">CoWIN Vaccination in India</h1>
        {this.renderOutput()}
      </div>
    )
  }
}

export default CowinDashboard
