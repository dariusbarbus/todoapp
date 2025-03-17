<template>
  <div class="app">
    <h1>Todo App</h1>
    <div class="input-container">
      <input v-model="newTask" @keyup.enter="addTask" placeholder="Add a new task..." />
      <select v-model="priority">
        <option value="none">None</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input type="date" v-model="dueDate" />
      <button @click="addTask">Add</button>
    </div>
    <ul>

      <h2>High Priority Tasks</h2>
      <li v-for="(task, index) in highPriorityTasks" :key="index" :class="{ completed: task.completed }">
        <input type="checkbox" v-model="task.completed" @click="removeTask(index)" />
        <span @click="toggleTask(index)">{{ task.text }} - <strong>{{ task.priority }}</strong> - Due: {{ task.dueDate }}</span>
      </li>

      <h2>Medium Priority Tasks</h2>
      <li v-for="(task, index) in mediumPriorityTasks" :key="index" :class="{ completed: task.completed }">
        <input type="checkbox" v-model="task.completed" @click="removeTask(index)" /> 
        <span @click="toggleTask(index)">{{ task.text }} - <strong>{{ task.priority }}</strong> - Due: {{ task.dueDate }}</span>
      </li>

      <h2>Low Priority Tasks</h2>
      <li v-for="(task, index) in lowPriorityTasks" :key="index" :class="{ completed: task.completed }">
        <input type="checkbox" v-model="task.completed" @click="removeTask(index)" />
        <span @click="toggleTask(index)">{{ task.text }} - <strong>{{ task.priority }}</strong> - Due: {{ task.dueDate }}</span>
      </li>

      <h2>No Priority Tasks</h2>
      <li v-for="(task, index) in nonePriorityTasks" :key="index" :class="{ completed: task.completed }">
        <input type="checkbox" v-model="task.completed" @click="removeTask(index)" />
        <span @click="toggleTask(index)">{{ task.text }} - <strong>{{ task.priority }}</strong> - Due: {{ task.dueDate }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const newTask = ref('');
    const priority = ref('none');
    const dueDate = ref('');
    const tasks = ref([]);

    const priorityOrder = { high: 3, medium: 2, low: 1 , none: 0 };

    // sorts all tasks by priority
    const sortedTasks = computed(() => {
      return [...tasks.value].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    });

    // shows only none priority tasks
    const nonePriorityTasks = computed(() => {
      return sortedTasks.value.filter((task) => task.priority === 'none');
    });

    // shows only the low priority tasks
    const lowPriorityTasks = computed(() => {
      return sortedTasks.value.filter((task) => task.priority === 'low');
    });
    
    // shows only the medium priority tasks
    const mediumPriorityTasks = computed(() => {
      return sortedTasks.value.filter((task) => task.priority === 'medium');
    });

    // shows only the high priority tasks
    const highPriorityTasks = computed(() => {
      return sortedTasks.value.filter((task) => task.priority === 'high');
    });

    const addTask = () => {
      if (newTask.value.trim() !== '') {
        tasks.value.push({ text: newTask.value, priority: priority.value, dueDate: dueDate.value, completed: false });
        newTask.value = '';
        priority.value = 'none';
        dueDate.value = '';
      }
    };

    const toggleTask = (index) => {
      tasks.value[index].completed = !tasks.value[index].completed;
    };

    const removeTask = (index) => {
      setTimeout(() => {
        tasks.value.splice(index, 1);
      }, 1000);
    };

    return { newTask, priority, dueDate, tasks, sortedTasks, addTask, toggleTask, removeTask, lowPriorityTasks, mediumPriorityTasks, highPriorityTasks, nonePriorityTasks };
  },
};
</script>

<style scoped>
.app {
  max-width: 400px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}
.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.completed {
  text-decoration: line-through;
  color: gray;
}

</style>
