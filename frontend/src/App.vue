<template>
  <div id="app">
    <h1>Todo App with Calendar</h1>

    <!-- vue-cal component for calendar -->
    <vue-cal
      class="vuecal--blue-theme"
      :events="calendarEvents"
      active-view="month"
      :time-from="10 * 60"
      events-on-month-view
    >
      <!-- Custom slot to display task details inside the month view -->
      <template #event="{ event }">
        <div class="event-container">
          <span class="vuecal__event-title">{{ event.title }}</span>
          <hr />
        </div>
      </template>
    </vue-cal>

    <!-- Task form -->
    <form @submit.prevent="addTask">
      <input v-model="newTask.title" placeholder="Task title" required />
      <select v-model="newTask.priority">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="none">None</option>
      </select>
      <input v-model="newTask.dueDate" type="date" />
      <button type="submit">Add Task</button>
    </form>

    <!-- Task List -->
    <ul>
<h4>High Priority Tasks</h4>
<ul>
  <li v-for="task in highPriorityTasks" :key="task.id">
    <input type="checkbox" @change="deleteTask(task.id)" />
    <span>{{ task.title }} - Priority: {{ task.priority }} - Due: {{ task.dueDate }}</span>
  </li>
</ul>

<h4>Medium Priority Tasks</h4>
<ul>
  <li v-for="task in mediumPriorityTasks" :key="task.id">
    <input type="checkbox" @change="deleteTask(task.id)" />
    <span>{{ task.title }} - Priority: {{ task.priority }} - Due: {{ task.dueDate }}</span>
  </li>
</ul>

<h4>Low Priority Tasks</h4>
<ul>
  <li v-for="task in lowPriorityTasks" :key="task.id">
    <input type="checkbox" @change="deleteTask(task.id)" />
    <span>{{ task.title }} - Priority: {{ task.priority }} - Due: {{ task.dueDate }}</span>
  </li>
</ul>

<h4>No Priority Tasks</h4>
<ul>
  <li v-for="task in nonePriorityTasks" :key="task.id">
    <input type="checkbox" @change="deleteTask(task.id)" />
    <span>{{ task.title }} - Priority: {{ task.priority }} - Due: {{ task.dueDate }}</span>
  </li>
</ul>

      
      <h4>No Priority Tasks</h4>
      <li v-for="task in nonePriorityTasks" :key="task.id">
        <input type="checkbox" @change="deleteTask(task.id)" />
        <span>{{ task.title }} - Priority: {{ task.priority }} - Due: {{ task.dueDate }}</span>
      </li>


    </ul>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  components: {
    VueCal,
  },
  setup() {
    const today = ref(new Date().toISOString().split('T')[0]);
    const tasks = ref([]);
    const newTask = ref({
      title: '',
      priority: 'high',
      dueDate: '',
    });
    const calendarEvents = ref([]);

    const priorityOrder = {high: 3, medium: 2, low: 1, none: 0};

    const sortedTasks = computed(() => {
      return [...tasks.value].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    });

    const highPriorityTasks = computed(() => {
  return sortedTasks.value.filter((task) => task.priority === 'high');
});

const mediumPriorityTasks = computed(() => {
  return sortedTasks.value.filter((task) => task.priority === 'medium');
});

const lowPriorityTasks = computed(() => {
  return sortedTasks.value.filter((task) => task.priority === 'low');
});

    const nonePriorityTasks = computed(() => {
      return sortedTasks.value.filter((task) => task.priority === 'none');
    });

    const fetchTasks = () => {
      axios.get('http://localhost:3000/api/tasks')
        .then(response => {
          tasks.value = response.data;
          updateCalendarEvents();
        })
        .catch(error => console.error('Error fetching tasks:', error));
    };

    const addTask = () => {
      axios.post('http://localhost:3000/api/tasks', newTask.value)
        .then(response => {
          tasks.value.push(response.data);
          newTask.value.title = '';
          newTask.value.dueDate = '';
          updateCalendarEvents();
        })
        .catch(error => console.error('Error adding task:', error));
    };

    const deleteTask = (taskId) => {
      axios.delete(`http://localhost:3000/api/tasks/${taskId}`)
        .then(() => {
          tasks.value = tasks.value.filter(task => task.id !== taskId);
          updateCalendarEvents();
        })
        .catch(error => console.error('Error deleting task:', error));
    };

    const updateCalendarEvents = () => {
      calendarEvents.value = tasks.value.map(task => ({
        start: task.dueDate,
        end: task.dueDate,
        title: task.title,
      }));
    };

    onMounted(fetchTasks);

    return {
      tasks,
      newTask,
      calendarEvents,
      fetchTasks,
      addTask,
      deleteTask,
      nonePriorityTasks,
      sortedTasks,
      lowPriorityTasks,
      mediumPriorityTasks,  
      highPriorityTasks,
    };
  },
};
</script>

<style scoped>
.vuecal--blue-theme {
  width: 100%;
  height: 70vh;
}

.event-container {
  padding: 4px;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 4px;
}

.vuecal__event-title {
  font-weight: bold;
}

.vuecal__event-time {
  font-size: 0.8rem;
  color: #555;
}
</style>
