<template>
  <div id="app">
    
    <div v-if="showCalendar" class="calendar-container">
      <vue-cal
        class="vuecal--blue-theme responsive-calendar"
        :events="calendarEvents"
        active-view="month"
        :time-from="10 * 60"
        events-on-month-view
        :time="false"
        :disable-views="['years', 'year', 'week']"
      >
        <template #event="{ event }">
          <div class="event-container">
            <span class="vuecal__event-title">{{ event.title }}</span>
            <hr />
          </div>
        </template>
      </vue-cal>
    </div>

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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  components: { VueCal },
  setup() {
    const showCalendar = ref(false);
    const tasks = ref([]);
    const newTask = ref({ title: '', priority: 'high', dueDate: '' });
    const calendarEvents = ref([]);

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

    const updateCalendarEvents = () => {
      calendarEvents.value = tasks.value.map(task => ({
        start: task.dueDate,
        end: task.dueDate,
        title: task.title,
      }));
    };

    const toggleCalendar = () => {
      showCalendar.value = !showCalendar.value;
    };

    onMounted(fetchTasks);

    return { tasks, newTask, calendarEvents, addTask, showCalendar, toggleCalendar };
  }
};
</script>

<style scoped>
.responsive-calendar {
  width: 90vw;
  max-width: 1200px;
  height: 70vh;
  max-height: 80vh;
  overflow: auto;
}

.calendar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

@media (max-width: 768px) {
  .responsive-calendar {
    width: 95vw;
    height: 60vh;
  }
}

@media (max-width: 480px) {
  .responsive-calendar {
    width: 100vw;
    height: 50vh;
  }
}

.toggle-btn {
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.toggle-btn:hover {
  background-color: #0056b3;
}
</style>
