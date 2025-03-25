<template>
  <div id="app">
    
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

    <div class="calendar-container">
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
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
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

    const deleteTask = (id) => {
      tasks.value = tasks.value.filter(task => task.id !== id);
      updateCalendarEvents();
    };

    const updateCalendarEvents = () => {
      calendarEvents.value = tasks.value.map(task => ({
        start: task.dueDate,
        end: task.dueDate,
        title: task.title,
      }));
    };


    const highPriorityTasks = computed(() => tasks.value.filter(task => task.priority === 'high'));
    const mediumPriorityTasks = computed(() => tasks.value.filter(task => task.priority === 'medium'));
    const lowPriorityTasks = computed(() => tasks.value.filter(task => task.priority === 'low'));
    const nonePriorityTasks = computed(() => tasks.value.filter(task => task.priority === 'none'));

    onMounted(fetchTasks);

    return { 
      tasks, newTask, calendarEvents, addTask, deleteTask,
      highPriorityTasks, mediumPriorityTasks, lowPriorityTasks, nonePriorityTasks
    };
  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh; /* Ensures the page fills the height */
}

form {
  margin: 20px 0; /* Space around the form */
  width: 100%;
  max-width: 600px; /* Limit the form's width on large screens */
}

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
  margin-bottom: 20px; /* Space below the calendar */
}

.task-list-container {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

ul {
  padding-left: 20px;
}

@media (max-width: 768px) {
  .responsive-calendar {
    width: 95vw;
    height: 60vh;
  }

  form {
    max-width: 90vw; /* Ensure the form doesn't stretch too much on small screens */
  }
}

@media (max-width: 480px) {
  .responsive-calendar {
    width: 100vw;
    height: 50vh;
  }
}

</style>