/* ============================================================
   Minutes — Master-Detail App Logic
   Mirrors the MeetingDashboard.jsx React component behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── State ────────────────────────────────────────────────
  let meetings = [];
  let selectedMeeting = null;
  let activeFilter = 'all';
  let searchQuery = '';
  let activeTab = 'minutes';
  let editingMinutes = false;
  let showTaskForm = false;
  let authMode = 'login'; // 'login' | 'signup'

  // ─── Element refs ──────────────────────────────────────────
  const authView       = document.getElementById('auth-view');
  const appShell       = document.getElementById('app-shell');
  const authForm       = document.getElementById('auth-form');
  const authError      = document.getElementById('auth-error');
  const authSubmitBtn  = document.getElementById('auth-submit-btn');
  const authToggleLink = document.getElementById('auth-toggle-link');
  const authToggleMsg  = document.getElementById('auth-toggle-msg');
  const authCardTitle  = document.getElementById('auth-card-title');
  const authCardSub    = document.getElementById('auth-card-sub');
  const authPwToggle   = document.getElementById('auth-pw-toggle');
  const authPwInput    = document.getElementById('auth-password');
  const btnLogout      = document.getElementById('btn-logout');

  const statMeetings   = document.getElementById('stat-meetings');
  const statOpenTasks  = document.getElementById('stat-open-tasks');
  const statThisMonth  = document.getElementById('stat-this-month');

  const searchInput    = document.getElementById('search-input');
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const meetingsWrap   = document.getElementById('meetings-list-wrap');
  const noMeetingsMsg  = document.getElementById('no-meetings-msg');

  const emptyDetail    = document.getElementById('empty-detail');
  const detailPanel    = document.getElementById('detail-panel');
  const newMeetingPanel = document.getElementById('new-meeting-panel');

  const detailTitle    = document.getElementById('detail-title');
  const detailBadge    = document.getElementById('detail-badge');
  const detailDatetime = document.getElementById('detail-datetime');
  const btnCloseDetail = document.getElementById('btn-close-detail');

  const tabBtns        = document.querySelectorAll('.tab-btn');

  // Minutes
  const minutesDisplay = document.getElementById('minutes-display');
  const minutesEditor  = document.getElementById('minutes-editor');
  const btnEditMinutes = document.getElementById('btn-edit-minutes');
  const minutesActions = document.getElementById('minutes-actions');
  const minutesSaveActions = document.getElementById('minutes-save-actions');
  const btnSaveMinutes     = document.getElementById('btn-save-minutes');
  const btnCancelMinutes   = document.getElementById('btn-cancel-minutes');

  // Notes
  const notesDisplay     = document.getElementById('notes-display');
  const notesEditor      = document.getElementById('notes-editor');
  const btnEditNotes     = document.getElementById('btn-edit-notes');
  const notesActions     = document.getElementById('notes-actions');
  const notesSaveActions = document.getElementById('notes-save-actions');
  const btnSaveNotes     = document.getElementById('btn-save-notes');
  const btnCancelNotes   = document.getElementById('btn-cancel-notes');

  // Decisions
  const decisionsList   = document.getElementById('decisions-list');
  const newDecisionInput = document.getElementById('new-decision-input');
  const btnAddDecision   = document.getElementById('btn-add-decision');

  // Tasks
  const tasksList           = document.getElementById('tasks-list');
  const btnToggleTaskForm   = document.getElementById('btn-toggle-task-form');
  const taskFormBox         = document.getElementById('task-form-box');
  const newTaskText         = document.getElementById('new-task-text');
  const newTaskAssignee     = document.getElementById('new-task-assignee');
  const newTaskDue          = document.getElementById('new-task-due');
  const btnAddTask          = document.getElementById('btn-add-task');
  const btnCancelTaskForm   = document.getElementById('btn-cancel-task-form');

  // Participants
  const participantsList = document.getElementById('participants-list');

  // New meeting
  const btnNewMeeting     = document.getElementById('btn-new-meeting');
  const btnCancelNew      = document.getElementById('btn-cancel-new-meeting');
  const btnCreateMeeting  = document.getElementById('btn-create-meeting');
  const nmTitle           = document.getElementById('nm-title');
  const nmDate            = document.getElementById('nm-date');
  const nmTime            = document.getElementById('nm-time');
  const nmFacilitator     = document.getElementById('nm-facilitator');
  const nmParticipantInput = document.getElementById('nm-participant-input');
  const nmParticipantsChips = document.getElementById('nm-participants-chips');
  const btnAddParticipant  = document.getElementById('btn-add-participant');
  const nmMinutes         = document.getElementById('nm-minutes');
  const nmMinutesCustom   = document.getElementById('nm-minutes-custom');
  const nmNotes           = document.getElementById('nm-notes');
  const nmDecisions       = document.getElementById('nm-decisions');

  // ─── Participant chips state ───────────────────────────────
  let nmParticipants = []; // array of { name, role, initials, color }
  const CHIP_COLORS = ['#40916C','#9B2226','#1864AB','#CA6702','#5C4033','#AE2012','#1B4332','#7D4E00'];

  function addParticipantChip(name) {
    name = name.trim();
    if (!name || nmParticipants.some(p => p.name.toLowerCase() === name.toLowerCase())) return;
    const color = CHIP_COLORS[nmParticipants.length % CHIP_COLORS.length];
    const p = { name, role: 'attendee', initials: initials(name), color };
    nmParticipants.push(p);
    renderParticipantChips();
  }

  function removeParticipantChip(name) {
    nmParticipants = nmParticipants.filter(p => p.name !== name);
    renderParticipantChips();
  }

  function renderParticipantChips() {
    nmParticipantsChips.innerHTML = '';
    nmParticipants.forEach(p => {
      const chip = document.createElement('span');
      chip.style.cssText = `display:inline-flex; align-items:center; gap:5px; padding:3px 10px 3px 8px; background:${p.color}18; border:1px solid ${p.color}44; border-radius:20px; font-size:12px; font-family:'DM Sans',sans-serif; color:#1a1a1a;`;
      chip.innerHTML = `
        <span style="width:18px;height:18px;border-radius:50%;background:${p.color};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex-shrink:0;">${escHtml(p.initials)}</span>
        ${escHtml(p.name)}
        <button type="button" style="background:none;border:none;cursor:pointer;color:#868E96;font-size:14px;line-height:1;padding:0;margin-left:2px;" data-name="${escHtml(p.name)}">&times;</button>
      `;
      chip.querySelector('button').addEventListener('click', () => removeParticipantChip(p.name));
      nmParticipantsChips.appendChild(chip);
    });
  }

  btnAddParticipant.addEventListener('click', () => {
    addParticipantChip(nmParticipantInput.value);
    nmParticipantInput.value = '';
    nmParticipantInput.focus();
  });

  nmParticipantInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipantChip(nmParticipantInput.value);
      nmParticipantInput.value = '';
    }
  });

  // Show/hide custom duration input
  nmMinutes.addEventListener('change', () => {
    const isCustom = nmMinutes.value === 'custom';
    nmMinutesCustom.style.display = isCustom ? 'block' : 'none';
    if (isCustom) nmMinutesCustom.focus();
  });

  // ─── Auth ─────────────────────────────────────────────────
  function checkAuth() {
    if (localStorage.getItem('token')) {
      authView.style.display = 'none';
      appShell.style.display = 'flex';
      loadMeetings();
    } else {
      authView.style.display = 'flex';
      appShell.style.display = 'none';
    }
  }

  function setAuthMode(mode) {
    authMode = mode;
    if (mode === 'login') {
      if (authCardTitle) authCardTitle.textContent = 'Welcome back';
      if (authCardSub)   authCardSub.textContent   = 'Sign in to your account to continue.';
      authSubmitBtn.textContent = 'Sign in';
      authToggleMsg.textContent = "Don't have an account?";
      authToggleLink.textContent = 'Create one free';
    } else {
      if (authCardTitle) authCardTitle.textContent = 'Create your account';
      if (authCardSub)   authCardSub.textContent   = 'Start capturing meetings for free — no credit card needed.';
      authSubmitBtn.textContent = 'Get started free';
      authToggleMsg.textContent = 'Already have an account?';
      authToggleLink.textContent = 'Sign in';
    }
    authError.textContent = '';
  }

  // Password show/hide toggle
  if (authPwToggle && authPwInput) {
    authPwToggle.addEventListener('click', () => {
      const isText = authPwInput.type === 'text';
      authPwInput.type = isText ? 'password' : 'text';
      authPwToggle.textContent = isText ? '👁' : '👀';
    });
  }

  authToggleLink.addEventListener('click', e => {
    e.preventDefault();
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  });

  authForm.addEventListener('submit', async e => {
    e.preventDefault();
    authError.textContent = '';
    const u = document.getElementById('auth-username').value.trim();
    const p = document.getElementById('auth-password').value.trim();
    try {
      const res = authMode === 'login'
        ? await window.api.login(u, p)
        : await window.api.signup(u, p);
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
    meetings = [];
    selectedMeeting = null;
    checkAuth();
  });

  // ─── Data Loading ─────────────────────────────────────────
  async function loadMeetings() {
    try {
      meetings = await window.api.getMeetings(searchQuery, activeFilter);
      renderSidebar();
      updateStats();
      if (selectedMeeting) {
        // Refresh the selected meeting from the new data
        const refreshed = meetings.find(m => m._id === selectedMeeting._id);
        if (refreshed) {
          selectedMeeting = refreshed;
          renderDetailPanel();
        }
      }
    } catch (err) {
      if (err.message && (err.message.includes('token') || err.message.includes('denied'))) {
        checkAuth();
      }
    }
  }

  // ─── Stats ────────────────────────────────────────────────
  function updateStats() {
    statMeetings.textContent = meetings.length;
    const openTasks = meetings.reduce((sum, m) =>
      sum + (m.actionItems || []).filter(a => a.status !== 'done').length, 0);
    statOpenTasks.textContent = openTasks;
    statOpenTasks.className = 'stat-val' + (openTasks > 0 ? ' warn' : '');
    const thisMonth = new Date().toISOString().slice(0, 7);
    statThisMonth.textContent = meetings.filter(m => m.date && m.date.startsWith(thisMonth)).length;
  }

  // ─── Sidebar Rendering ────────────────────────────────────
  function renderSidebar() {
    // Remove old cards
    const oldCards = meetingsWrap.querySelectorAll('.meeting-card');
    oldCards.forEach(c => c.remove());

    if (meetings.length === 0) {
      noMeetingsMsg.style.display = 'block';
      return;
    }
    noMeetingsMsg.style.display = 'none';

    meetings.forEach(m => {
      const card = buildMeetingCard(m);
      meetingsWrap.appendChild(card);
    });
  }

  function buildMeetingCard(m) {
    const card = document.createElement('div');
    card.className = 'meeting-card' + (selectedMeeting && selectedMeeting._id === m._id ? ' active' : '');
    card.dataset.id = m._id;

    const dateStr = formatDate(m.date, m.time);
    const openCount = (m.actionItems || []).filter(a => a.status !== 'done').length;
    const avatarHtml = buildAvatarStack(m.participants || []);

    card.innerHTML = `
      <div class="meeting-card-top">
        <p class="meeting-card-title">${escHtml(m.title)}</p>
        ${badgeHtml(m.status)}
      </div>
      <div class="meeting-card-bottom">
        <span class="meeting-card-meta">${dateStr}</span>
        <div class="avatar-stack">${avatarHtml}</div>
      </div>
      ${openCount > 0 ? `<div class="open-tasks-label">${openCount} open task${openCount > 1 ? 's' : ''}</div>` : ''}
    `;

    card.addEventListener('click', () => selectMeeting(m));
    return card;
  }

  function buildAvatarStack(participants) {
    const shown = participants.slice(0, 4);
    const rest = participants.length - 4;
    let html = shown.map((p, i) =>
      `<div class="avatar" style="background:${p.color || '#2D6A4F'}; margin-left:${i === 0 ? 0 : -8}px; z-index:${i};" title="${escHtml(p.name)}">${escHtml(p.initials || initials(p.name))}</div>`
    ).join('');
    if (rest > 0) {
      html += `<div class="avatar-overflow">+${rest}</div>`;
    }
    return html;
  }

  // ─── Meeting Selection ────────────────────────────────────
  function selectMeeting(m) {
    selectedMeeting = m;
    activeTab = 'minutes';
    editingMinutes = false;
    showTaskForm = false;

    // Update sidebar active state
    document.querySelectorAll('.meeting-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === m._id);
    });

    showDetailPanel();
    renderDetailPanel();
  }

  function showDetailPanel() {
    emptyDetail.style.display = 'none';
    newMeetingPanel.style.display = 'none';
    detailPanel.style.display = 'flex';
    detailPanel.classList.remove('fade-in');
    void detailPanel.offsetWidth; // reflow
    detailPanel.classList.add('fade-in');
  }

  function renderDetailPanel() {
    if (!selectedMeeting) return;
    const m = selectedMeeting;

    // Header
    detailTitle.textContent = m.title;
    detailBadge.innerHTML = badgeHtml(m.status);
    detailDatetime.textContent = formatDateLong(m.date, m.time);

    // Tabs
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === activeTab);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === 'tab-' + activeTab);
    });

    renderMinutesTab(m);
    renderNotesTab(m);
    renderDecisionsTab(m);
    renderTasksTab(m);
    renderParticipantsTab(m);
  }

  // ─── Tabs ─────────────────────────────────────────────────
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderDetailPanel();
    });
  });

  // ─── Minutes Tab ──────────────────────────────────────────
  function renderMinutesTab(m) {
    const hasMinutes = m.minutes && m.minutes.trim();
    minutesDisplay.textContent = hasMinutes ? m.minutes : 'No minutes recorded yet. Click Edit to add notes.';
    minutesDisplay.className = 'minutes-text' + (hasMinutes ? '' : ' empty');
    minutesEditor.value = m.minutes || '';

    setMinutesEditing(false);
  }

  function setMinutesEditing(on) {
    editingMinutes = on;
    minutesDisplay.style.display = on ? 'none' : 'block';
    minutesEditor.style.display = on ? 'block' : 'none';
    minutesActions.style.display = on ? 'none' : 'block';
    minutesSaveActions.style.display = on ? 'flex' : 'none';
  }

  btnEditMinutes.addEventListener('click', () => setMinutesEditing(true));
  btnCancelMinutes.addEventListener('click', () => {
    minutesEditor.value = selectedMeeting ? (selectedMeeting.minutes || '') : '';
    setMinutesEditing(false);
  });

  btnSaveMinutes.addEventListener('click', async () => {
    if (!selectedMeeting) return;
    try {
      const updated = await window.api.updateMeeting(selectedMeeting._id, { minutes: minutesEditor.value });
      patchLocal(updated);
      setMinutesEditing(false);
    } catch (err) {
      alert('Failed to save minutes: ' + err.message);
    }
  });

  // ─── Notes Tab ────────────────────────────────────────────
  let editingNotes = false;

  function renderNotesTab(m) {
    const hasNotes = m.notes && m.notes.trim();
    notesDisplay.textContent = hasNotes ? m.notes : 'No notes added yet. Click Edit to add context or follow-ups.';
    notesDisplay.className = 'notes-preview' + (hasNotes ? '' : ' empty');
    notesEditor.value = m.notes || '';
    setNotesEditing(false);
  }

  function setNotesEditing(on) {
    editingNotes = on;
    notesDisplay.style.display = on ? 'none' : 'block';
    notesEditor.style.display = on ? 'block' : 'none';
    notesActions.style.display = on ? 'none' : 'block';
    notesSaveActions.style.display = on ? 'flex' : 'none';
  }

  btnEditNotes.addEventListener('click', () => setNotesEditing(true));
  btnCancelNotes.addEventListener('click', () => {
    notesEditor.value = selectedMeeting ? (selectedMeeting.notes || '') : '';
    setNotesEditing(false);
  });

  btnSaveNotes.addEventListener('click', async () => {
    if (!selectedMeeting) return;
    try {
      const updated = await window.api.updateMeeting(selectedMeeting._id, { notes: notesEditor.value });
      patchLocal(updated);
      renderNotesTab(selectedMeeting);
      setNotesEditing(false);
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    }
  });

  // ─── Decisions Tab ────────────────────────────────────────
  function renderDecisionsTab(m) {
    decisionsList.innerHTML = '';
    if (!m.decisions || m.decisions.length === 0) {
      decisionsList.innerHTML = `<p style="color:#ADB5BD; font-size:13px; font-style:italic;">No decisions recorded yet.</p>`;
      return;
    }
    m.decisions.forEach(d => {
      const div = document.createElement('div');
      div.className = 'decision-item';
      div.innerHTML = `<span class="decision-check">✓</span><p class="decision-text">${escHtml(d)}</p>`;
      decisionsList.appendChild(div);
    });
  }

  newDecisionInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') btnAddDecision.click();
  });

  btnAddDecision.addEventListener('click', async () => {
    if (!selectedMeeting || !newDecisionInput.value.trim()) return;
    try {
      const decisions = [...(selectedMeeting.decisions || []), newDecisionInput.value.trim()];
      const updated = await window.api.updateMeeting(selectedMeeting._id, { decisions });
      newDecisionInput.value = '';
      patchLocal(updated);
      renderDecisionsTab(selectedMeeting);
    } catch (err) {
      alert('Failed to add decision: ' + err.message);
    }
  });

  // ─── Tasks Tab ────────────────────────────────────────────
  function renderTasksTab(m) {
    // Task form visibility
    taskFormBox.style.display = showTaskForm ? 'flex' : 'none';

    tasksList.innerHTML = '';
    if (!m.actionItems || m.actionItems.length === 0) {
      tasksList.innerHTML = `<p style="color:#ADB5BD; font-size:13px; font-style:italic;">No tasks assigned yet.</p>`;
      return;
    }
    m.actionItems.forEach(task => {
      const item = document.createElement('div');
      item.className = 'task-item' + (task.status === 'done' ? ' done' : '');

      const checked = task.status === 'done';
      const taskBadge = taskBadgeHtml(task.status);
      const metaParts = [];
      if (task.assignee) metaParts.push(`→ ${escHtml(task.assignee)}`);
      if (task.due) metaParts.push(`Due ${formatShortDate(task.due)}`);

      item.innerHTML = `
        <button class="task-checkbox${checked ? ' checked' : ''}" data-taskid="${task._id || task.id}" title="Toggle done"></button>
        <div class="task-main">
          <p class="task-text${checked ? ' done' : ''}">${escHtml(task.text)}</p>
          ${metaParts.length ? `<p class="task-meta">${metaParts.join(' · ')}</p>` : ''}
        </div>
        <button class="task-status-cycle" data-taskid="${task._id || task.id}" style="background:none;border:none;cursor:pointer;padding:0;flex-shrink:0;">${taskBadge}</button>
      `;

      // Toggle done
      item.querySelector('.task-checkbox').addEventListener('click', () => cycleTaskStatus(task, 'toggle'));
      // Cycle status
      item.querySelector('.task-status-cycle').addEventListener('click', () => cycleTaskStatus(task, 'cycle'));

      tasksList.appendChild(item);
    });
  }

  async function cycleTaskStatus(task, mode) {
    if (!selectedMeeting) return;
    let newStatus;
    if (mode === 'toggle') {
      newStatus = task.status === 'done' ? 'open' : 'done';
    } else {
      const cycle = { open: 'in-progress', 'in-progress': 'done', done: 'open' };
      newStatus = cycle[task.status] || 'open';
    }
    const taskId = task._id || task.id;
    const updatedItems = (selectedMeeting.actionItems || []).map(t =>
      (t._id || t.id) === taskId ? { ...t, status: newStatus } : t
    );
    try {
      const updated = await window.api.updateMeeting(selectedMeeting._id, { actionItems: updatedItems });
      patchLocal(updated);
      renderTasksTab(selectedMeeting);
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  }

  btnToggleTaskForm.addEventListener('click', () => {
    showTaskForm = !showTaskForm;
    taskFormBox.style.display = showTaskForm ? 'flex' : 'none';
  });

  btnCancelTaskForm.addEventListener('click', () => {
    showTaskForm = false;
    taskFormBox.style.display = 'none';
    newTaskText.value = '';
    newTaskAssignee.value = '';
    newTaskDue.value = '';
  });

  btnAddTask.addEventListener('click', async () => {
    if (!selectedMeeting || !newTaskText.value.trim()) return;
    const newTask = {
      text: newTaskText.value.trim(),
      assignee: newTaskAssignee.value.trim(),
      due: newTaskDue.value,
      status: 'open'
    };
    const updatedItems = [...(selectedMeeting.actionItems || []), newTask];
    try {
      const updated = await window.api.updateMeeting(selectedMeeting._id, { actionItems: updatedItems });
      newTaskText.value = '';
      newTaskAssignee.value = '';
      newTaskDue.value = '';
      showTaskForm = false;
      taskFormBox.style.display = 'none';
      patchLocal(updated);
      renderTasksTab(selectedMeeting);
    } catch (err) {
      alert('Failed to add task: ' + err.message);
    }
  });

  // ─── Participants Tab ─────────────────────────────────────
  function renderParticipantsTab(m) {
    participantsList.innerHTML = '';
    if (!m.participants || m.participants.length === 0) {
      participantsList.innerHTML = `<p style="color:#ADB5BD; font-size:13px; font-style:italic;">No participants added.</p>`;
      return;
    }
    m.participants.forEach(p => {
      const item = document.createElement('div');
      item.className = 'participant-item';
      item.innerHTML = `
        <div class="avatar-lg" style="background:${p.color || '#2D6A4F'}; width:38px; height:38px; border-radius:50%; color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; flex-shrink:0;">${escHtml(p.initials || initials(p.name))}</div>
        <div>
          <p class="participant-name">${escHtml(p.name)}</p>
          <p class="participant-role">${escHtml(p.role || 'attendee')}</p>
        </div>
      `;
      participantsList.appendChild(item);
    });
  }

  // ─── Delete Meeting ───────────────────────────────────────
  document.getElementById('btn-delete-meeting').addEventListener('click', async () => {
    if (!selectedMeeting) return;
    const confirmed = confirm(`Permanently delete "${selectedMeeting.title}"? This cannot be undone.`);
    if (!confirmed) return;
    try {
      await window.api.deleteMeeting(selectedMeeting._id);
      meetings = meetings.filter(m => m._id !== selectedMeeting._id);
      selectedMeeting = null;
      detailPanel.style.display = 'none';
      emptyDetail.style.display = 'flex';
      updateStats();
      renderSidebar();
    } catch (err) {
      alert('Failed to delete meeting: ' + err.message);
    }
  });

  // ─── Close Detail ─────────────────────────────────────────
  btnCloseDetail.addEventListener('click', () => {
    selectedMeeting = null;
    document.querySelectorAll('.meeting-card').forEach(c => c.classList.remove('active'));
    detailPanel.style.display = 'none';
    emptyDetail.style.display = 'flex';
  });

  // ─── New Meeting ──────────────────────────────────────────
  btnNewMeeting.addEventListener('click', () => {
    selectedMeeting = null;
    document.querySelectorAll('.meeting-card').forEach(c => c.classList.remove('active'));
    detailPanel.style.display = 'none';
    emptyDetail.style.display = 'none';
    newMeetingPanel.style.display = 'block';
    newMeetingPanel.classList.remove('fade-in');
    void newMeetingPanel.offsetWidth;
    newMeetingPanel.classList.add('fade-in');
  });

  btnCancelNew.addEventListener('click', () => {
    newMeetingPanel.style.display = 'none';
    emptyDetail.style.display = 'flex';
    clearNewForm();
  });

  btnCreateMeeting.addEventListener('click', async () => {
    if (!nmTitle.value.trim()) {
      nmTitle.focus();
      return;
    }

    // Merge facilitator + chip participants
    const facilitatorName = nmFacilitator.value.trim();
    const participants = [];
    if (facilitatorName) {
      participants.push({ name: facilitatorName, role: 'facilitator', initials: initials(facilitatorName), color: '#2D6A4F' });
    }
    nmParticipants.forEach(p => participants.push(p));

    const decisionsRaw = nmDecisions.value.trim();
    const decisions = decisionsRaw ? decisionsRaw.split(',').map(d => d.trim()).filter(Boolean) : [];

    const chosenDate = nmDate.value || new Date().toISOString().split('T')[0];
    // Build a full datetime for accurate comparison — if no time picked, treat as end-of-day
    const autoStatus = (() => {
      const now = new Date();
      if (nmTime.value) {
        // nmTime.value is "HH:MM" (24h from input[type=time])
        const meetingDt = new Date(`${chosenDate}T${nmTime.value}:00`);
        return meetingDt < now ? 'completed' : 'upcoming';
      }
      // No time — compare dates only; past dates = completed, today/future = upcoming
      return chosenDate < now.toISOString().split('T')[0] ? 'completed' : 'upcoming';
    })();

    const payload = {
      title: nmTitle.value.trim(),
      date: chosenDate,
      time: nmTime.value ? formatTime12(nmTime.value) : '10:00 AM',
      status: autoStatus,
      participants,
      minutes: nmMinutes.value === 'custom'
        ? nmMinutesCustom.value.trim()
        : nmMinutes.value,
      notes: nmNotes.value.trim(),
      decisions,
      actionItems: []
    };

    try {
      const created = await window.api.createMeeting(payload);
      meetings = [created, ...meetings];
      clearNewForm();
      newMeetingPanel.style.display = 'none';
      updateStats();
      renderSidebar();
      selectMeeting(created);
    } catch (err) {
      alert('Failed to create meeting: ' + err.message);
    }
  });

  function clearNewForm() {
    nmTitle.value = '';
    nmDate.value = '';
    nmTime.value = '';
    nmFacilitator.value = '';
    nmParticipants = [];
    nmParticipantInput.value = '';
    renderParticipantChips();
    nmMinutes.selectedIndex = 0;
    nmMinutesCustom.style.display = 'none';
    nmMinutesCustom.value = '';
    nmNotes.value = '';
    nmDecisions.value = '';
  }

  // ─── Search & Filter ──────────────────────────────────────
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    loadMeetings();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === activeFilter));
      loadMeetings();
    });
  });

  // ─── Local state patch ────────────────────────────────────
  function patchLocal(updated) {
    meetings = meetings.map(m => m._id === updated._id ? updated : m);
    selectedMeeting = updated;
    updateStats();
    renderSidebar();
  }

  // ─── Helpers ──────────────────────────────────────────────
  const PALETTE = ['#2D6A4F','#1B4332','#40916C','#9B2226','#AE2012','#CA6702','#5C4033','#1864AB'];
  let paletteIdx = 0;
  function nextColor() { return PALETTE[paletteIdx++ % PALETTE.length]; }

  function initials(name) {
    return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDate(date, time) {
    if (!date) return '';
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + (time ? ' · ' + time : '');
  }

  function formatDateLong(date, time) {
    if (!date) return '';
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (time ? ' · ' + time : '');
  }

  function formatShortDate(date) {
    if (!date) return '';
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  function formatTime12(timeStr) {
    // timeStr is "HH:MM" from input[type=time]
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  function badgeHtml(status) {
    const map = {
      completed:   { cls: 'badge-completed',   label: 'Completed' },
      upcoming:    { cls: 'badge-upcoming',     label: 'Upcoming' },
      'in-progress':{ cls: 'badge-in-progress', label: 'In Progress' },
      cancelled:   { cls: 'badge-cancelled',    label: 'Cancelled' },
      'Scheduled': { cls: 'badge-upcoming',     label: 'Scheduled' },
      'Cancelled': { cls: 'badge-cancelled',    label: 'Cancelled' },
    };
    const s = map[status] || { cls: 'badge-upcoming', label: status || 'Upcoming' };
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  function taskBadgeHtml(status) {
    const map = {
      open:         { cls: 'badge-open',        label: 'Open' },
      'in-progress':{ cls: 'badge-in-progress', label: 'In Progress' },
      done:         { cls: 'badge-done',         label: 'Done' },
    };
    const s = map[status] || map['open'];
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  // ─── Init ─────────────────────────────────────────────────
  // Pre-select login vs signup based on ?mode= from landing page
  const urlMode = new URLSearchParams(window.location.search).get('mode');
  if (urlMode === 'signup' || urlMode === 'login') setAuthMode(urlMode);

  checkAuth();
});
