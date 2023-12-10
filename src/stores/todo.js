import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'https://6560aa1383aba11d99d14d5f.mockapi.io'

export const useTodoStore = defineStore('todo', {
  state: () => ({ // กำหนดข้อมูล state ที่จะเก็บใน store นี้
    list: [],
    selectedTodo: {},
    statuses: ['Pending', 'Doing', 'Done']
  }),
  actions: {
    async loadTodos () {  //Get ทั้งหมด
      try {
        const response = await axios.get(`${BASE_URL}/todos`)
        this.list = response.data
      } catch (error) {
        console.log('error', error)
      }
    },
    async loadTodo (id) { // Get บาง id
      try {
        const response = await axios.get(`${BASE_URL}/todos/${id}`)
        this.selectedTodo = response.data
      } catch (error) {
        console.log('error', error)
      }
    },
    async addTodo (todoText) { // Post เข้าไป
      const bodyData = {
        name: todoText,
        status: 'Pending'
      }
      try {
        const response = await axios.post(`${BASE_URL}/todos`, bodyData)
        console.log(response.data)
        this.list.push(response.data)
      } catch (error) {
        console.log('error', error)
      }
    },
    async editTodo (todoData, id) { // update ที่มีอยู่แล้ว 
      try {
        const bodyData = {
          name: todoData.name,
          status: todoData.status
        }
        const response = await axios.put(`${BASE_URL}/todos/${id}`, bodyData)
        console.log(response.data)
      } catch (error) {
        console.log('error', error)
      }
    },
    async removeTodo (id) { // romove
      try {
        const response = await axios.delete(`${BASE_URL}/todos/${id}`)
        console.log(response.data)
      } catch (error) {
        console.log('error', error)
      }
    }
  }
})