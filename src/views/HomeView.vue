<script setup>
import { onMounted, ref ,computed } from 'vue';
import { useTodoStore } from '../stores/todo'
import { RouterLink } from 'vue-router';
import Loading from '../components/Loading.vue'

const todoStore = useTodoStore();
const todoText = ref();
const isLoading = ref(false);
const selectedStatus = ref('Pending')

const filterTodolist = computed(() => {
    return todoStore.list.filter(todo => todo.status === selectedStatus.value)
})

onMounted(async () => {
    isLoading.value = true;
    await todoStore.loadTodos();
    isLoading.value = false;
})


const addTodo = async (todoText) => {
    try {
        isLoading.value = true;
        await todoStore.addTodo(todoText);
        isLoading.value = false;
    } catch (error) {
        console.log('error', error);
    }
}
const editStatus = async (todoData, todoId) => {
    try {
        isLoading.value = true;
        const updateData = {
            name: todoData.name,
            status: todoData.status
        }
        await todoStore.editTodo(updateData, todoId);
        isLoading.value = false;
    } catch (error) {
        console.log('error', error);
    }
}

const deleteTodo = async (todoId) => {
    try {
        isLoading.value = true;
        await todoStore.removeTodo(todoId)
        await todoStore.loadTodos()
        isLoading.value = false;
    } catch (error) {
        console.log('error', error);
    }
}

const changeStatus = async (event, todoId) => {
    isLoading.value = true;
    try {
        if (event.target.checked) {
            await todoStore.editTodo({ status: 'Done' }, todoId);
        } else {
            await todoStore.editTodo({ status: 'Doing' }, todoId);
        }
        await todoStore.loadTodos();
    } catch (error) {
        console.log('error', error)
    }
    isLoading.value = false;
}

const changeSelectedStatus = async (newStatus) => {
    selectedStatus.value = newStatus
}
</script>

<style scope>
svg {
    fill: white;
}
</style>

<template>
    <div>
        <div class="flex">
            <input class="input input-bordered w-full" type="text" v-model="todoText" placeholder="Item Name">
            <button class="btn btn-primary ml-2 px-8" @click="addTodo(todoText)">Add</button>
        </div>
        <div role="tablist" class="tabs tabs-boxed mt-6">
            <a v-for="status in todoStore.statuses" role="tab" 
            :class="status === selectedStatus ? 'tab tab-active' : 'tab'"
            @click="changeSelectedStatus(status)">
                {{ status }}
            </a>
        </div>
        <Loading v-if="isLoading">
        </Loading>
        <div>
            <div class="flex item-center justify-between mt-8" v-for="todo in filterTodolist" :key="todo.id">
                <div>
                    <input type="checkbox" :checked="todo.status === 'Done'" class="checkbox"
                        @change="changeStatus($event, todo.id)" />
                </div>
                <div :class="todo.status === 'Done' ? 'line-through text-red-400' : ''">{{ todo.name }}</div>
                <div>
                    <RouterLink :to="{ name: 'todo-edit', params: { id: todo.id } }">
                        <button class="btn btn-square btn-outline mx-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                                viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
                                <path
                                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                            </svg>
                        </button>
                    </RouterLink>
                    <button class="btn btn-square btn-outline btn-error" @click="deleteTodo(todo.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18"
                            viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
                            <path
                                d="M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                        </svg>
                    </button>
                </div>
            </div>‹
        </div>
    </div>
</template>


