document.addEventListener('DOMContentLoaded', () => {

  // ---- Auth Logic ----
  const authView = document.getElementById('auth-view');
  const appContainer = document.getElementById('app-container');
  const authForm = document.getElementById('auth-form');
  const mainAuthBtn = document.getElementById('main-auth-btn');
  const authToggleLink = document.getElementById('auth-toggle-link');
  const authToggleMsg = document.getElementById('auth-toggle-msg');
  const authError = document.getElementById('auth-error');
  const btnLogout = document.getElementById('btn-logout');

  let activeAuthMode = 'login'; // 'login' or 'signup'

  function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      authView.style.display = 'none';
      appContainer.style.display = 'flex';
      loadDashboard();
    } else {
      authView.style.display = 'flex';
      appContainer.style.display = 'none';
    }
  }

  function renderAuthMode() {
    if (activeAuthMode === 'login') {
      mainAuthBtn.textContent = 'Login';
      authToggleMsg.textContent = "Don't have an account?";
      authToggleLink.textContent = "Signup";
    } else {
      mainAuthBtn.textContent = 'Signup';
      authToggleMsg.textContent = "Already have an account?";
      authToggleLink.textContent = "Login";
    }
    authError.textContent = '';
  }

  authToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    activeAuthMode = activeAuthMode === 'login' ? 'signup' : 'login';
    renderAuthMode();
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.textContent = '';
    const u = document.getElementById('auth-username').value.trim();
    const p = document.getElementById('auth-password').value.trim();

    try {
      let res;
      if (activeAuthMode === 'login') res = await window.api.login(u, p);
      else res = await window.api.signup(u, p);
      
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
      authForm.reset();
      checkAuth();
    } catch (err) {
      authError.textContent = err.message;
    }
  });

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    checkAuth();
  });

  // ---- Navigation ----
  const navItems = document.querySelectorAll('.sidebar nav li[data-target]');
  const views = document.querySelectorAll('.views section.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      
      views.forEach(v => v.classList.remove('active-view'));
      document.getElementById(targetId).classList.add('active-view');
      
      // Auto refresh data based on view
      if(targetId === 'dashboard-view') loadDashboard();
      if(targetId === 'meetings-view') loadAllMeetings();
      if(targetId === 'tasks-view') loadTasks();
    });
  });

  // ---- Modals ----
  const btnNewMeeting = document.getElementById('btn-new-meeting');
  const createMeetingModal = document.getElementById('create-meeting-modal');
  const btnCloseModal = document.querySelector('.close-modal');

  btnNewMeeting.addEventListener('click', () => {
    createMeetingModal.style.display = 'flex';
  });

  btnCloseModal.addEventListener('click', () => {
    createMeetingModal.style.display = 'none';
  });

  // Close modal on outside click
  createMeetingModal.addEventListener('click', (e) => {
    if(e.target === createMeetingModal) {
      createMeetingModal.style.display = 'none';
    }
  });

  // ---- Dynamic Tasks Input in Form ----
  const btnAddTaskBox = document.getElementById('btn-add-task');
  const tasksContainer = document.getElementById('m-tasks-container');

  btnAddTaskBox.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'task-input-row';
    row.innerHTML = `
      <input type="text" placeholder="Task description" class="t-desc" required>
      <input type="text" placeholder="Assignee" class="t-assign">
      <button type="button" class="btn secondary btn-remove-task">X</button>
    `;
    tasksContainer.appendChild(row);

    row.querySelector('.btn-remove-task').addEventListener('click', () => {
      row.remove();
    });
  });

  // ---- Form Submit ----
  const createMeetingForm = document.getElementById('create-meeting-form');
  createMeetingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('m-title').value;
    const date = document.getElementById('m-date').value;
    const participantsStr = document.getElementById('m-participants').value;
    const minutes = document.getElementById('m-minutes').value;
    const decisionsStr = document.getElementById('m-decisions').value;

    const participants = participantsStr.split(',').map(p => p.trim()).filter(p=>p);
    const decisions = decisionsStr.split(',').map(d => d.trim()).filter(d=>d);

    const taskRows = document.querySelectorAll('.task-input-row');
    const tasks = [];
    taskRows.forEach(row => {
      const desc = row.querySelector('.t-desc').value.trim();
      const assign = row.querySelector('.t-assign').value.trim();
      if(desc) tasks.push({ description: desc, assignee: assign });
    });

    const payload = { title, date, participants, minutes, decisions, tasks };
    
    try {
      await window.api.createMeeting(payload);
      createMeetingForm.reset();
      tasksContainer.innerHTML = ''; // clear tasks
      createMeetingModal.style.display = 'none';
      loadDashboard();
    } catch(err) {
      alert("Error: " + err.message);
    }
  });

  // ---- Data Loaders ----
  async function loadDashboard() {
    try {
      const meetings = await window.api.getMeetings();
      const tasks = await window.api.getTasks();

      document.getElementById('stat-meetings').textContent = meetings.length;
      document.getElementById('stat-tasks-pending').textContent = tasks.filter(t => t.status !== 'Completed').length;

      const listContainer = document.getElementById('dashboard-meetings-list');
      listContainer.innerHTML = '';
      
      if(meetings.length === 0) {
        listContainer.innerHTML = '<p class="empty-state">No meetings found.</p>';
        return;
      }

      // Display top 3 for dashboard
      meetings.slice(0, 3).forEach(m => {
        listContainer.appendChild(createMeetingCard(m));
      });
    } catch(err) {
      console.error(err);
      if (err.message.includes('token') || err.message.includes('denied')) checkAuth();
    }
  }

  async function loadAllMeetings(search = '') {
    try {
      const meetings = await window.api.getMeetings(search);
      const listContainer = document.getElementById('all-meetings-list');
      listContainer.innerHTML = '';
      
      if(meetings.length === 0) {
        listContainer.innerHTML = '<p class="empty-state">No meetings found.</p>';
        return;
      }

      meetings.forEach(m => {
        listContainer.appendChild(createMeetingCard(m));
      });
    } catch(err) {
      console.error(err);
    }
  }

  async function loadTasks() {
    try {
      const tasks = await window.api.getTasks();
      const tbody = document.getElementById('tasks-tbody');
      tbody.innerHTML = '';

      if(tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No tasks assigned yet.</td></tr>';
        return;
      }

      tasks.forEach(task => {
        const tr = document.createElement('tr');
        
        const mTitle = task.meetingId ? task.meetingId.title : 'N/A';
        const selectId = `status-select-${task._id}`;
        
        tr.innerHTML = `
          <td>${task.description}</td>
          <td>${task.assignee || 'Unassigned'}</td>
          <td>${mTitle}</td>
          <td>
            <span style="color: var(--status-${task.status === 'Completed' ? 'completed' : task.status==='Pending'?'pending':'progress'})">
              ${task.status}
            </span>
          </td>
          <td>
            <select class="status-select" id="${selectId}">
              <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </td>
        `;

        tbody.appendChild(tr);

        // Add change listener
        document.getElementById(selectId).addEventListener('change', async (e) => {
          const newStatus = e.target.value;
          try {
            await window.api.updateTaskStatus(task._id, newStatus);
            loadTasks(); 
          } catch(err) {
            alert("Failed to update status");
            e.target.value = task.status; 
          }
        });
      });

    } catch(err) {
      console.error(err);
    }
  }

  // --- Helper to build UI card ---
  function createMeetingCard(m) {
    const card = document.createElement('div');
    card.className = 'meeting-card';
    if(m.status === 'Cancelled') card.style.opacity = '0.7';
    
    const dateStr = new Date(m.date).toLocaleString([], {
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
    let partsHtml = m.participants && m.participants.length ? `• Participants: ${m.participants.join(', ')}` : '';
    let decsHtml = m.decisions && m.decisions.length ? `• Decisions: ${m.decisions.join(', ')}` : '';
    let minHtml = m.minutes ? `<div class="meeting-details" style="margin-top: 10px;"><b>Minutes:</b> ${m.minutes}</div>` : '';

    let statusMarkup = m.status === 'Cancelled' ? `<span class="status-cancelled"><strong>[CANCELLED]</strong></span>` : '';
    let cancelBtnMarkup = m.status === 'Scheduled' ? `<button class="btn btn-sm btn-cancel cancel-btn" data-id="${m._id}">Cancel Meeting</button>` : '';

    card.innerHTML = `
      <div class="meeting-header-actions">
        <h3>${m.title} ${statusMarkup}</h3>
        ${cancelBtnMarkup}
      </div>
      <div class="meeting-meta">${dateStr}</div>
      <div class="meeting-details">${partsHtml}</div>
      <div class="meeting-details">${decsHtml}</div>
      ${minHtml}
    `;

    // Bind cancel event
    const cancelBtn = card.querySelector('.cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', async (e) => {
        if (confirm("Are you sure you want to cancel this meeting?")) {
          try {
            await window.api.cancelMeeting(m._id);
            // Reload the view we are currently on
            const activeView = document.querySelector('.sidebar nav li.active').getAttribute('data-target');
            if (activeView === 'dashboard-view') loadDashboard();
            if (activeView === 'meetings-view') loadAllMeetings(document.getElementById('global-search').value);
          } catch (err) {
            alert(err.message);
          }
        }
      });
    }

    return card;
  }

  // ---- Global Search ----
  const searchInput = document.getElementById('global-search');
  const searchBtn = document.getElementById('search-btn');

  searchBtn.addEventListener('click', () => doSearch());
  searchInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') doSearch();
  });

  function doSearch() {
    const q = searchInput.value.trim();
    document.querySelector('.sidebar nav li[data-target="meetings-view"]').click();
    loadAllMeetings(q);
  }

  // Initial Load Check
  checkAuth();
});
