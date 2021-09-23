/**
 * The software is a function that takes a budget and calculates the daily amount to earn, to save,
 * what you can spend, your net worth, net worth needed and net worth missing with a set goal
 * and the time you will reach it based on fixed, variable, future costs, current APY or APR,
 * your working days and your incomes, bank accounts.
 * 
 */



const moment = require('moment')

const {
  daysInThisMonth,
  formatDate,
  nameOfDay,
  daysLeft
} = require('../helpers/handleDates')

const { roundNumber } = require('../helpers/math')

const accounting = async function (budget) {
  const {
    working_days,
    fixed_costs,
    future_costs
  } = budget
  var net_worth = 0
  var tot_income = 0
  var tot_variable_costs = 0
  var tot_future_costs = 0
  var tot_fixed_costs = 0
  var tot_bank_accounts = 0
  var liquidity = 0
  var to_earn = 0

  // calculate all tot costs, incomes and bank accounts and set net_worth and liquidity
  budget.incomes.forEach(income => {
    tot_income = tot_income + income.amount
  })
  budget.variable_costs.forEach(cost => {
    tot_variable_costs = tot_variable_costs + cost.amount
  })
  budget.future_costs.forEach(cost => {
    tot_future_costs = tot_future_costs + cost.amount
  })
  budget.fixed_costs.forEach(cost => {
    tot_fixed_costs = tot_fixed_costs + cost.amount
  })
  budget.bank_accounts.forEach(account => {
    tot_bank_accounts = tot_bank_accounts + account.amount
  })
  liquidity = net_worth = tot_income + tot_bank_accounts

  // group each cost by date

  // reduce fixed_costs by same due_day && transform due_day to a date
  var total_costs = Array.from(
    new Set(fixed_costs.map((d) => d.due_day)),
    function (due_day) {
      return this.reduce((acc, ele) => {
        if(due_day === ele.due_day){
          acc.due_day = due_day
          acc.amount = acc.amount ? acc.amount + ele.amount : ele.amount
          let val = acc.due_day.toString()
          let date
          // if day is 1-9 add a 0 before
          if (val.length === 1) {
            val = 0 + val
            date = moment().format(`YYYY-MM-${val}`)
          } else {
            date = moment().format(`YYYY-MM-${val}`)
          }
          // if due_day is past change date to next month
          let year = moment(date).format('YYYY')
          let month
          let day
          if (moment().format('DD') >= acc.due_day) {
            day = moment(date).format('DD')
            month = Number(moment(date).format('MM')) + 1
            let month_string = month.toString()
            if (month_string.length === 1) {
              month_string = 0 + month_string
            }
            date = moment(`${year}-${month_string}-${day}`).format('YYYY-MM-DD')
          } else {
            day = moment(date).format('DD')
            month = moment(date).format('MM')
            date = moment(`${year}-${month}-${day}`).format('YYYY-MM-DD')
          }
          acc.date = date
        }
        return acc
      },{})
    }, fixed_costs
  )
  total_costs.sort((a, b) => (a.date > b.date) ? 1 : -1)

  // total_costs.forEach(cost => console.log(cost))

  // reduce future costs by date
  const all_future_costs = Array.from(
    new Set(future_costs.map((d) => d.date)),
    function (date) {
      return this.reduce((acc, ele) => {
        if (date.toString() === ele.date.toString()) {
          acc.date = date
          acc.amount = acc.amount ? acc.amount + ele.amount : ele.amount
        }
        return acc
      },{})
    }, future_costs
  )  
  // clean all_future_costs from duplicates
  let uniq = {}
  let new_all_future_costs = []
  for (let i in all_future_costs) {
    objDate = all_future_costs[i]['date']
    uniq[objDate] = all_future_costs[i]
  }
  for (i in uniq) {
    new_all_future_costs.push(uniq[i])
  }
  // clean new_all_future_costs date
  new_all_future_costs.forEach(cost => cost.date = cleanDate(cost.date))
  // new_all_future_costs.forEach(cost => total_costs.push(cost))
  total_costs.sort((a, b) => (a.date > b.date) ? 1 : -1)
  // total_costs.forEach(cost => console.log(cost))
  // console.log('---------------')

  // add new_all_future_costs to total_costs
  // Array.prototype.push.apply(total_costs, new_all_future_costs)
  // total_costs.sort((a, b) => (a.date > b.date) ? 1 : -1)

  // reduce total_costs by date
  const tot_costs = Array.from(
    new Set(total_costs.map((d) => d.date)),
    function (date) {
      return this.reduce((acc, ele) => {
        if (date.toString() === ele.date.toString()) {
          acc.date = date
          acc.amount = acc.amount ? acc.amount + ele.amount : ele.amount
        }else {
          acc.date = date
          acc.amount = acc.amount
        }
        return acc
      },{})
    }, total_costs
  )

  tot_costs.sort((a, b) => (a.date > b.date) ? 1 : -1)
  // tot_costs.forEach(cost => console.log(cost))

  // clean date function, returns date in DD-MM-YYYY
  function cleanDate(date) {
    return moment(date).format('YYYY-MM-DD')
  }

  // console.log(`Variable costs: ${tot_variable_costs}.`)
  // console.log(`Future costs: ${tot_future_costs}.`)
  // console.log(`Fixed costs: ${tot_fixed_costs}.`)
  // console.log(`Net wealth: ${net_worth}.`)
  // console.log(`Liquidity: ${liquidity}.`)
  
  // deduct each cost amount from liquidity
  // if liquidity > 0 => to_earn = 0 because you can cover your costs until that date
  // else liquidity < 0 => to_earn = cost.amount / days_left
  tot_costs.forEach(cost => {
    let now = moment().format("YYYY-MM-DD")
    let days_left = daysLeft(now, cost.date, working_days)
    cost.days_left = days_left
    // if (liquidity > 0) {
    //   liquidity -= cost.amount
    //   to_earn = 0
    // } else {
    //   to_earn = cost.amount / days_left
    // }
    if (days_left != 0) {
      to_earn = cost.amount / days_left
      cost.to_earn = roundNumber(to_earn, 2)
    } else {
      cost.to_earn = cost.amount
    }
  })
  // tot_costs.forEach(cost => console.log(cost))

  //////////////////// do we need this?
  if (tot_costs.length === 0) {
    let cost = {due_day: 0, amount: 0, date: 0}
    tot_costs.push(cost)
  }
  ////////////////////
  to_earn = 0
  for (let cost of tot_costs) {
    to_earn += cost.to_earn
  }
  budget.to_earn = roundNumber(to_earn, 2)
  budget.total_costs = tot_costs
  return budget
}

module.exports = accounting