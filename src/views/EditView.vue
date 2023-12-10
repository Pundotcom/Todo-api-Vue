<script setup>
import { useTodoStore } from '../stores/todo'
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import Loading from '../components/Loading.vue'

const route = useRoute();
const todoId = ref(-1);
const todoStore = useTodoStore();
const isLoading = ref(false)
const isUpdated = ref(false)

onMounted(async () => {
    await todoStore.loadTodo(route.params.id)
    isLoading.value = true
    todoId.value = parseInt(route.params.id)
})
const editTodo = async (selectedTodo) => {
    try {
        isLoading.value = false
        const bodyData = {
            name: selectedTodo.name,
            status: selectedTodo.status
        }
        await todoStore.editTodo(bodyData, selectedTodo.id)
        isUpdated.value = true
        isLoading.value = true
        setTimeout(() => {
            isUpdated.value = false
        },1500)
    } catch (error) {
        console.log('error', error)
    }
}
</script>


<template>
    <div class="w-1/2 mx-auto">
        <div v-if="isUpdated" class="toast toast-top toast-start">
            <div class="alert alert-success">
                <span>Update Successfull.</span>
            </div>
        </div>
        <RouterLink :to="{ name: 'todo-list' }">
            <div>
                <button class="btn btn-outline btn-warning">Back to Home</button>
            </div>
        </RouterLink>
        <div v-if="isLoading">
            <div class="flex mt-4 subpixel-antialiased">
                ID : {{ todoId }}
            </div>
            <label class="form-control w-full mt-4">
                <div class="label">
                    <span class="label-text">Name</span>
                </div>
                <input type="text" placeholder="Type here todo" class="input input-bordered input-primary w-full"
                    v-model="todoStore.selectedTodo.name" />
            </label>

            <label class="form-control w-full mt-4">
                <div class="label">
                    <span class="label-text">Status</span>
                </div>
                <select v-model="todoStore.selectedTodo.status" class="select select-primary w-full">
                    <option value="">Select status</option>
                    <option v-for="status in todoStore.statuses" :value="status">{{ status }}</option>
                </select>
            </label>

            <div class="flex">
                <button class="btn btn-outline btn-secondary mt-3 w-full"
                    @click="editTodo(todoStore.selectedTodo)">Edit</button>
            </div>
        </div>
        <div v-else>
            <Loading></Loading>
        </div>
    </div>
</template>