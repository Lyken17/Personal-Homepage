import news from './news.yaml'

// Keep entries with the same month in their editorial order.
export default [...news].sort((left, right) => right.date.localeCompare(left.date))
