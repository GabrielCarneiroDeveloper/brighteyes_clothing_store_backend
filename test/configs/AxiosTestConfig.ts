import Axios from 'axios'

const axiosTest = Axios.create({
  baseURL: `http://127.0.0.1:3333`,
})

export { axiosTest }
